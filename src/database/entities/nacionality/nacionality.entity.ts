import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Employee } from '../employee/employee.entity';

@Entity('nacionalidade')
export class Nacionality {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'isocode', type: 'varchar', length: '10', nullable: false })
  isocode: string;

  @Column({
    name: 'nome_nacionalidade',
    type: 'varchar',
    length: '255',
    nullable: false,
  })
  nomeNacionalidade: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'atualizado_em', type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Employee, (Employee) => Employee.nacionality)
  employees: Employee[];
}
