// backend/src/modules/user-settings/user-settings.service.ts
import { UserSettings } from '@database/entities/settings/user-setting.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserSettingsDto } from './dtos/update-user-setting.dto';

@Injectable()
export class UserSettingsService {
  constructor(
    @InjectRepository(UserSettings)
    private userSettingsRepository: Repository<UserSettings>,
  ) {}

  async getSettingsByUserId(userId: string) {
    try {
      let settings = await this.userSettingsRepository.findOne({
        where: { userId },
      });

      if (!settings) {
        settings = await this.createDefaultSettingsForUser(userId);
      }

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Configurações do usuário carregadas com sucesso.',
        data: settings,
        path: '/user-settings',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch user settings | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao carregar configurações do usuário.',
          error: error.message,
          path: '/user-settings',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createDefaultSettingsForUser(userId: string): Promise<UserSettings> {
    const defaultSettings = this.userSettingsRepository.create({
      userId,
      theme: 'light',
      sidebarCollapsed: false,
      animationsEnabled: true,
      itemsPerPage: 10,
      language: 'pt-BR',
      emailNotifications: true,
      pushNotifications: true,
      desktopNotifications: false,
    });

    return await this.userSettingsRepository.save(defaultSettings);
  }

  async updateSettings(
    userId: string,
    updateSettingsDto: UpdateUserSettingsDto,
  ) {
    try {
      let settings = await this.userSettingsRepository.findOne({
        where: { userId },
      });

      if (!settings) {
        settings = await this.createDefaultSettingsForUser(userId);
      }

      await this.userSettingsRepository.update(settings.id, updateSettingsDto);

      const updatedSettings = await this.userSettingsRepository.findOne({
        where: { id: settings.id },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'PUT',
        message: 'Configurações do usuário atualizadas com sucesso.',
        data: updatedSettings,
        path: '/user-settings',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to update user settings | Error: ${error.message}`);

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'PUT',
          message: 'Erro ao atualizar configurações do usuário.',
          error: error.message,
          path: '/user-settings',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
