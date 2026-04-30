// backend/src/modules/function/dtos/create-function.dto.ts
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateFunctionDto {
  @MaxLength(255, {
    message: 'O nome da função deve ter no máximo 255 caracteres!',
  })
  @MinLength(3, {
    message: 'O nome da função deve ter no mínimo 3 caracteres!',
  })
  @IsString({ message: 'O nome da função deve ser texto' })
  @IsNotEmpty({ message: 'O nome da função não pode estar vazio!' })
  functionName: string;
}
