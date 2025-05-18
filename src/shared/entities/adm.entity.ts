import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ConsultantSupport } from './consultant_support.entity';
import { CustomerSupport } from './customer_support.entity';

@Entity('adm')
export class Adm {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', length: 80, nullable: false, type: 'varchar' })
  name: string;

  @Column({
    name: 'email',
    length: 254,
    unique: true,
    nullable: false,
    type: 'varchar',
  })
  email: string;

  @Column({ name: 'password', length: 255, type: 'varchar', nullable: false })
  password: string;

  @Column({
    name: 'role',
    length: 3,
    type: 'varchar',
    nullable: false,
    default: 'adm',
  })
  role: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(
    () => ConsultantSupport,
    (consultantSupport) => consultantSupport.adm,
  )
  consultantSupport: ConsultantSupport[];

  @OneToMany(() => CustomerSupport, (customerSupport) => customerSupport.adm)
  customerSupport: CustomerSupport[];
}
