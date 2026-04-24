import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProfissionalData } from '../profissional-data/profissional-data.entity';

@Entity('duracao')
export class Duration {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'codigo',
    type: 'varchar',
    length: '10',
    unique: true,
    nullable: true,
  })
  code: string;

  @Column({
    name: 'nome_duracao',
    type: 'varchar',
    length: '255',
    unique: true,
    nullable: true,
  })
  durationName: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(
    () => ProfissionalData,
    (ProfissionalData) => ProfissionalData.duration,
  )
  profissionalData: ProfissionalData[];
}
