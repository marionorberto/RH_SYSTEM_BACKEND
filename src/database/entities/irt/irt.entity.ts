import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('irt')
export class Irt {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'limite_inferior',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  inferiorLimit: number;

  @Column({
    name: 'limite_superior',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  superiorLimit: number;

  @Column({
    name: 'taxa',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  tax: number;

  @Column({
    name: 'valor_fixo',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  FixedValue: number;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;
}
