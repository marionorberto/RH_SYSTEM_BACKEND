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
import { RemunerationType } from '../remuneration-type/remuneration-type.entity';

export enum TipoProcessamentoEnum {
  DIARIO = 'Diario',
  SEMANAL = 'Semanal',
  MENSAL = 'Mensal',
}

export enum TipoCalculoEnum {
  VALOR = 'Valor',
  FORMULA = 'Formula',
  PERCENTUAL = 'Percentual',
}

@Entity('remuneracoes')
export class Remuneration {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'id_Employee', type: 'int', nullable: false })
  idEmployee: number;

  @Column({ name: 'id_tipo_remuneracao', type: 'int', nullable: false })
  idTipoRemuneracao: number;

  @Column({
    name: 'valor',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: false,
  })
  value: number;

  @Column({ name: 'unidades', type: 'int', default: 1 })
  unities: number;

  @Column({ name: 'dias', type: 'int', default: 22 })
  days: number;

  @Column({
    name: 'tipo_processamento',
    type: 'varchar',
    length: '50',
    nullable: true,
  })
  processingType: string;

  @Column({
    name: 'tipo_calculo',
    type: 'varchar',
    length: '50',
    nullable: true,
  })
  tipoCalculo: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Employee, (Employee) => Employee.remunerations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_Employee' })
  employee: Employee;

  @ManyToOne(
    () => RemunerationType,
    (remunerationType) => remunerationType.remunerations,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'id_tipo_remuneracao' })
  remunerationType: RemunerationType;
}
