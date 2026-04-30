// backend/src/modules/nacionality/dtos/update-nacionality.dto.ts
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateNacionalityDto {
  @MaxLength(10, {
    message: 'O ISO code deve ter no máximo 10 caracteres!',
  })
  @MinLength(2, {
    message: 'O ISO code deve ter no mínimo 2 caracteres!',
  })
  @IsString({ message: 'O ISO code deve ser texto' })
  @IsOptional()
  isocode?: string;

  @MaxLength(255, {
    message: 'O nome da nacionalidade deve ter no máximo 255 caracteres!',
  })
  @MinLength(3, {
    message: 'O nome da nacionalidade deve ter no mínimo 3 caracteres!',
  })
  @IsString({ message: 'O nome da nacionalidade deve ser texto' })
  @IsOptional()
  nomeNacionalidade?: string;
}
