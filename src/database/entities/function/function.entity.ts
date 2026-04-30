// backend/src/database/entities/function/function.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity('funcao')
export class Function {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'nome_funcao',
    type: 'varchar',
    length: '255',
    unique: true,
    nullable: false,
  })
  functionName: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Employee, (employee) => employee.function)
  employees: Employee[];
}
