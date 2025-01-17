import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ConsultantSpecialty } from './consultant_specialty.entity';

@Entity('specialty')
export class Specialty {
    @PrimaryGeneratedColumn()
    id_specialty: number;

    @Column({ name: 'name_specialty', nullable: false, unique: true })
    name_specialty: string;

    @OneToMany(() => ConsultantSpecialty, (consultantSpecialty) => consultantSpecialty.specialty)
    consultantSpecialties: ConsultantSpecialty[]; 
}