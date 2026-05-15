// backend/src/modules/app-settings/app-settings.service.ts
import { AppSettings } from '@database/entities/settings/app-setting.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateAppSettingsDto } from './dtos/update-app-setting.dto';

@Injectable()
export class AppSettingsService {
  constructor(
    @InjectRepository(AppSettings)
    private appSettingsRepository: Repository<AppSettings>,
  ) {}

  async getSettings() {
    try {
      let settings = await this.appSettingsRepository.findOne({
        where: {},
        order: { createdAt: 'DESC' },
      });

      if (!settings) {
        settings = await this.createDefaultSettings();
      }

      const { emailPassword, ...safeSettings } = settings;

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Configurações globais carregadas com sucesso.',
        data: safeSettings,
        path: '/app-settings',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch settings | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao carregar configurações.',
          error: error.message,
          path: '/app-settings',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createDefaultSettings(): Promise<AppSettings> {
    const defaultSettings = this.appSettingsRepository.create({
      emailHost: 'smtp.gmail.com',
      emailPort: '587',
      emailUser: 'noreply@rhsistema.com',
      emailPassword: '',
      emailSecure: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordExpiryDays: 90,
      twoFactorAuth: false,
      requireStrongPassword: true,
      autoBackup: true,
      backupFrequency: 'daily',
      backupTime: '02:00',
      backupRetention: 30,
      timezone: 'Africa/Luanda',
      dateFormat: 'DD/MM/YYYY',
      defaultLanguage: 'pt-BR',
    });

    return await this.appSettingsRepository.save(defaultSettings);
  }

  async createSettings(createSettingsDto: UpdateAppSettingsDto) {
    try {
      const existingSettings = await this.appSettingsRepository.findOne({
        where: {},
      });

      if (existingSettings) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            method: 'POST',
            message: 'Configurações já existem. Use o método PUT para atualizar.',
            path: '/app-settings',
            timestamp: Date.now(),
          },
          HttpStatus.CONFLICT,
        );
      }

      const newSettings = this.appSettingsRepository.create(createSettingsDto);
      const savedSettings = await this.appSettingsRepository.save(newSettings);

      const { emailPassword, ...safeSettings } = savedSettings;

      return {
        statusCode: HttpStatus.CREATED,
        method: 'POST',
        message: 'Configurações globais criadas com sucesso.',
        data: safeSettings,
        path: '/app-settings',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to create settings | Error: ${error.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'POST',
          message: 'Erro ao criar configurações.',
          error: error.message,
          path: '/app-settings',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateSettings(updateSettingsDto: UpdateAppSettingsDto) {
    try {
      let settings = await this.appSettingsRepository.findOne({
        where: {},
      });

      if (!settings) {
        settings = await this.createDefaultSettings();
      }

      await this.appSettingsRepository.update(settings.id, updateSettingsDto);

      const updatedSettings = await this.appSettingsRepository.findOne({
        where: { id: settings.id },
      });

      const { emailPassword, ...safeSettings } = updatedSettings;

      return {
        statusCode: HttpStatus.OK,
        method: 'PUT',
        message: 'Configurações globais atualizadas com sucesso.',
        data: safeSettings,
        path: '/app-settings',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to update settings | Error: ${error.message}`);

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'PUT',
          message: 'Erro ao atualizar configurações.',
          error: error.message,
          path: '/app-settings',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
