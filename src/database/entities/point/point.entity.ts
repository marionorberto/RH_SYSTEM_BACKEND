import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from '../employee/employee.entity';

export enum TipoRegistoEnum {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA',
}

export enum OrigemEnum {
  MANUAL = 'MANUAL',
  BIOMETRICO = 'BIOMETRICO',
}

@Entity('ponto')
export class Point {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'id_funcionario', type: 'int', nullable: false })
  idFuncionario: number;

  @Column({ name: 'data_registo', type: 'date', nullable: false })
  registrationDate: Date;

  @Column({ name: 'hora_registo', type: 'time', nullable: false })
  horaRegisto: string;

  @Column({
    name: 'tipo_registo',
    type: 'varchar',
    length: '20',
    nullable: false,
  })
  registrationType: string;

  @Column({ name: 'origem', type: 'varchar', length: '20', default: 'MANUAL' })
  origin: string;

  @Column({
    name: 'dispositivo',
    type: 'varchar',
    length: '100',
    nullable: true,
  })
  device: string;

  @Column({
    name: 'observacao',
    type: 'varchar',
    length: '255',
    nullable: true,
  })
  observation: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Employee, (employee) => employee.points, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_funcionario' })
  employee: Employee;
}
