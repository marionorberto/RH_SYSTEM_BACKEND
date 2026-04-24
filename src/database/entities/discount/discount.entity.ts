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
import { DiscountType } from '../discount-type/discount-type.entity';

export enum TipoDescontoEnum {
  IRT = 'IRT - Imposto de Rendimento de Trabalho',
  SS = 'SS - Segurança Social',
  FALTA = 'Falta',
  OUTROS = 'Outros Desconto',
}

@Entity('desconto')
export class Discount {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'id_Employee', type: 'int', nullable: false })
  idEmployee: number;

  @Column({ name: 'id_tipo_desconto', type: 'int', nullable: false })
  idTipoDesconto: number;

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

  @Column({
    name: 'tipo_desconto',
    type: 'varchar',
    length: '60',
    nullable: true,
  })
  discountType: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Employee, (Employee) => Employee.discounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_Employee' })
  employee: Employee;

  @ManyToOne(() => DiscountType, (discountType) => discountType.discounts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_tipo_desconto' })
  discountTypeRel: DiscountType;
}
