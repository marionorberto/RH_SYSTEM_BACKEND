// backend/src/modules/app-settings/app-settings.module.ts
import { AppSettings } from '@database/entities/settings/app-setting.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppSettingsController } from '../user-setting/user-setting.controller';
import { AppSettingsService } from './app-setting.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppSettings])],
  controllers: [AppSettingsController],
  providers: [AppSettingsService],
  exports: [AppSettingsService],
})
export class AppSettingsModule {}
