import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ContractType } from '../contract-type/contract-type.entity';
import { Employee } from '../employee/employee.entity';
import { Duration } from '../duration/duration.entity';
import { Organization } from '../organization/organization.entity';

export enum RegimeTrabalhoEnum {
  TEMPO_COMPLETO = 'A tempo completo',
  TEMPO_PARCIAL = 'A tempo parcial',
}

@Entity('dados_profissionais')
export class ProfissionalData {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'data_Inicio_Contrato', type: 'date', nullable: true })
  dataInicioContrato: Date;

  @Column({ name: 'data_Fim_Contrato', type: 'date', nullable: true })
  dataFimContrato: Date;

  @Column({ name: 'diasferias', type: 'int', nullable: false })
  diasferias: number;

  @Column({ name: 'horastrabalhodiarias', type: 'int', nullable: false })
  horastrabalhodiarias: number;

  @Column({ name: 'diastrabalhosemana', type: 'int', nullable: false })
  diastrabalhosemana: number;

  @Column({ name: 'id_tipos_contrato', type: 'int', nullable: false })
  idTiposContrato: number;

  @Column({ name: 'id_funcionario', type: 'int', nullable: false })
  idFuncionario: number;

  @Column({
    name: 'regime_trabalho',
    type: 'varchar',
    length: '50',
    default: 'A tempo completo',
  })
  regimeTrabalho: string;

  @Column({ name: 'id_duracao', type: 'int', nullable: false })
  idDuracao: number;

  @Column({ name: 'id_organizacao', type: 'int', nullable: false })
  idOrganizacao: number;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(
    () => ContractType,
    (contractType) => contractType.profissionalData,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'id_tipos_contrato' })
  contractType: ContractType;

  // @ManyToOne(() => Employee, (employee) => employee.profissionalData, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn({ name: 'id_funcionario' })
  // employee: Employee;

  @ManyToOne(() => Duration, (duration) => duration.profissionalData, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_duracao' })
  duration: Duration;

  @ManyToOne(
    () => Organization,
    (organization) => organization.ProfissionalData,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'id_organizacao' })
  organization: Organization;
}
