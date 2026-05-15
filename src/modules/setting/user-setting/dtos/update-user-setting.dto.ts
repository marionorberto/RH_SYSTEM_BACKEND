// backend/src/modules/user-settings/dtos/update-user-settings.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserSettingsDto } from './create-user-setting.dto';

export class UpdateUserSettingsDto extends PartialType(CreateUserSettingsDto) {}
