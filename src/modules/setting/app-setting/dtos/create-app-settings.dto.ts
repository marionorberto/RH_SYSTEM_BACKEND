// backend/src/modules/app-settings/dtos/create-app-settings.dto.ts
import {
  IsBoolean,
  IsString,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';

export class CreateAppSettingsDto {
  @IsString()
  @IsOptional()
  emailHost?: string;

  @IsString()
  @IsOptional()
  emailPort?: string;

  @IsString()
  @IsOptional()
  emailUser?: string;

  @IsString()
  @IsOptional()
  emailPassword?: string;

  @IsBoolean()
  @IsOptional()
  emailSecure?: boolean;

  @IsNumber()
  @Min(5)
  @Max(120)
  @IsOptional()
  sessionTimeout?: number;

  @IsNumber()
  @Min(3)
  @Max(10)
  @IsOptional()
  maxLoginAttempts?: number;

  @IsNumber()
  @Min(30)
  @Max(365)
  @IsOptional()
  passwordExpiryDays?: number;

  @IsBoolean()
  @IsOptional()
  twoFactorAuth?: boolean;

  @IsBoolean()
  @IsOptional()
  requireStrongPassword?: boolean;

  @IsBoolean()
  @IsOptional()
  autoBackup?: boolean;

  @IsIn(['daily', 'weekly', 'monthly'])
  @IsOptional()
  backupFrequency?: string;

  @IsString()
  @IsOptional()
  backupTime?: string;

  @IsNumber()
  @Min(7)
  @Max(365)
  @IsOptional()
  backupRetention?: number;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  dateFormat?: string;

  @IsString()
  @IsOptional()
  defaultLanguage?: string;
}
