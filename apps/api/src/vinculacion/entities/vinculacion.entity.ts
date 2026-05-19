import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TipoVinculo } from '../enum/tipo-vinculo.enum';
import { EstadoVinculo } from '../enum/estado-vinculo.enum';

@Schema({ timestamps: true, collection: 'vinculaciones_paciente_cuidador' })
export class VinculacionPacienteCuidador extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  cuidador_id: Types.ObjectId | null;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  paciente_id: Types.ObjectId;

  @Prop({ type: String, enum: TipoVinculo, default: null })
  tipo_vinculo: TipoVinculo | null;

  @Prop({ type: String, default: null })
  codigo_lookup: string | null;

  @Prop({ type: String, default: null })
  codigo_vinculacion: string | null;

  @Prop({ type: Date, default: null })
  codigoExpireAt: Date | null;

  @Prop({
    type: String,
    enum: EstadoVinculo,
    default: EstadoVinculo.PENDIENTE,
    required: true,
  })
  estado_vinculo: EstadoVinculo;
}

export const VinculacionPacienteCuidadorSchema = SchemaFactory.createForClass(
  VinculacionPacienteCuidador,
);

VinculacionPacienteCuidadorSchema.index({ cuidador_id: 1, estado_vinculo: 1 });

VinculacionPacienteCuidadorSchema.index({ paciente_id: 1 });

VinculacionPacienteCuidadorSchema.index(
  { codigo_lookup: 1 },
  { sparse: true, unique: true },
);

VinculacionPacienteCuidadorSchema.index(
  { codigoExpireAt: 1 },
  { expireAfterSeconds: 0 },
);
