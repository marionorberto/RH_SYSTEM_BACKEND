import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity('categoria')
export class Category {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'nome_categoria',
    type: 'varchar',
    length: '255',
    nullable: true,
  })
  categoryName: string;

  @Column({
    name: 'salario_base_min',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  baseSalaryMin: number;

  @Column({
    name: 'salario_base_max',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  baseSalaryMax: number;

  @Column({ name: 'is_tributavel', type: 'boolean', default: true })
  isTributavel: boolean;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Employee, (Employe) => Employe.category)
  employees: Employee[];
}
