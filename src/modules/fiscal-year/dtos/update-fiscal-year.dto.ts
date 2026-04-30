// backend/src/modules/fiscal-year/dtos/update-fiscal-year.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateFiscalYearDto } from './create-fiscal-year.dto';

export class UpdateFiscalYearDto extends PartialType(CreateFiscalYearDto) {}
