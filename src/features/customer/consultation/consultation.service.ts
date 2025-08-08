import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Consultation, ConsultationStatus } from '../../../shared/entities/consultation.entity';
import { Repository } from 'typeorm';
import { EmailService } from '../../email/email.service';
import { DateUtilsService } from '../../../shared/utils/date.utils';
import { DateTime } from 'luxon';
import { CreatePaymentPixDto } from '../../../shared/dtos/create-payment-pix.dto';
import { CreatePaymentCardDto } from '../../../shared/dtos/create-payment-card.dto';
import { CreatePaymentBoletoDto } from '../../../shared/dtos/create-payment-boleto.dto';
import { PaymentService } from '../../consultant/payment/payment.service';
import { returnPix, returnCard, returnBoleto } from '../../../shared/types/return-payment.types';
import { Payment, PaymentStatus } from '../../../shared/entities/payments.entity';
import { PaymentCardDto } from '../../../shared/dtos/payment-card.dto';
import { Customer } from 'src/shared/entities/customer.entity';
import { PaymentBoletoDto } from 'src/shared/dtos/payment-boleto.dto';
import { PaymentPixDto } from 'src/shared/dtos/payment-pix.dto';

@Injectable()
export class ConsultationService {
  constructor(
    @InjectRepository(Consultation)
    private readonly consultationRepository: Repository<Consultation>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    private readonly emailService: EmailService,
    private readonly dateUtilsService: DateUtilsService,
    private readonly paymentService: PaymentService,
  ) {}
  async create(
    timeZone: string,
    dataUser: any,
    createConsultationDto: any,
    paymentMethod: 'pix',
    paymentDetails: PaymentPixDto,
  ): Promise<any>;

  async create(
    timeZone: string,
    dataUser: any,
    createConsultationDto: any,
    paymentMethod: 'boleto',
    paymentDetails: PaymentBoletoDto,
  ): Promise<any>;

  async create(
    timeZone: string,
    dataUser: any,
    createConsultationDto: any,
    paymentMethod: 'card',
    paymentDetails: PaymentCardDto,
  ): Promise<any>;

  async create(
    timeZone: string, 
    dataUser: any, 
    createConsultationDto: any,
    paymentMethod: string,
    paymentDetails: PaymentPixDto | PaymentBoletoDto | PaymentCardDto ,
  ) {
    const { id_schedule_consultant, appoinment_date_time } = createConsultationDto;
    const clientTimeZone = timeZone;
    console.log('data', appoinment_date_time)
    type possiblesReturns = returnPix | returnCard | returnBoleto;

    if (!clientTimeZone) {
      throw new HttpException(
        'Client timezone is required.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const appoinmentDateTimeForDb = appoinment_date_time;
    console.log('appoinmentDateTimeForDb', appoinmentDateTimeForDb)
    const appoinmentVerification = await this.consultationRepository
      .createQueryBuilder('consultation')
      .leftJoinAndSelect('consultation.customer', 'customer') 
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
      if (appoinmentVerification.status === ConsultationStatus.CONFIRMED) {
        throw new HttpException(
          'Appointment already scheduled!',
          HttpStatus.CONFLICT,
        );
      }
    }
    
    const customer = await this.customerRepository.findOne({ where: { id: dataUser } });

    if (!customer) {
      throw new HttpException(
        'Customer not found for the provided ID.',
        HttpStatus.NOT_FOUND,
      );
    }

    let paymentResponse: possiblesReturns;

    const customerNameParts = customer.name.split(' ');
        const firstName = customerNameParts[0];
        const lastName = customerNameParts.length > 1 ? customerNameParts[customerNameParts.length - 1] : undefined;

    switch (paymentMethod) {
      case 'pix':
      const currentPixDetails = paymentDetails as PaymentPixDto;

        const fullPaymentPixDto: CreatePaymentPixDto = {
          transaction_amount: currentPixDetails.transaction_amount,
          description: currentPixDetails.description,
          payer: {
            email: customer.email,
            first_name: firstName,
            last_name: lastName,
            identification: {
              type: 'CPF',
              number: customer.cpf,
            },
          },
        }

        paymentResponse = await this.paymentService.pix(dataUser, fullPaymentPixDto);
        break;

      case 'boleto':
        const currentBoletoDetails = paymentDetails as PaymentBoletoDto;

        const fullPaymentBoletoDto: CreatePaymentBoletoDto = {
          transaction_amount: currentBoletoDetails.transaction_amount,
          description: currentBoletoDetails.description,
          payer:{
            email: customer.email,
            first_name: firstName,
            last_name: lastName,
            identification: {
              type: 'CPF',
              number: customer.cpf,
            },
            address: {
              zip_code: currentBoletoDetails.payer.address.zip_code,
              street_name: currentBoletoDetails.payer.address.street_name,
              street_number: currentBoletoDetails.payer.address.street_number,
              neighborhood: currentBoletoDetails.payer.address.neighborhood,
              city: currentBoletoDetails.payer.address.city,
              federal_unit: currentBoletoDetails.payer.address.federal_unit,
            }
          }
        }
        

        paymentResponse = await this.paymentService.boleto(dataUser, fullPaymentBoletoDto);
        break;
      case 'card':
        const currentCardDetails = paymentDetails as PaymentCardDto;

        const fullPaymentCardDto: CreatePaymentCardDto = {
          transaction_amount: currentCardDetails.transaction_amount,
          description: currentCardDetails.description,
          token: currentCardDetails.token,
          installments: 1,
          payer: {
            email: customer.email,
            first_name: firstName,
            last_name: lastName,
            identification: {
              type: 'CPF',
              number: customer.cpf,
            },
          },
        };

        paymentResponse = await this.paymentService.card(dataUser, fullPaymentCardDto);
        break;
    }

    let newConsultationStatus: ConsultationStatus;
    if (paymentMethod === 'card'){
      const statusCard = (paymentResponse as returnCard).status
      if (
        (paymentResponse as returnCard).status === PaymentStatus.PENDING ||
        statusCard === PaymentStatus.IN_PROCESS ||
        statusCard === PaymentStatus.authorized ||
        statusCard === PaymentStatus.OTHER
      ) {
        newConsultationStatus = ConsultationStatus.PENDING_PAYMENT;
      } else if (
        statusCard === PaymentStatus.REJECTED ||
        statusCard === PaymentStatus.CANCELED ||
        statusCard === PaymentStatus.CHARGEBACK
      ) {
        newConsultationStatus = ConsultationStatus.PAYMENT_FAILURE;
      } else if (statusCard === PaymentStatus.APPROVED) {
        newConsultationStatus = ConsultationStatus.CONFIRMED;
      } else if (statusCard === PaymentStatus.REFUNDED) {
        newConsultationStatus = ConsultationStatus.CANCELED;
      } else {
        throw new InternalServerErrorException(
          (`Status de pagamento '${statusCard}' não mapeado para status de consulta. Mantendo status atual.`)
        );
      }
    }
    console.log('appoinmentDateTimeForDb 2', appoinmentDateTimeForDb)
    const consultationToSave = this.consultationRepository.create({
      id_customer: dataUser,
      status: newConsultationStatus || ConsultationStatus.PENDING_PAYMENT,
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

    await this.paymentService.updatePaymetAddIdConsultation(savedConsultation.id, paymentResponse.id)    

    if(savedConsultation.status === ConsultationStatus.CONFIRMED) {
      const newConsultation = await this.consultationRepository
      .createQueryBuilder('consultation')
      .leftJoinAndSelect('consultation.customer', 'customer')
      .leftJoinAndSelect('consultation.scheduleConsultant', 'scheduleConsultant')
      .leftJoinAndSelect('scheduleConsultant.consultantSpecialty', 'consultantSpecialty')
      .leftJoinAndSelect('consultantSpecialty.consultant', 'consultant')
      .leftJoinAndSelect('consultantSpecialty.specialty', 'specialty')
      .where('consultation.id = :id', { id: savedConsultation.id })
      .getOne();

      const localDateTime = DateTime.fromISO(newConsultation.appoinment_date_time.toISOString(), { zone: 'utc' });
      const zonedDateTime = localDateTime.setZone(timeZone);

      await this.emailService.sendNewConsultationScheduledToConsultant(
        newConsultation.scheduleConsultant.consultantSpecialty.consultant.email,
        newConsultation.scheduleConsultant.consultantSpecialty.consultant.name,
        newConsultation.customer.name,
        newConsultation.scheduleConsultant.consultantSpecialty.specialty.name_specialty,
        zonedDateTime
      )
    }

    return {
      consultation: savedConsultation,
      payment: paymentResponse
    };
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
      .where('consultant.id = :id', { id: dataUser })
      .andWhere('consultation.status == :status', { status: ConsultationStatus.CONFIRMED });

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
  
    if (consultation.status !== ConsultationStatus.CONFIRMED) {
      throw new BadRequestException(
        `Somente consultas com status ${ConsultationStatus.CONFIRMED} podem ser canceladas pelo cliente.`,
      );
    }
  
    consultation.status = ConsultationStatus.CANCELED;
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

  async findConsultationsByConsultantIdPaginated(
    timeZone: string,
    consultantId: number,
    page: number,
    limit: number,
  ): Promise<{ data: any[]; total: number }> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.consultationRepository
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
      .where('consultant.id = :consultantId', { consultantId })
      .andWhere('consultation.status = :status', {
        status: ConsultationStatus.CONFIRMED,
      })
      .orderBy('consultation.appoinment_date_time', 'DESC')
      .skip(skip)
      .take(limit);

    const [consultations, totalCount] = await queryBuilder.getManyAndCount();

    const data = consultations.map((consultation) => {
      const localDateTime = DateTime.fromISO(
        consultation.appoinment_date_time.toISOString(),
        { zone: 'utc' },
      );
      const zonedDateTime = localDateTime.setZone(timeZone);
      return {
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
              id: consultation.scheduleConsultant.consultantSpecialty
                .consultant.id,
              name: consultation.scheduleConsultant.consultantSpecialty
                .consultant.name,
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
      };
    });

    return { data, total: totalCount };
  }
  

  async updateStatusByConsultant(
    consultationId: string,
    timeZone: string,
    updateConsultationDto: any,
    consultantId: number,
    role: string,
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
      'consultant.email',
      'specialty.name_specialty',
    ])
    .getOne();
    
    if (role === 'adm') {
    } else if (
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
    
    if (updateConsultationDto.status === 'cancelada' && role === 'adm') {
      await this.emailService.sendConsultationCancelledEmail(
        fullConsultationCheck.scheduleConsultant.consultantSpecialty.consultant.email,
        fullConsultationCheck.scheduleConsultant.consultantSpecialty.consultant.name,
        fullConsultationCheck.id
      )
    } else if(updateConsultationDto.status === 'realizada' && role === 'adm'){
      await this.emailService.sendConsultationCompletedEmail(
        fullConsultationCheck.scheduleConsultant.consultantSpecialty.consultant.email,
        fullConsultationCheck.scheduleConsultant.consultantSpecialty.consultant.name,
        fullConsultationCheck.id
      )
    } else if (updateConsultationDto.status === 'realizada') {
      if(role === 'consultant' || role === 'adm') {
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
      }
    } else if (updateConsultationDto.status === 'cancelada') {
      if(role === 'consultant' || role === 'adm') {
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
    }
  
    return updatedConsultation;
  }
  
  async updadeStatusbUpdatePayment(consultationId: number) {
 
    const consultation = await this.consultationRepository.findOne({
      where: { id: consultationId },
      relations: ['payments'],
    });

    if (!consultation) {
      throw new InternalServerErrorException('Consulta não encontrada.');
    }

    let payment: Payment | null = null;
    if (consultation.payments && consultation.payments.length > 0) {
      const sortedPayments = consultation.payments.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      );
      payment = sortedPayments[0];
    }

    if (!payment) {
      throw new InternalServerErrorException('Pagamento não encontrado para esta consulta.');
    }

    let newConsultationStatus: ConsultationStatus;

    if (
      payment.status === PaymentStatus.PENDING ||
      payment.status === PaymentStatus.IN_PROCESS ||
      payment.status === PaymentStatus.authorized ||
      payment.status === PaymentStatus.OTHER
    ) {
      newConsultationStatus = ConsultationStatus.PENDING_PAYMENT;
    } else if (
      payment.status === PaymentStatus.REJECTED ||
      payment.status === PaymentStatus.CANCELED ||
      payment.status === PaymentStatus.CHARGEBACK
    ) {
      newConsultationStatus = ConsultationStatus.PAYMENT_FAILURE;
    } else if (payment.status === PaymentStatus.APPROVED) {
      newConsultationStatus = ConsultationStatus.CONFIRMED;
    } else if (payment.status === PaymentStatus.REFUNDED) {
      newConsultationStatus = ConsultationStatus.CANCELED;
    } else {
      throw new InternalServerErrorException(
        (`Status de pagamento '${payment.status}' não mapeado para status de consulta. Mantendo status atual.`)
      );
    }

    if (consultation.status !== newConsultationStatus) {
      await this.consultationRepository.update(
        consultation.id,
        { status: newConsultationStatus },
      );
      const updatedConsultation = await this.consultationRepository.findOne({
        where: { id: consultation.id },
        relations: [
          'payments',
          'customer',
          'scheduleConsultant',
          'scheduleConsultant.consultant',
          'scheduleConsultant.consultantSpecialty',
          'scheduleConsultant.consultantSpecialty.consultant',
          'scheduleConsultant.consultantSpecialty.specialty',
        ],
      });

      if (
        updatedConsultation &&
        updatedConsultation.customer && updatedConsultation.customer.email && updatedConsultation.customer.name &&
        updatedConsultation.scheduleConsultant &&
        updatedConsultation.scheduleConsultant.consultantSpecialty.consultant &&
        updatedConsultation.scheduleConsultant.consultantSpecialty &&
        updatedConsultation.scheduleConsultant.consultantSpecialty.specialty
      ) {
        const consultantName = updatedConsultation.scheduleConsultant.consultantSpecialty.consultant.name;
        const specialtyName = updatedConsultation.scheduleConsultant.consultantSpecialty.specialty.name_specialty; 

        await this.emailService.sendConsultationStatusUpdateEmail(
          updatedConsultation.customer.email,
          updatedConsultation.customer.name,
          updatedConsultation.id,
          newConsultationStatus,
          updatedConsultation.appoinment_date,
          updatedConsultation.appoinment_time,
          consultantName,
          specialtyName,
        );
      } else {
          console.warn(`[ConsultationService] Dados incompletos para enviar e-mail de atualização de status para a consulta ${consultationId}. Certifique-se de que todas as relações (cliente, consultor, especialidade) foram carregadas corretamente.`);
      }

      if (
        updatedConsultation &&
        updatedConsultation.status === ConsultationStatus.CONFIRMED &&
        updatedConsultation.customer &&
        updatedConsultation.scheduleConsultant?.consultantSpecialty?.consultant &&
        updatedConsultation.scheduleConsultant.consultantSpecialty.specialty
      ) {  
        await this.emailService.sendNewConsultationScheduledToConsultant(
          updatedConsultation.scheduleConsultant.consultantSpecialty.consultant.email,
          updatedConsultation.scheduleConsultant.consultantSpecialty.consultant.name,
          updatedConsultation.customer.name,
          updatedConsultation.scheduleConsultant.consultantSpecialty.specialty
            .name_specialty,
        );
      }

      return updatedConsultation;
    }

    return consultation;
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
