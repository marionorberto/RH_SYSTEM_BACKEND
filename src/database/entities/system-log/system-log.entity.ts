import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity('logs_sistema')
export class SystemLog {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'id_user', type: 'int', nullable: true })
  idUser: number;

  @Column({
    name: 'nome_user',
    type: 'varchar',
    length: '100',
    nullable: false,
  })
  username: string;

  @Column({ name: 'acao', type: 'varchar', length: '100', nullable: false })
  acao: string;

  @Column({
    name: 'tabela_afetada',
    type: 'varchar',
    length: '100',
    nullable: true,
  })
  TableAffected: string;

  @Column({ name: 'id_registo', type: 'int', nullable: true })
  idRegister: number;

  @Column({
    name: 'descricao_registo',
    type: 'varchar',
    length: '100',
    nullable: true,
  })
  registrationDescription: string;

  @Column({ name: 'descricao', type: 'varchar', length: '255', nullable: true })
  description: string;

  @Column({ name: 'dados_antes', type: 'text', nullable: true })
  dataBefore: string;

  @Column({ name: 'dados_depois', type: 'text', nullable: true })
  dataAfter: string;

  @Column({ name: 'ip_address', type: 'varchar', length: '45', nullable: true })
  ipAddress: string;

  @Column({
    name: 'user_agent',
    type: 'varchar',
    length: '255',
    nullable: true,
  })
  userAgent: string;

  @CreateDateColumn({ name: 'data_hora', type: 'timestamp' })
  dateHour: Date;

  @ManyToOne(() => User, (user) => user.systemLog, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'id_user' })
  user: User;
}
