import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity('banco')
export class Bank {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'nome_banco',
    type: 'varchar',
    length: '255',
    nullable: false,
  })
  bank_name: string;

  @Column({ name: 'sigla', type: 'varchar', length: '50', nullable: false })
  sigla: string;

  @Column({
    name: 'codigo',
    type: 'varchar',
    length: '50',
    unique: true,
    nullable: false,
  })
  code: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Employee, (employee) => employee.bank)
  employee: Employee[];
}
