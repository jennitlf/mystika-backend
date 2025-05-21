import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultation } from 'src/shared/entities/consultation.entity';
import { Repository } from 'typeorm';
@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
  ) {}

  async create(dataUser, createConsultationDto: any) {
    const { id_schedule_consultant, appoinment_date, appoinment_time } =
      createConsultationDto;
    const appoinmentVerification = await this.consultationRepository
      .createQueryBuilder('consultation')
      .andWhere('consultation.id_customer = :id_customer', {
        id_customer: dataUser,
      })
      .andWhere(
        'consultation.id_schedule_consultant = :id_schedule_consultant',
        { id_schedule_consultant },
      )
      .andWhere('consultation.appoinment_date = :appoinment_date', {
        appoinment_date,
      })
      .andWhere('consultation.appoinment_time = :appoinment_time', {
        appoinment_time,
      })
      .getOne();
    if (appoinmentVerification) {
      throw new HttpException(
        'appointment already scheduled!',
        HttpStatus.CONFLICT,
      );
    }
    const consultation = this.consultationRepository.create({
      id_customer: dataUser,
      ...createConsultationDto,
    });
    return this.consultationRepository.save(consultation);
  }

  async findAll(
    filters: {
      idCustomer?: number;
      idConsultantSpecialty?: number;
      appoinmentDate?: string;
      appoinmentTime?: string;
    },
    page: number = 1,
    limit: number = 10,
  ) {
    const {
      idCustomer,
      idConsultantSpecialty,
      appoinmentDate,
      appoinmentTime,
    } = filters;
    const skip = (page - 1) * limit;

    const query = this.consultationRepository
      .createQueryBuilder('consultation')
      .innerJoinAndSelect('consultation.customer', 'customer')
      .innerJoinAndSelect(
        'consultation.scheduleConsultant',
        'scheduleConsultant',
      )
      .innerJoinAndSelect(
        'scheduleConsultant.consultantSpecialty',
        'consultantSpecialty',
      )
      .innerJoinAndSelect('consultantSpecialty.consultant', 'consultant')
      .innerJoinAndSelect('consultantSpecialty.specialty', 'specialty')
      .select([
        'consultation.id',
        'consultation.appoinment_date',
        'consultation.appoinment_time',
        'consultation.status',
        'customer.id',
        'customer.name',
        'scheduleConsultant.id',
        'consultantSpecialty.id',
        'consultantSpecialty.duration',
        'consultantSpecialty.value_per_duration',
        'consultant.id',
        'consultant.name',
        'specialty.id',
        'specialty.name_specialty',
      ]);

    if (idCustomer) query.andWhere('customer.id = :idCustomer', { idCustomer });
    if (idConsultantSpecialty)
      query.andWhere('consultantSpecialty.id = :idConsultantSpecialty', {
        idConsultantSpecialty,
      });
    if (appoinmentDate)
      query.andWhere('consultation.appoinment_date = :appoinmentDate', {
        appoinmentDate,
      });
    if (appoinmentTime)
      query.andWhere('consultation.appoinment_time = :appoinmentTime', {
        appoinmentTime,
      });

    query.skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    const formattedData = data.map((consultation) => ({
      id: consultation.id,
      customer: {
        id: consultation.customer.id,
        name: consultation.customer.name,
      },
      schedule_consultant: {
        id: consultation.scheduleConsultant.id,
        consultant_specialty: {
          id: consultation.scheduleConsultant.consultantSpecialty.id,
          consultant: {
            id: consultation.scheduleConsultant.consultantSpecialty.consultant
              .id,
            name: consultation.scheduleConsultant.consultantSpecialty.consultant
              .name,
          },
          specialty: {
            id: consultation.scheduleConsultant.consultantSpecialty.specialty
              .id,
            name_specialty:
              consultation.scheduleConsultant.consultantSpecialty.specialty
                .name_specialty,
          },
          value_per_duration:
            consultation.scheduleConsultant.consultantSpecialty
              .value_per_duration,
          duration:
            consultation.scheduleConsultant.consultantSpecialty.duration,
        },
      },
      appoinment_date: consultation.appoinment_date,
      appoinment_time: consultation.appoinment_time,
      status: consultation.status,
    }));

    return {
      data: formattedData,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(dataUser: number) {
    const consultation = await this.consultationRepository.find({
      where: {
        id_customer: dataUser,
      },
    });
    if (!consultation) {
      throw new NotFoundException(`Consultation ID: ${dataUser} not found`);
    }
    return consultation;
  }

  async update(id: string, updateConsultationDto: any) {
    const consultation = await this.consultationRepository.preload({
      ...updateConsultationDto,
      id: +id,
    });
    if (!consultation) {
      throw new NotFoundException(`Consultation ID: ${id} not found`);
    }
    return this.consultationRepository.save(consultation);
  }

  async remove(id: string) {
    const consultation = await this.consultationRepository.findOne({
      where: { id: +id },
    });
    if (!consultation) {
      throw new NotFoundException(`Consultant ID: ${id} not found`);
    }
    return this.consultationRepository.remove(consultation);
  }
}
