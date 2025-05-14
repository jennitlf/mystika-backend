import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Consultation } from './consultation.entity';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', nullable: false })
  name: string;

  @Column({ name: 'phone', nullable: false })
  phone: string;

  @Column({ name: 'email', nullable: false })
  email: string;

  @Column({ name: 'password', nullable: false })
  password: string;

  @Column({ name: 'status', nullable: false })
  status: string;

  @OneToMany(() => Consultation, (consultation) => consultation.customer)
  consultation: Consultation[];
}
