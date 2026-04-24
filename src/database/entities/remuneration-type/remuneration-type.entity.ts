import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Remuneration } from '../remuneration/remuneration.entity';

@Entity('tipo_remuneracao')
export class RemunerationType {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'Codigo',
    type: 'varchar',
    length: '50',
    unique: true,
    nullable: false,
  })
  codigo: string;

  @Column({
    name: 'nome_tipo_remuneracao',
    type: 'varchar',
    length: '255',
    nullable: false,
  })
  nomeTipoRemuneracao: string;

  @Column({ name: 'motivo', type: 'varchar', length: '255', nullable: true })
  motivo: string;

  @Column({ name: 'Seguros', type: 'boolean', default: false })
  seguros: boolean;

  @Column({ name: 'SegSocial', type: 'boolean', default: false })
  segSocial: boolean;

  @Column({ name: 'Irt', type: 'boolean', default: false })
  irt: boolean;

  @Column({ name: 'Formula', type: 'varchar', length: '500', nullable: true })
  formula: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(
    () => Remuneration,
    (remuneration) => remuneration.remunerationType,
  )
  remunerations: Remuneration[];
}
