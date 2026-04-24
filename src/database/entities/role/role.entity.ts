import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserRole } from '../user-role/user-role.entity';
import { RolePermission } from '../permission-role/permission-role.entity';

@Entity('Role')
export class Role {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'nome_role',
    type: 'varchar',
    length: '255',
    unique: true,
    nullable: true,
  })
  roleName: string;

  @Column({
    name: 'descricao_role',
    type: 'varchar',
    length: '255',
    nullable: true,
  })
  descriptionRole: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];
}
