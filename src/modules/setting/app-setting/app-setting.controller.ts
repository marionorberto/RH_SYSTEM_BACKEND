// backend/src/modules/user-settings/user-settings.controller.ts
import { Body, Controller, Get, Put, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from 'shared/auth/auth.guard';
import { UserSettingsService } from '../user-setting/user-setting.service';
import { UpdateUserSettingsDto } from '../user-setting/dtos/update-user-setting.dto';

@Controller('user-settings')
@UseGuards(AuthGuard)
export class UserSettingsController {
  constructor(private readonly userSettingsService: UserSettingsService) {}

  @Get()
  async getMySettings(@Req() request: Request) {
    const userId = request['user'].userId;
    return await this.userSettingsService.getSettingsByUserId(userId);
  }

  @Put()
  async updateMySettings(
    @Req() request: Request,
    @Body() updateSettingsDto: UpdateUserSettingsDto,
  ) {
    const userId = request['user'].userId;
    return await this.userSettingsService.updateSettings(
      userId,
      updateSettingsDto,
    );
  }
}
