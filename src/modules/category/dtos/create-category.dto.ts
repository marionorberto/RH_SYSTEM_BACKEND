// backend/src/modules/category/dtos/create-category.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @MaxLength(255, {
    message: 'O nome da categoria deve ter no máximo 255 caracteres!',
  })
  @IsString({ message: 'O nome da categoria deve ser texto' })
  @IsNotEmpty({ message: 'O nome da categoria é obrigatório!' })
  categoryName: string;

  @IsNumber({}, { message: 'O salário base mínimo deve ser um número!' })
  @Min(0, { message: 'O salário base mínimo deve ser maior ou igual a 0!' })
  @Type(() => Number)
  @IsOptional()
  baseSalaryMin?: number;

  @IsNumber({}, { message: 'O salário base máximo deve ser um número!' })
  @Min(0, { message: 'O salário base máximo deve ser maior ou igual a 0!' })
  @Type(() => Number)
  @IsOptional()
  baseSalaryMax?: number;

  @IsBoolean({ message: 'O campo isTributavel deve ser booleano!' })
  @IsOptional()
  isTributavel?: boolean;
}
