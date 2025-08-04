import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Consultation } from './consultation.entity';
import { CustomerSupport } from './customer_support.entity';
import { PaymentMethodsCustomer } from './payment_methods_customer.entity';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    nullable: false,
    type: 'varchar',
    length: 60,
    default: 'NaN',
  })
  name: string;

  @Column({
    name: 'cpf',
    nullable: false,
    type: 'varchar',
    length: 11,
    default: 'NaN',
  })
  cpf: string;

  @Column({
    name: 'phone',
    nullable: false,
    type: 'varchar',
    length: 15,
    default: 'NaN',
  })
  phone: string;

  @Column({
    name: 'email',
    nullable: false,
    type: 'varchar',
    length: 60,
    unique: true,
    default: 'NaN',
  })
  email: string;

  @Column({
    name: 'password',
    nullable: false,
    type: 'varchar',
    length: 300,
    default: 'NaN',
  })
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
    length: 4,
    default: 'user',
  })
  role: string;

  @Column({
    name: 'mercadopago_customer_id',
    nullable: true,
    type: 'varchar',
    length: 255,
    unique: true,
    default: null,
  })
  mercadopago_customer_id: string;

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

  @OneToMany(
    () => CustomerSupport,
    (customerSupport) => customerSupport.customer,
  )
  customerSupport: CustomerSupport[];

  @OneToMany(
    () => PaymentMethodsCustomer,
    (paymentMethod) => paymentMethod.customer,
  )
  paymentMethods: PaymentMethodsCustomer[];
}