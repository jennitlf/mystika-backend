import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany} from 'typeorm';
import { ConsultantSpecialty } from './consultant_specialty.entity';

@Entity('consultant')
export class Consultant {
    @PrimaryGeneratedColumn()
    id_consultant: number;

    @Column({ name:'name', nullable: false })
    name: string;

    @Column({ name: 'cpf', nullable: false })
    cpf: string;

    @Column({ name:'phone', nullable: false })
    phone: string;

    @Column({ name: 'email', unique: true, nullable: false })
    email: string;

    @Column({ name:'password', nullable: false })
    password: string;

    @Column({ name:'profile_data', nullable: false })
    profile_data: string;

    @Column({ name: 'consultants_story', nullable: false})
    consultants_story: string;

    @Column({ name: 'about_specialties', nullable: false})
    about_specialties: string;

    @Column({ name:'image_consultant', nullable: false })
    image_consultant: string;

    @Column({name:'consultations_carried_out', nullable: true})
    consultations_carried_out: string;

    @Column({ name:'status', nullable: false })
    status: string;

    @Column({ name: 'payment_plan', nullable: false })
    payment_plan: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToMany(() => ConsultantSpecialty, (consultantSpecialty) => consultantSpecialty.consultant)
    consultantSpecialties: ConsultantSpecialty[];
}