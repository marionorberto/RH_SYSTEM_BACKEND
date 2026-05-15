// backend/src/database/seeds/app-settings.seed.ts
import { AppSettings } from '@database/entities/settings/app-setting.entity';
import { DataSource } from 'typeorm';

export async function seedAppSettings(dataSource: DataSource) {
  const appSettingsRepository = dataSource.getRepository(AppSettings);

  const existingSettings = await appSettingsRepository.findOne({ where: {} });

  if (existingSettings) {
    console.log('ℹ️ Configurações globais já existem. Pulando seed...');
    return existingSettings;
  }

  const defaultSettings = {
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
  };

  const settings = appSettingsRepository.create(defaultSettings);
  await appSettingsRepository.save(settings);

  console.log('✅ Configurações globais criadas com sucesso!');
  return settings;
}
