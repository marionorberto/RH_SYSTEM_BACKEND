import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { RolePermission } from '../permission-role/permission-role.entity';

@Entity('Permission')
export class Permission {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'nome_permission',
    type: 'varchar',
    length: '255',
    unique: true,
    nullable: true,
  })
  nomePermission: string;

  @Column({
    name: 'descricao_permission',
    type: 'varchar',
    length: '255',
    nullable: true,
  })
  descricaoPermission: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermission[];
}
