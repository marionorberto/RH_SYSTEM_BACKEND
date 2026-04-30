// backend/src/modules/irt/dtos/update-irt.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateIrtDto } from './create-irt.dto';

export class UpdateIrtDto extends PartialType(CreateIrtDto) {}
