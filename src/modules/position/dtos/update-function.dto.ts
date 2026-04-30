// backend/src/modules/function/dtos/update-function.dto.ts
import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';

export class UpdateFunctionDto {
  @MaxLength(255, {
    message: 'O nome da função deve ter no máximo 255 caracteres!',
  })
  @MinLength(3, {
    message: 'O nome da função deve ter no mínimo 3 caracteres!',
  })
  @IsString({ message: 'O nome da função deve ser texto' })
  @IsOptional()
  functionName?: string;
}
