// src/features/consultation/consultation.service.ts
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultation } from 'src/shared/entities/consultation.entity';
import { Repository } from 'typeorm';
import { EmailService } from 'src/features/email/email.service';
import { DateUtilsService } from 'src/shared/utils/date.utils';
import { toZonedTime } from 'date-fns-tz';
import { DateTime } from 'luxon';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
    private readonly emailService: EmailService,
    private readonly dateUtilsService: DateUtilsService, 
  ) {}

  async create(timeZone: string, dataUser: any, createConsultationDto: any) {
    const { id_schedule_consultant, appoinment_date_time } = createConsultationDto;
    const clientTimeZone = timeZone;

    if (!clientTimeZone) {
      throw new HttpException(
        'Client timezone is required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const appoinmentDateTimeForDb = appoinment_date_time;

    const appoinmentVerification = await this.consultationRepository
      .createQueryBuilder('consultation')
      .andWhere('consultation.id_customer = :id_customer', {
        id_customer: dataUser,
      })
      .andWhere(
        'consultation.id_schedule_consultant = :id_schedule_consultant',
        { id_schedule_consultant },
      )
      .andWhere('consultation.appoinment_date_time = :appoinment_date_time', {
        appoinment_date_time: appoinmentDateTimeForDb,
      })
      .getOne();

    if (appoinmentVerification) {
      throw new HttpException(
        'Appointment already scheduled!',
        HttpStatus.CONFLICT,
      );
    }

    const consultationToSave = this.consultationRepository.create({
      id_customer: dataUser,
      ...createConsultationDto,
      appoinment_date_time: appoinmentDateTimeForDb,
    });

    const savedResultOfSave: any =
      await this.consultationRepository.save(consultationToSave);

    let savedConsultation: Consultation;
    if (Array.isArray(savedResultOfSave) && savedResultOfSave.length > 0) {
      savedConsultation = savedResultOfSave[0];
    } else if (
      savedResultOfSave &&
      typeof savedResultOfSave === 'object' &&
      'id' in savedResultOfSave
    ) {
      savedConsultation = savedResultOfSave as unknown as Consultation;
    } else {
      console.error(
        'Erro: A operação de save não retornou uma entidade válida ou um array de entidades.',
        savedResultOfSave,
      );
      throw new HttpException(
        'Failed to save consultation: No valid entity returned.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    if (!savedConsultation || !savedConsultation.id) {
      console.error(
        'Erro: A consulta salva ou seu ID ainda está faltando após a extração.',
        savedConsultation,
      );
      throw new HttpException(
        'Failed to retrieve ID for the newly created consultation.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const fullConsultation = await this.consultationRepository
      .createQueryBuilder('consultation')
      .where('consultation.id = :id', { id: savedConsultation.id })
      .leftJoinAndSelect('consultation.customer', 'customer')
      .leftJoinAndSelect(
        'consultation.scheduleConsultant',
        'scheduleConsultant',
      )
      .leftJoinAndSelect(
        'scheduleConsultant.consultantSpecialty',
        'consultantSpecialty',
      )
      .leftJoinAndSelect('consultantSpecialty.consultant', 'consultant')
      .leftJoinAndSelect('consultantSpecialty.specialty', 'specialty')
      .getOne();

    if (
      fullConsultation &&
      fullConsultation.customer &&
      fullConsultation.scheduleConsultant?.consultantSpecialty?.consultant &&
      fullConsultation.scheduleConsultant.consultantSpecialty.specialty
    ) {

      const appointmentDateTimeUTC = new Date(fullConsultation.appoinment_date_time);
      const consultationDateTimeInClientZone = toZonedTime(appointmentDateTimeUTC, clientTimeZone);

      const formattedDate = consultationDateTimeInClientZone.toLocaleDateString('pt-BR');

      const hours = consultationDateTimeInClientZone.getHours().toString().padStart(2, '0');
      const minutes = consultationDateTimeInClientZone.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;

      await this.emailService.sendNewConsultationScheduledToConsultant(
        fullConsultation.scheduleConsultant.consultantSpecialty.consultant.email,
        fullConsultation.scheduleConsultant.consultantSpecialty.consultant.name,
        fullConsultation.customer.name,
        fullConsultation.scheduleConsultant.consultantSpecialty.specialty
          .name_specialty,
        formattedDate,
        formattedTime,
      );
    }

    return savedConsultation;
}
  
  async findAll(
    timeZone: string,
    filters: {
      idCustomer?: number;
      idConsultantSpecialty?: number;
      appoinment_date_time?: string;
    },
    page: number = 1,
    limit: number = 10,
  ) {
    const { idCustomer, idConsultantSpecialty, appoinment_date_time } = filters;
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
        'consultation.appoinment_date_time',
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
  
    if (appoinment_date_time) {
      const utcDateTime = this.dateUtilsService.getZonedDate(
        new Date(appoinment_date_time),
        timeZone,
      );
      query.andWhere('consultation.appoinment_date_time = :utcDateTime', {
        utcDateTime,
      });
    }
  
    query.skip(skip).take(limit);
  
    const [data, total] = await query.getManyAndCount();
  
    const formattedData = data.map((consultation) => {
      const localDateTime = DateTime.fromISO(consultation.appoinment_date_time.toISOString(), { zone: 'utc' });
      const zonedDateTime = localDateTime.setZone(timeZone);
  
      return {
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
        localDateTime: {
          date: zonedDateTime.toISODate(),
          time: zonedDateTime.toFormat('HH:mm'),
        },
        status: consultation.status,
      };
    });
  
    return {
      data: formattedData,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
  
  // metodo não necessita de timezone, pois não é utilizado pelo cliente
  async findByIdConsultation(id: string) {
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
        'consultation.id_customer',
        'consultation.id_schedule_consultant',
        'customer.id',
        'scheduleConsultant.id',
        'consultantSpecialty.id',
        'consultant.id',
        'specialty.id',
      ])
      .where('consultation.id = :id', { id: +id });

    const consultations = await query.getMany();

    if (!consultations.length) {
      throw new HttpException(`Consultations for user ID: ${id} not found`, HttpStatus.NOT_FOUND)
    }

    const formattedData = consultations.map((consultation) => ({
      id: consultation.id,
      customer: {
        id: consultation.customer.id,
      },
      schedule_consultant: {
        id: consultation.scheduleConsultant.id,
        consultant_specialty: {
          id: consultation.scheduleConsultant.consultantSpecialty.id,
          consultant: {
            id: consultation.scheduleConsultant.consultantSpecialty.consultant
              .id,
          },
          specialty: {
            id: consultation.scheduleConsultant.consultantSpecialty.specialty
              .id,
          },
        },
      },
    }));
    return { data: formattedData };
  }
//  busca pelo id do cliente, retorna todas as consultas agendadas pelo cliente, independente de ser consultor ou usuario
  async findOne(timeZone: string, dataUser: number) {
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
        'consultation.id_customer',
        'consultation.id_schedule_consultant',
        'consultation.appoinment_date_time',
        'consultation.status',
        'consultation.attended',
        'consultation.created_at',
        'consultation.updated_at',
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
      ])
      .where('customer.id = :dataUser', { dataUser });

    const consultations = await query.getMany();

    if (!consultations.length) {
      throw new HttpException(`Consultations for user ID: ${dataUser} not found`, HttpStatus.NO_CONTENT)
    }

    const formattedData = consultations.map((consultation) => {

      const localDateTime = DateTime.fromISO(consultation.appoinment_date_time.toISOString(), { zone: 'utc' });
      const zonedDateTime = localDateTime.setZone(timeZone);

      return {
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
      localDateTime: {
        date: zonedDateTime.toISODate(),
        time: zonedDateTime.toFormat('HH:mm'),
        },
      status: consultation.status,
      attended: consultation.attended,
      created_at: consultation.created_at,
      updated_at: consultation.updated_at,
      }
    });
    return { data: formattedData };
  }
  // busca consultas por id do consultor
  async findOneByIdConsultant(timeZone:string, dataUser: number) {
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
      .where('consultant.id = :id', { id: dataUser });

    const consultations = await query.getMany();

    if (!consultations.length) {
      throw new HttpException(`Consultations for user ID: ${dataUser} not found`, HttpStatus.NOT_FOUND)
    }

    const formattedData = consultations.map((consultation) => {
      const localDateTime = DateTime.fromISO(consultation.appoinment_date_time.toISOString(), { zone: 'utc' });
      const zonedDateTime = localDateTime.setZone(timeZone);
      return{
      id: consultation.id,
      customer: {
        id: consultation.customer.id,
        name: consultation.customer.name,
        email: consultation.customer.email,
        phone: consultation.customer.phone,
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
      localDateTime: {
          date: zonedDateTime.toISODate(),
          time: zonedDateTime.toFormat('HH:mm'),
        },
      status: consultation.status,
      attended: consultation.attended,
      created_at: consultation.created_at,
      updated_at: consultation.updated_at,
      }
    });
    return { data: formattedData };
  }

  async cancelConsultationByCustomer(
    consultationId: string,
    timeZone: string,
    customerId: number,
  ) {
    const consultation = await this.consultationRepository.preload({
      id: +consultationId,
    });
  
    if (!consultation) {
      throw new HttpException(
        `Consultation ID: ${consultationId} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  
    if (consultation.id_customer !== customerId) {
      throw new ForbiddenException(
        'Você não tem permissão para cancelar esta consulta.',
      );
    }
  
    if (consultation.status !== 'pendente') {
      throw new BadRequestException(
        'Somente consultas com status "pendente" podem ser canceladas pelo cliente.',
      );
    }
  
    consultation.status = 'cancelada';
    const updatedConsultation =
      await this.consultationRepository.save(consultation);
  
    const fullConsultation = await this.consultationRepository
      .createQueryBuilder('consultation')
      .where('consultation.id = :id', { id: updatedConsultation.id })
      .leftJoinAndSelect('consultation.customer', 'customer')
      .leftJoinAndSelect(
        'consultation.scheduleConsultant',
        'scheduleConsultant',
      )
      .leftJoinAndSelect(
        'scheduleConsultant.consultantSpecialty',
        'consultantSpecialty',
      )
      .leftJoinAndSelect('consultantSpecialty.consultant', 'consultant')
      .leftJoinAndSelect('consultantSpecialty.specialty', 'specialty')
      .getOne();
  
    if (
      fullConsultation &&
      fullConsultation.customer &&
      fullConsultation.scheduleConsultant?.consultantSpecialty?.consultant
    ) {
      const localDateTime = DateTime.fromISO(consultation.appoinment_date_time.toISOString(), { zone: 'utc' });
      const zonedDateTime = localDateTime.setZone(timeZone);

      const formattedDate = zonedDateTime.toISODate();
      const formattedTime = zonedDateTime.toFormat('HH:mm');
  
      await this.emailService.sendConsultationCanceledByCustomerToConsultant(
        fullConsultation.scheduleConsultant.consultantSpecialty.consultant.email,
        fullConsultation.scheduleConsultant.consultantSpecialty.consultant.name,
        fullConsultation.customer.name,
        fullConsultation.scheduleConsultant.consultantSpecialty.specialty
          .name_specialty,
        formattedDate,
        formattedTime,
      );
    }
  
    return updatedConsultation;
  }
  
  async findConsultationsByUserIdPaginated(
    timeZone: string,
    userId: number,
    page: number,
    limit: number,
  ): Promise<{ data: any[]; total: number }> {
    const skip = (page - 1) * limit;
  
    const queryBuilder = this.consultationRepository
      .createQueryBuilder('consultation')
      .where('consultation.id_customer = :userId', { userId })
      .leftJoinAndSelect(
        'consultation.scheduleConsultant',
        'scheduleConsultant',
      )
      .leftJoinAndSelect(
        'scheduleConsultant.consultantSpecialty',
        'consultantSpecialty',
      )
      .leftJoinAndSelect('consultantSpecialty.specialty', 'specialty')
      .leftJoinAndSelect('consultantSpecialty.consultant', 'consultant')
      .orderBy('consultation.appoinment_date_time', 'DESC')
      .skip(skip)
      .take(limit);
  
    const [consultations, totalCount] = await queryBuilder.getManyAndCount();
  
    const data = consultations.map((consultation) => {
      const localDateTime = DateTime.fromISO(consultation.appoinment_date_time.toISOString(), { zone: 'utc' });
      const zonedDateTime = localDateTime.setZone(timeZone);
  
      return {
        ...consultation,
        localDateTime: {
          date: zonedDateTime.toISODate(),
          time: zonedDateTime.toFormat('HH:mm'),
        },
      };
    });
  
    return { data, total: totalCount };
  }
  

  async updateStatusByConsultant(
    consultationId: string,
    timeZone: string,
    updateConsultationDto: any,
    consultantId: number,
  ) {
    const consultation = await this.consultationRepository.preload({
      id: +consultationId,
    });
  
    if (!consultation) {
      throw new HttpException(
        `Consultation ID: ${consultationId} not found`,
        HttpStatus.NO_CONTENT,
      );
    }
  
    const fullConsultationCheck = await this.consultationRepository
    .createQueryBuilder('consultation')
    .where('consultation.id = :id', { id: +consultationId })
    .innerJoin('consultation.customer', 'customer')
    .innerJoin('consultation.scheduleConsultant', 'scheduleConsultant')
    .innerJoin('scheduleConsultant.consultantSpecialty', 'consultantSpecialty')
    .innerJoin('consultantSpecialty.specialty', 'specialty')
    .innerJoin('consultantSpecialty.consultant', 'consultant')
    .select([
      'consultation.id',
      'consultation.appoinment_date_time',
      'scheduleConsultant.id',
      'customer.id',
      'customer.name',
      'customer.email',
      'consultantSpecialty.id',
      'consultant.id',
      'consultant.name',
      'specialty.name_specialty',
    ])
    .getOne();
    
    if (
      !fullConsultationCheck ||
      fullConsultationCheck.scheduleConsultant?.consultantSpecialty?.consultant
        .id !== consultantId
    ) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar esta consulta.',
      );
    }
    Object.assign(consultation, updateConsultationDto);
    const updatedConsultation =
      await this.consultationRepository.save(consultation);
  
    const localDateTime = DateTime.fromISO(consultation.appoinment_date_time.toISOString(), { zone: 'utc' });
    const zonedDateTime = localDateTime.setZone(timeZone);

    const formattedDate = zonedDateTime.toISODate();
    const formattedTime = zonedDateTime.toFormat('HH:mm');
  
    if (updateConsultationDto.status === 'realizada') {
      await this.emailService.sendConsultationCompletedToCustomer(
        fullConsultationCheck.customer.email,
        fullConsultationCheck.customer.name,
        fullConsultationCheck.scheduleConsultant.consultantSpecialty.consultant
          .name,
        fullConsultationCheck.scheduleConsultant.consultantSpecialty.specialty
          .name_specialty,
        this.dateUtilsService.formatDysplayDate(formattedDate),
        formattedTime,
      );
    } else if (updateConsultationDto.status === 'cancelada') {
      await this.emailService.sendConsultationCanceledByConsultantToCustomer(
        fullConsultationCheck.customer.email,
        fullConsultationCheck.customer.name,
        fullConsultationCheck.scheduleConsultant.consultantSpecialty.consultant
          .name,
        fullConsultationCheck.scheduleConsultant.consultantSpecialty.specialty
          .name_specialty,
        this.dateUtilsService.formatDysplayDate(formattedDate),
        formattedTime,
      );
    } 
  
    return updatedConsultation;
  }
  

  async remove(id: string) {
    const consultation = await this.consultationRepository.findOne({
      where: { id: +id },
    });
    if (!consultation) {
      throw new NotFoundException(`Consulta com ID: ${id} não encontrada`);
    }
    return this.consultationRepository.remove(consultation);
  }
}
