import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../employee/employee.entity';

export enum TipoFeriasEnum {
  ANUAL = 'ANUAL',
  LICENCA = 'LICENCA',
  ESPECIAL = 'ESPECIAL',
}

export enum EstadoFeriasEnum {
  PENDENTE = 'PENDENTE',
  APROVADO = 'APROVADO',
  REJEITADO = 'REJEITADO',
}

@Entity('ferias')
export class Vacation {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'id_Employee', type: 'int', nullable: false })
  idEmployee: number;

  @Column({ name: 'data_inicio', type: 'date', nullable: false })
  dateStart: Date;

  @Column({ name: 'data_fim', type: 'date', nullable: false })
  dateEnd: Date;

  @Column({ name: 'dias', type: 'int', nullable: false })
  days: number;

  @Column({
    name: 'tipo_ferias',
    type: 'varchar',
    length: '50',
    default: 'ANUAL',
  })
  vacationType: string;

  @Column({
    name: 'estado',
    type: 'varchar',
    length: '50',
    default: 'PENDENTE',
  })
  state: string;

  @Column({
    name: 'observacao',
    type: 'varchar',
    length: '255',
    nullable: true,
  })
  observation: string;

  @Column({ name: 'aprovado_por', type: 'int', nullable: true })
  approvedBy: number;

  @Column({ name: 'data_aprovacao', type: 'timestamp', nullable: true })
  approvalDate: Date;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Employee, (Employee) => Employee.vacations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_Employee' })
  employee: Employee;
}
