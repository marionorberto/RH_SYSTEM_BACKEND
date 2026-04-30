// backend/src/modules/departament/dtos/create-departament.dto.ts
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateDepartamentDto {
  @MaxLength(255, {
    message: 'O nome do departamento deve ter no máximo 255 caracteres!',
  })
  @MinLength(3, {
    message: 'O nome do departamento deve ter no mínimo 3 caracteres!',
  })
  @IsString({ message: 'O nome do departamento deve ser texto' })
  @IsNotEmpty({ message: 'O nome do departamento não pode estar vazio!' })
  departamentName: string;
}
