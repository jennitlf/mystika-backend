import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Consultation } from './consultation.entity';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: false, type: 'varchar', length: 60 })
  name: string;

  @Column({ name: 'phone', nullable: false, type: 'varchar', length: 15 })
  phone: string;

  @Column({
    name: 'email',
    nullable: false,
    type: 'varchar',
    length: 60,
    unique: true,
  })
  email: string;

  @Column({ name: 'password', nullable: false, type: 'varchar', length: 300 })
  password: string;

  @Column({
    name: 'status',
    nullable: false,
    type: 'varchar',
    length: 15,
    default: 'pending',
  })
  status: string;

  @Column({
    name: 'role',
    nullable: false,
    type: 'varchar',
    length: 25,
    default: 'user',
  })
  role: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @OneToMany(() => Consultation, (consultation) => consultation.customer)
  consultation: Consultation[];
}
