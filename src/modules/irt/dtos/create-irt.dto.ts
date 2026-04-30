// backend/src/modules/irt/dtos/create-irt.dto.ts
import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateIrtDto {
  @IsNumber({}, { message: 'O limite inferior deve ser um número' })
  @Type(() => Number)
  @IsOptional()
  inferiorLimit?: number;

  @IsNumber({}, { message: 'O limite superior deve ser um número' })
  @Type(() => Number)
  @IsOptional()
  superiorLimit?: number;

  @IsNumber({}, { message: 'A taxa deve ser um número' })
  @Type(() => Number)
  @Min(0, { message: 'A taxa deve ser maior ou igual a 0' })
  @Max(100, { message: 'A taxa deve ser menor ou igual a 100' })
  @IsOptional()
  tax?: number;

  @IsNumber({}, { message: 'O valor fixo deve ser um número' })
  @Type(() => Number)
  @Min(0, { message: 'O valor fixo deve ser maior ou igual a 0' })
  @IsOptional()
  FixedValue?: number;
}
