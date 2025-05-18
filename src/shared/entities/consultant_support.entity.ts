import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Consultant } from './consultant.entity';
import { Adm } from './adm.entity';

@Entity('consultant_support')
export class ConsultantSupport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_consultant', nullable: false, type: 'int' })
  id_consultant: Consultant;

  @Column({ name: 'email', nullable: false, type: 'varchar', length: 30 })
  email: string;

  @Column({ name: 'phone', type: 'int', nullable: false })
  phone: string;

  @Column({ name: 'title', type: 'varchar', nullable: false, length: 100 })
  title: string;

  @Column({ name: 'content', type: 'varchar', nullable: false, length: 300 })
  content: string;

  @Column({
    name: 'status',
    type: 'varchar',
    nullable: false,
    length: 50,
    default: 'pending',
  })
  status: string;

  @Column({
    name: 'admResponsible',
    type: 'int',
    nullable: false,
    default: 0,
  })
  admResponsible: Adm;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Consultant, (consultant) => consultant.consultantSupport)
  @JoinColumn({ name: 'id_consultant' })
  consultant: Consultant;

  @ManyToOne(() => Adm, (adm) => adm.consultantSupport)
  @JoinColumn({ name: 'admResponsible' })
  adm: Adm[];
}
