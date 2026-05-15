// backend/src/database/entities/app-settings/app-settings.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('app_settings')
export class AppSettings {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  // Configurações de Notificação (Sistema)
  @Column({
    name: 'email_host',
    type: 'varchar',
    length: '255',
    nullable: true,
  })
  emailHost: string;

  @Column({ name: 'email_port', type: 'varchar', length: '10', nullable: true })
  emailPort: string;

  @Column({
    name: 'email_user',
    type: 'varchar',
    length: '255',
    nullable: true,
  })
  emailUser: string;

  @Column({
    name: 'email_password',
    type: 'varchar',
    length: '255',
    nullable: true,
  })
  emailPassword: string;

  @Column({ name: 'email_secure', type: 'boolean', default: true })
  emailSecure: boolean;

  // Configurações de Segurança (Sistema)
  @Column({ name: 'session_timeout', type: 'int', default: 30 })
  sessionTimeout: number;

  @Column({ name: 'max_login_attempts', type: 'int', default: 5 })
  maxLoginAttempts: number;

  @Column({ name: 'password_expiry_days', type: 'int', default: 90 })
  passwordExpiryDays: number;

  @Column({ name: 'two_factor_auth', type: 'boolean', default: false })
  twoFactorAuth: boolean;

  @Column({ name: 'require_strong_password', type: 'boolean', default: true })
  requireStrongPassword: boolean;

  // Configurações de Backup (Sistema)
  @Column({ name: 'auto_backup', type: 'boolean', default: true })
  autoBackup: boolean;

  @Column({
    name: 'backup_frequency',
    type: 'varchar',
    length: '20',
    default: 'daily',
  })
  backupFrequency: string;

  @Column({
    name: 'backup_time',
    type: 'varchar',
    length: '10',
    default: '02:00',
  })
  backupTime: string;

  @Column({ name: 'backup_retention', type: 'int', default: 30 })
  backupRetention: number;

  // Configurações Globais de Data/Hora
  @Column({
    name: 'timezone',
    type: 'varchar',
    length: '50',
    default: 'Africa/Luanda',
  })
  timezone: string;

  @Column({
    name: 'date_format',
    type: 'varchar',
    length: '20',
    default: 'DD/MM/YYYY',
  })
  dateFormat: string;

  @Column({
    name: 'default_language',
    type: 'varchar',
    length: '10',
    default: 'pt-BR',
  })
  defaultLanguage: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;
}
