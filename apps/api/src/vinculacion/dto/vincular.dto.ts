import { IsEnum, IsNumberString, Length } from 'class-validator';
import { TipoVinculo } from '../enum/tipo-vinculo.enum';

export class VincularDto {
  @IsNumberString()
  @Length(6, 6)
  codigo: string;

  @IsEnum(TipoVinculo)
  tipo_vinculo: TipoVinculo;
}
