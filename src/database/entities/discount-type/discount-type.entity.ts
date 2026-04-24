import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Discount } from '../discount/discount.entity';

@Entity('tipo_Discount')
export class DiscountType {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'Codigo',
    type: 'varchar',
    length: '50',
    unique: true,
    nullable: false,
  })
  code: string;

  @Column({
    name: 'nome_tipo_deconto',
    type: 'varchar',
    length: '255',
    nullable: false,
  })
  nomeTipoDeconto: string;

  @Column({ name: 'motivo', type: 'varchar', length: '255', nullable: true })
  motivo: string;

  @Column({ name: 'Formula', type: 'varchar', length: '500', nullable: true })
  formula: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Discount, (Discount) => Discount.discountType)
  discounts: Discount[];
}
