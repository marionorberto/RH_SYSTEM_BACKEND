// backend/src/modules/fiscal-year/dtos/create-fiscal-year.dto.ts
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

export class CreateFiscalYearDto {
  @MaxLength(9, {
    message: 'O ano fiscal deve ter no máximo 9 caracteres!',
  })
  @MinLength(4, {
    message: 'O ano fiscal deve ter no mínimo 4 caracteres!',
  })
  @IsString({ message: 'O ano fiscal deve ser texto' })
  @IsNotEmpty({ message: 'O ano fiscal não pode estar vazio!' })
  @Matches(/^\d{4}(?:\/\d{4})?$/, {
    message: 'Formato inválido. Use "2024" ou "2024/2025"',
  })
  year: string;
}
