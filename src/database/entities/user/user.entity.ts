import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { Exclude } from 'class-transformer';
import { Employee } from '../employee/employee.entity';
import { UserRole } from '../user-role/user-role.entity';
import { SystemLog } from '../system-log/system-log.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  // @Column({ name: 'id_Employee', type: 'int', unique: true, nullable: true })
  // idEmployee: number;

  @Column({ name: 'firstname', type: 'varchar', length: '50', nullable: false })
  firstname: string;

  @Column({ name: 'lastname', type: 'varchar', length: '50', nullable: false })
  lastname: string;

  @Column({ name: 'username', type: 'varchar', length: '255', nullable: false })
  username: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: '255',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ name: 'email_verified_at', type: 'timestamp', nullable: true })
  emailVerifiedAt: Date;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: '255',
    nullable: false,
  })
  @Exclude()
  password: string;

  @Column({ name: 'activo', type: 'boolean', default: true })
  active: boolean;

  @Column({ name: 'is_super_admin', type: 'boolean', default: false })
  isSuperAdmin: boolean;

  @Column({
    name: 'registo_completo',
    type: 'boolean',
    default: false,
  })
  registrationCompleted: boolean;

  @Column({ name: 'resetar_senha_token', type: 'text', nullable: true })
  resetPasswordToken: string;

  @Column({
    name: 'resetar_senha_expira_em',
    type: 'timestamp',
    nullable: true,
  })
  resetPasswordExpires: Date;

  @Column({
    name: 'codigo_resetar_senha',
    type: 'varchar',
    length: '6',
    nullable: true,
  })
  resetPasswordCode: string;

  @Column({
    name: 'codigo_resetar_senha_expira_em',
    type: 'timestamp',
    nullable: true,
  })
  resetPasswordCodeExpires: Date;

  @Column({
    name: 'codigo_verificacao_email',
    type: 'varchar',
    length: '6',
    nullable: true,
  })
  emailVerificationCode: string;

  @Column({
    name: 'codigo_verificacao_email_experia_em',
    type: 'timestamp',
    nullable: true,
  })
  emailVerificationCodeExpires: Date;

  @Column({ name: 'is_email_verified', type: 'boolean', default: false })
  isEmailVerified: boolean;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  // Relationships
  @OneToOne(() => Employee, (Employee) => Employee.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_Employee' })
  employee: Employee;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];

  @OneToMany(() => SystemLog, (SystemLog) => SystemLog.user)
  systemLog: SystemLog[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcryptjs.genSalt(10);
      this.password = await bcryptjs.hash(this.password, salt);
    }
  }
}
