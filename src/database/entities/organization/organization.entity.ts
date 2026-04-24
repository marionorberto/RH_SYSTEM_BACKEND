import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProfissionalData } from '../profissional-data/profissional-data.entity';

@Entity('organizacao')
export class Organization {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'codigo',
    type: 'varchar',
    length: '10',
    unique: true,
    nullable: true,
  })
  codigo: string;

  @Column({
    name: 'nome_organizacao',
    type: 'varchar',
    length: '255',
    unique: true,
    nullable: true,
  })
  nomeOrganizacao: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(
    () => ProfissionalData,
    (ProfissionalData) => ProfissionalData.organization,
  )
  ProfissionalData: ProfissionalData[];
}
