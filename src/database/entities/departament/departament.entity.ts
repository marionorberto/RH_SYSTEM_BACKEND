// backend/src/database/entities/departament/departament.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity('departamento')
export class Departament {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'nome_departamento',
    type: 'varchar',
    length: '255',
    unique: true,
    nullable: false,
  })
  departamentName: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Employee, (employee) => employee.departament)
  employees: Employee[];
}
