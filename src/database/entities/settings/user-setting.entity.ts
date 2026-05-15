// backend/src/database/entities/user-settings/user-settings.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('user_settings')
export class UserSettings {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'user_id', type: 'uuid', unique: true })
  userId: string;

  // Configurações de Interface
  @Column({ name: 'theme', type: 'varchar', length: '20', default: 'light' })
  theme: string;

  @Column({ name: 'sidebar_collapsed', type: 'boolean', default: false })
  sidebarCollapsed: boolean;

  @Column({ name: 'animations_enabled', type: 'boolean', default: true })
  animationsEnabled: boolean;

  @Column({ name: 'items_per_page', type: 'int', default: 10 })
  itemsPerPage: number;

  // Configurações de Idioma
  @Column({ name: 'language', type: 'varchar', length: '10', default: 'pt-BR' })
  language: string;

  // Configurações de Notificação (Preferências do Usuário)
  @Column({ name: 'email_notifications', type: 'boolean', default: true })
  emailNotifications: boolean;

  @Column({ name: 'push_notifications', type: 'boolean', default: true })
  pushNotifications: boolean;

  @Column({ name: 'desktop_notifications', type: 'boolean', default: false })
  desktopNotifications: boolean;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  // Relacionamento
  @OneToOne(() => User, (user) => user.settings)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
