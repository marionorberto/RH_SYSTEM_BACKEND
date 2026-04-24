import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProfissionalData } from '../profissional-data/profissional-data.entity';

@Entity('tipos_contrato')
export class ContractType {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'nome_contrato',
    type: 'varchar',
    length: '100',
    unique: true,
    nullable: false,
  })
  nomeContrato: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(
    () => ProfissionalData,
    (ProfissionalData) => ProfissionalData.contractType,
  )
  profissionalData: ProfissionalData[];
}
