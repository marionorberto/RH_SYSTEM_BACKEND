// backend/src/modules/app-settings/app-settings.controller.ts
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AppSettingsService } from '../app-setting/app-setting.service';
import { UpdateAppSettingsDto } from '../app-setting/dtos/update-app-setting.dto';
import { AuthGuard } from 'shared/auth/auth.guard';

@Controller('app-settings')
@UseGuards(AuthGuard)
export class AppSettingsController {
  constructor(private readonly appSettingsService: AppSettingsService) {}

  @Get()
  async getSettings() {
    return await this.appSettingsService.getSettings();
  }

  @Post()
  async createSettings(@Body() createSettingsDto: UpdateAppSettingsDto) {
    return await this.appSettingsService.createSettings(createSettingsDto);
  }

  @Put()
  async updateSettings(@Body() updateSettingsDto: UpdateAppSettingsDto) {
    return await this.appSettingsService.updateSettings(updateSettingsDto);
  }
}
