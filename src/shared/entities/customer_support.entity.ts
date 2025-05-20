import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Adm } from './adm.entity';
import { Customer } from './customer.entity';

@Entity('customer_support')
export class CustomerSupport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'id_customer',
    type: 'int',
    nullable: false,
  })
  id_customer: number;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: false,
    length: 60,
  })
  email: string;

  @Column({
    name: 'phone',
    nullable: false,
    type: 'varchar',
    length: 15,
  })
  phone: string;

  @Column({
    name: 'title',
    type: 'varchar',
    nullable: false,
    length: 100,
  })
  title: string;

  @Column({
    name: 'content',
    type: 'varchar',
    nullable: false,
    length: 300,
  })
  content: string;

  @Column({
    name: 'status',
    type: 'varchar',
    length: 30,
    default: 'pendente',
  })
  status: string;

  @Column({
    name: 'admResponsible',
    type: 'int',
    default: 1,
  })
  admResponsible: Adm;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Customer, (customer) => customer.customerSupport)
  @JoinColumn({ name: 'id_customer' })
  customer: Customer;

  @ManyToOne(() => Adm, (adm) => adm.customerSupport)
  @JoinColumn({ name: 'admResponsible' })
  adm: Adm[];
}
