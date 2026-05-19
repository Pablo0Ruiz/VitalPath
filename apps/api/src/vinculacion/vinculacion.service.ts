import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

import {
  ConflictException,
  ForbiddenException,
  GoneException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { VinculacionPacienteCuidador } from './entities/vinculacion.entity';
import { VincularDto } from './dto/vincular.dto';
import { GenerarCodigoResponseDto } from './dto/generar-codigo.dto';
import { EstadoVinculo } from './enum/estado-vinculo.enum';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class VinculacionService {
  constructor(
    @InjectModel(VinculacionPacienteCuidador.name)
    private readonly vinculacionModel: Model<VinculacionPacienteCuidador>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly configService: ConfigService,
  ) {}

  async generarCodigo(pacienteId: string): Promise<GenerarCodigoResponseDto> {
    const pacienteOid = new Types.ObjectId(pacienteId);

    const existing = await this.vinculacionModel.findOne({
      paciente_id: pacienteOid,
      estado_vinculo: EstadoVinculo.PENDIENTE,
      codigoExpireAt: { $gt: new Date() },
    });

    if (existing && existing.codigoExpireAt) {
      const { codigo, lookupHash, bcryptHash, expireAt } =
        await this.generateCode();
      existing.codigo_lookup = lookupHash;
      existing.codigo_vinculacion = bcryptHash;
      existing.codigoExpireAt = expireAt;
      await existing.save();
      return { codigo, expireAt };
    }

    for (let attempt = 0; attempt < 3; attempt++) {
      const { codigo, lookupHash, bcryptHash, expireAt } =
        await this.generateCode();
      try {
        await this.vinculacionModel.create({
          paciente_id: pacienteOid,
          cuidador_id: null,
          tipo_vinculo: null,
          codigo_lookup: lookupHash,
          codigo_vinculacion: bcryptHash,
          codigoExpireAt: expireAt,
          estado_vinculo: EstadoVinculo.PENDIENTE,
        });
        return { codigo, expireAt };
      } catch (error: unknown) {
        const mongoErr = error as { code?: number };
        if (mongoErr.code === 11000 && attempt < 2) {
          continue;
        }
        throw error;
      }
    }

    throw new ConflictException(
      'No se pudo generar un código único. Intentá de nuevo.',
    );
  }

  async vincular(
    cuidadorId: string,
    dto: VincularDto,
  ): Promise<VinculacionPacienteCuidador> {
    const lookupHash = this.hmac(dto.codigo);
    const cuidadorOid = new Types.ObjectId(cuidadorId);

    const vinculacion = await this.vinculacionModel.findOne({
      codigo_lookup: lookupHash,
    });

    if (!vinculacion) {
      throw new NotFoundException('Código inválido o no encontrado');
    }

    if (
      !vinculacion.codigoExpireAt ||
      vinculacion.codigoExpireAt <= new Date()
    ) {
      throw new GoneException({
        message: 'El código ha expirado',
        error: 'CODE_EXPIRED',
      });
    }

    if (vinculacion.estado_vinculo !== EstadoVinculo.PENDIENTE) {
      throw new ConflictException({
        message: 'El código ya fue utilizado',
        error: 'CODE_ALREADY_USED',
      });
    }

    const codeMatches = await bcrypt.compare(
      dto.codigo,
      vinculacion.codigo_vinculacion ?? '',
    );
    if (!codeMatches) {
      throw new NotFoundException('Código inválido o no encontrado');
    }
    const alreadyLinked = await this.vinculacionModel.findOne({
      cuidador_id: cuidadorOid,
      paciente_id: vinculacion.paciente_id,
      estado_vinculo: EstadoVinculo.ACTIVO,
    });

    if (alreadyLinked) {
      throw new ConflictException({
        message: 'Ya estás vinculado con este paciente',
        error: 'ALREADY_LINKED',
      });
    }

    const updated = await this.vinculacionModel.findOneAndUpdate(
      {
        _id: vinculacion._id,
        estado_vinculo: EstadoVinculo.PENDIENTE,
        cuidador_id: null,
      },
      {
        $set: {
          cuidador_id: cuidadorOid,
          tipo_vinculo: dto.tipo_vinculo,
          estado_vinculo: EstadoVinculo.ACTIVO,
        },
        $unset: {
          codigo_lookup: 1,
          codigo_vinculacion: 1,
          codigoExpireAt: 1,
        },
      },
      { new: true },
    );

    if (!updated) {
      throw new ConflictException({
        message: 'El código ya fue utilizado',
        error: 'CODE_ALREADY_USED',
      });
    }

    return updated;
  }

  async revocar(
    pacienteId: string,
    vinculacionId: string,
  ): Promise<VinculacionPacienteCuidador> {
    if (!Types.ObjectId.isValid(vinculacionId)) {
      throw new NotFoundException('Vinculación no encontrada');
    }

    const vinculacion = await this.vinculacionModel.findById(vinculacionId);
    if (!vinculacion) {
      throw new NotFoundException('Vinculación no encontrada');
    }

    if (vinculacion.paciente_id.toString() !== pacienteId.toString()) {
      throw new ForbiddenException(
        'No tenés permiso para revocar esta vinculación',
      );
    }

    vinculacion.estado_vinculo = EstadoVinculo.REVOCADO;
    return vinculacion.save();
  }

  async listarMisCuidadores(
    pacienteId: string,
  ): Promise<VinculacionPacienteCuidador[]> {
    return this.vinculacionModel
      .find({ paciente_id: new Types.ObjectId(pacienteId) })
      .populate('cuidador_id', 'name lastName fotoPerfil')
      .lean()
      .exec() as unknown as VinculacionPacienteCuidador[];
  }

  async listarMisPacientes(
    cuidadorId: string,
  ): Promise<VinculacionPacienteCuidador[]> {
    return this.vinculacionModel
      .find({
        cuidador_id: new Types.ObjectId(cuidadorId),
        estado_vinculo: EstadoVinculo.ACTIVO,
      })
      .populate('paciente_id', 'name lastName fotoPerfil fechaNacimiento')
      .lean()
      .exec() as unknown as VinculacionPacienteCuidador[];
  }

  async getActivePacienteIdsForCuidador(cuidadorId: string): Promise<string[]> {
    const links = await this.vinculacionModel
      .find({
        cuidador_id: new Types.ObjectId(cuidadorId),
        estado_vinculo: EstadoVinculo.ACTIVO,
      })
      .select('paciente_id')
      .lean();

    return links.map(l => l.paciente_id.toString());
  }

  async getActiveTokensForPaciente(pacienteId: string): Promise<string[]> {
    const links = await this.vinculacionModel
      .find({
        paciente_id: new Types.ObjectId(pacienteId),
        estado_vinculo: EstadoVinculo.ACTIVO,
        cuidador_id: { $ne: null },
      })
      .select('cuidador_id')
      .lean();

    if (!links.length) return [];

    const cuidadorIds = links.map(l => l.cuidador_id);

    const cuidadores = await this.userModel
      .find({
        _id: { $in: cuidadorIds },
        expoPushToken: { $ne: null },
      })
      .select('expoPushToken')
      .lean();

    return cuidadores.map(c => c.expoPushToken).filter(Boolean) as string[];
  }

  async isCuidadorLinkedToPaciente(
    cuidadorId: string,
    pacienteId: string,
  ): Promise<boolean> {
    const link = await this.vinculacionModel.findOne({
      cuidador_id: new Types.ObjectId(cuidadorId),
      paciente_id: new Types.ObjectId(pacienteId),
      estado_vinculo: EstadoVinculo.ACTIVO,
    });

    return link !== null;
  }

  private async generateCode(): Promise<{
    codigo: string;
    lookupHash: string;
    bcryptHash: string;
    expireAt: Date;
  }> {
    const num = crypto.randomInt(0, 1_000_000);
    const codigo = num.toString().padStart(6, '0');
    const lookupHash = this.hmac(codigo);
    const bcryptHash = await bcrypt.hash(codigo, 10);
    const expireAt = new Date(Date.now() + 15 * 60 * 1000);
    return { codigo, lookupHash, bcryptHash, expireAt };
  }

  private hmac(input: string): string {
    const secret = this.configService.get<string>('jwt_secret') ?? '';
    return crypto.createHmac('sha256', secret).update(input).digest('hex');
  }
}
