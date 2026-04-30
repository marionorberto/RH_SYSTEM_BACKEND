// backend/src/modules/bank/dtos/create-bank.dto.ts
import { IsString, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateBankDto {
  @MaxLength(255, {
    message: 'O nome do banco deve ter no máximo 255 caracteres!',
  })
  @MinLength(3, {
    message: 'O nome do banco deve ter no mínimo 3 caracteres!',
  })
  @IsString({ message: 'O nome do banco deve ser texto' })
  @IsNotEmpty({ message: 'O nome do banco não pode estar vazio!' })
  bank_name: string;

  @MaxLength(50, {
    message: 'A sigla deve ter no máximo 50 caracteres!',
  })
  @MinLength(2, {
    message: 'A sigla deve ter no mínimo 2 caracteres!',
  })
  @IsString({ message: 'A sigla deve ser texto' })
  @IsNotEmpty({ message: 'A sigla não pode estar vazia!' })
  sigla: string;

  @MaxLength(50, {
    message: 'O código deve ter no máximo 50 caracteres!',
  })
  @MinLength(3, {
    message: 'O código deve ter no mínimo 3 caracteres!',
  })
  @IsString({ message: 'O código deve ser texto' })
  @IsNotEmpty({ message: 'O código não pode estar vazio!' })
  code: string;
}
