// backend/src/modules/departament/dtos/update-departament.dto.ts
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateDepartamentDto {
  @MaxLength(255, {
    message: 'O nome do departamento deve ter no máximo 255 caracteres!',
  })
  @MinLength(3, {
    message: 'O nome do departamento deve ter no mínimo 3 caracteres!',
  })
  @IsString({ message: 'O nome do departamento deve ser texto' })
  @IsOptional()
  departamentName?: string;
}
