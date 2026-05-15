// backend/src/modules/user-settings/user-settings.module.ts
import { UserSettings } from '@database/entities/settings/user-setting.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSettingsController } from '../app-setting/app-setting.controller';
import { UserSettingsService } from './user-setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSettings])],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
  exports: [UserSettingsService],
})
export class UserSettingsModule {}
