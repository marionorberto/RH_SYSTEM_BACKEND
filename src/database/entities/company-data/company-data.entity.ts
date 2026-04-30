// backend/src/database/entities/company-data/company-data.entity.ts
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('dados_empresa')
export class CompanyData {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({
    name: 'nome_empresa',
    type: 'varchar',
    length: '255',
    nullable: false,
  })
  companyName: string;

  @Column({
    name: 'nif_empresa',
    type: 'varchar',
    length: '20',
    nullable: false,
  })
  companyNIF: string;

  @Column({
    name: 'modelo_recibo',
    type: 'varchar',
    length: '100',
    nullable: true,
  })
  tickectModel: string;

  @Column({
    name: 'smtp_email',
    type: 'varchar',
    length: '255',
    nullable: true,
  })
  smtpEmail: string;

  @Column({
    name: 'smtp_password',
    type: 'varchar',
    length: '255',
    nullable: true,
  })
  smtpPassword: string;

  @Column({
    name: 'numerosegsoc',
    type: 'varchar',
    length: '50',
    nullable: true,
  })
  SocialSecurityPassword: string;

  @Column({
    name: 'email_corporativo',
    type: 'varchar',
    length: '255',
    nullable: true,
  })
  corporativeEmail: string;

  @Column({ name: 'linkedin', type: 'varchar', length: '255', nullable: true })
  linkedin: string;

  @Column({ name: 'whatsapp', type: 'varchar', length: '20', nullable: true })
  whatsapp: string;

  @Column({ name: 'instagram', type: 'varchar', length: '255', nullable: true })
  instagram: string;

  @Column({ name: 'telefone', type: 'varchar', length: '20', nullable: true })
  phone1: string;

  @Column({ name: 'telefone2', type: 'varchar', length: '20', nullable: true })
  phone2: string;

  @Column({ name: 'rua', type: 'varchar', length: '255', nullable: true })
  street: string;

  @Column({ name: 'bairro', type: 'varchar', length: '255', nullable: true })
  neighbourhood: string;

  @Column({ name: 'num_casa', type: 'varchar', length: '50', nullable: true })
  houseNumber: string;

  @Column({ name: 'fax', type: 'varchar', length: '20', nullable: true })
  fax: string;

  @Column({ name: 'logotipo64', type: 'text', nullable: true })
  logotipo64: string;

  @Column({
    name: 'codigopostal',
    type: 'varchar',
    length: '20',
    nullable: true,
  })
  postalCode: string;

  @Column({ name: 'Notas', type: 'text', nullable: true })
  note: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;
}
