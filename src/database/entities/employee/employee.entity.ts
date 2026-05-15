// backend/src/database/entities/employee/employee.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Nacionality } from '../nacionality/nacionality.entity';
import { Function } from '../function/function.entity';
import { Category } from '../category/category.entity';
import { Bank } from '../bank/bank.entity';
import { User } from '../user/user.entity';
import { Departament } from '../departament/departament.entity';

export enum GeneroEnum {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
}

export enum EstadoCivilEnum {
  SOLTEIRO = 'SOLTEIRO(A)',
  CASADO = 'CASADO(A)',
  VIUVO = 'VIÚVO(A)',
}

export enum TipoDocumentoEnum {
  BI = 'BI',
  PASSAPORTE = 'PASSAPORTE',
  CARTAO_RESIDENTE = 'CARTAO_RESIDENTE',
  CARTA_CONDUCAO = 'CARTA_CONDUCAO',
}

export enum NivelAcademicoEnum {
  ENSINO_BASE = 'ENSINO_BASE',
  ENSINO_MEDIO = 'ENSINO_MEDIO',
  FREQUENCIA_UNIVERSITARIA = 'FREQUENCIA_UNIVERSITARIA',
  LICENCIADO = 'LICENCIADO',
  MESTRADO = 'MESTRADO',
  DOUTORAMENTO = 'DOUTORAMENTO',
}

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'nome_employee',
    type: 'varchar',
    length: '255',
    nullable: false,
  })
  employee_name: string;

  @Column({ name: 'nome_pai', type: 'varchar', length: '255', nullable: true })
  fatherName: string;

  @Column({ name: 'nome_mae', type: 'varchar', length: '255', nullable: false })
  motherName: string;

  @Column({ name: 'data_nascimento', type: 'date', nullable: false })
  birthday: Date;

  @Column({
    name: 'genero',
    type: 'varchar',
    length: '10',
    nullable: false,
  })
  gender: string;

  @Column({
    name: 'estado_civil',
    type: 'varchar',
    length: '20',
    nullable: true,
  })
  civilState: string;

  @Column({ name: 'id_Nacionality', type: 'uuid', nullable: false })
  idNacionality: string;

  @Column({
    name: 'tipo_documento1',
    type: 'varchar',
    length: '30',
    nullable: true,
  })
  typeDoc1: string;

  @Column({
    name: 'num_documento1',
    type: 'varchar',
    length: '100',
    nullable: true,
  })
  docNumber1: string;

  @Column({
    name: 'tipo_documento2',
    type: 'varchar',
    length: '30',
    nullable: true,
  })
  typeDoc2: string;

  @Column({
    name: 'num_documento2',
    type: 'varchar',
    length: '100',
    nullable: true,
  })
  docNumber2: string;

  @Column({
    name: 'nivel_academico',
    type: 'varchar',
    length: '50',
    nullable: true,
  })
  academic_level: string;

  @Column({
    name: 'fotografia',
    type: 'varchar',
    length: '255',
    nullable: true,
  })
  photo: string;

  @Column({ name: 'telefone1', type: 'varchar', length: '20', nullable: true })
  telefone1: string;

  @Column({ name: 'telefone2', type: 'varchar', length: '20', nullable: true })
  telefone2: string;

  @Column({ name: 'email', type: 'varchar', length: '255', nullable: true })
  email: string;

  @Column({ name: 'linkedin', type: 'varchar', length: '255', nullable: true })
  linkedin: string;

  @Column({ name: 'whatsapp', type: 'varchar', length: '20', nullable: true })
  whatsapp: string;

  @Column({ name: 'instagram', type: 'varchar', length: '255', nullable: true })
  instagram: string;

  @Column({ name: 'rua', type: 'varchar', length: '255', nullable: true })
  street: string;

  @Column({ name: 'bairro', type: 'varchar', length: '255', nullable: true })
  neighbourhood: string;

  @Column({ name: 'num_casa', type: 'varchar', length: '50', nullable: true })
  houseNumber: string;

  @Column({ name: 'id_Function', type: 'uuid', nullable: true })
  idFunction: string;

  @Column({ name: 'id_Category', type: 'uuid', nullable: true })
  idCategory: string;

  @Column({ name: 'id_Bank', type: 'uuid', nullable: true })
  idBank: string;

  @Column({
    name: 'num_segsocial',
    type: 'varchar',
    length: '50',
    nullable: true,
  })
  numSegsocial: string;

  @Column({
    name: 'num_conta_banc',
    type: 'varchar',
    length: '50',
    nullable: true,
  })
  numContaBanc: string;

  @Column({ name: 'iban_conta', type: 'varchar', length: '50', nullable: true })
  iBanknta: string;

  @Column({ name: 'estado', type: 'boolean', default: true })
  estado: boolean;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Nacionality, (nacionality) => nacionality.employees)
  @JoinColumn({ name: 'id_Nacionality' })
  nacionality: Nacionality;

  @ManyToOne(() => Function, (func) => func.employees)
  @JoinColumn({ name: 'id_Function' })
  function: Function;

  @ManyToOne(() => Category, (category) => category.employees)
  @JoinColumn({ name: 'id_Category' })
  category: Category;

  @ManyToOne(() => Departament, (departament) => departament.employees)
  @JoinColumn({ name: 'id_Departament' })
  departament: Departament;

  @ManyToOne(() => Bank, (bank) => bank.employee)
  @JoinColumn({ name: 'id_Bank' })
  bank: Bank;

  @OneToOne(() => User, (user) => user.employee)
  user: User;
}
