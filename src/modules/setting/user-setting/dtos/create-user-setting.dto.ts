// backend/src/modules/user-settings/dtos/create-user-settings.dto.ts
import {
  IsBoolean,
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsIn,
} from 'class-validator';

export class CreateUserSettingsDto {
  @IsUUID()
  userId: string;

  @IsIn(['light', 'dark', 'system'])
  @IsOptional()
  theme?: string;

  @IsBoolean()
  @IsOptional()
  sidebarCollapsed?: boolean;

  @IsBoolean()
  @IsOptional()
  animationsEnabled?: boolean;

  @IsNumber()
  @IsIn([10, 25, 50, 100])
  @IsOptional()
  itemsPerPage?: number;

  @IsString()
  @IsOptional()
  language?: string;

  @IsBoolean()
  @IsOptional()
  emailNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  pushNotifications?: boolean;

  @IsBoolean()
  @IsOptional()
  desktopNotifications?: boolean;
}
