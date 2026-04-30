// backend/src/modules/permission/dtos/create-permission.dto.ts
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreatePermissionDto {
  @MaxLength(255, {
    message: 'O nome da permissão deve ter no máximo 255 caracteres!',
  })
  @MinLength(3, {
    message: 'O nome da permissão deve ter no mínimo 3 caracteres!',
  })
  @IsString({ message: 'O nome da permissão deve ser texto' })
  @IsNotEmpty({ message: 'O nome da permissão não pode estar vazio!' })
  nomePermission: string;

  @MaxLength(255, {
    message: 'A descrição deve ter no máximo 255 caracteres!',
  })
  @IsString({ message: 'A descrição deve ser texto' })
  @IsOptional()
  descricaoPermission?: string;
}
