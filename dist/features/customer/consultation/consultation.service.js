"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const consultation_entity_1 = require("../../../shared/entities/consultation.entity");
const typeorm_2 = require("typeorm");
let ConsultationService = class ConsultationService {
    constructor(consultationRepository) {
        this.consultationRepository = consultationRepository;
    }
    async create(dataUser, createConsultationDto) {
        const { id_schedule_consultant, appoinment_date, appoinment_time } = createConsultationDto;
        const appoinmentVerification = await this.consultationRepository
            .createQueryBuilder('consultation')
            .andWhere('consultation.id_customer = :id_customer', {
            id_customer: dataUser,
        })
            .andWhere('consultation.id_schedule_consultant = :id_schedule_consultant', { id_schedule_consultant })
            .andWhere('consultation.appoinment_date = :appoinment_date', {
            appoinment_date,
        })
            .andWhere('consultation.appoinment_time = :appoinment_time', {
            appoinment_time,
        })
            .getOne();
        if (appoinmentVerification) {
            throw new common_1.HttpException('appointment already scheduled!', common_1.HttpStatus.CONFLICT);
        }
        const consultation = this.consultationRepository.create({
            id_customer: dataUser,
            ...createConsultationDto,
        });
        return this.consultationRepository.save(consultation);
    }
    async findAll(filters, page = 1, limit = 10) {
        const { idCustomer, idConsultantSpecialty, appoinmentDate, appoinmentTime, } = filters;
        const skip = (page - 1) * limit;
        const query = this.consultationRepository
            .createQueryBuilder('consultation')
            .innerJoinAndSelect('consultation.customer', 'customer')
            .innerJoinAndSelect('consultation.scheduleConsultant', 'scheduleConsultant')
            .innerJoinAndSelect('scheduleConsultant.consultantSpecialty', 'consultantSpecialty')
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
        if (idCustomer)
            query.andWhere('customer.id = :idCustomer', { idCustomer });
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
                        name_specialty: consultation.scheduleConsultant.consultantSpecialty.specialty
                            .name_specialty,
                    },
                    value_per_duration: consultation.scheduleConsultant.consultantSpecialty
                        .value_per_duration,
                    duration: consultation.scheduleConsultant.consultantSpecialty.duration,
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
    async findOne(dataUser) {
        const query = this.consultationRepository
            .createQueryBuilder('consultation')
            .innerJoinAndSelect('consultation.customer', 'customer')
            .innerJoinAndSelect('consultation.scheduleConsultant', 'scheduleConsultant')
            .innerJoinAndSelect('scheduleConsultant.consultantSpecialty', 'consultantSpecialty')
            .innerJoinAndSelect('consultantSpecialty.consultant', 'consultant')
            .innerJoinAndSelect('consultantSpecialty.specialty', 'specialty')
            .select([
            'consultation.id',
            'consultation.id_customer',
            'consultation.id_schedule_consultant',
            'consultation.appoinment_date',
            'consultation.appoinment_time',
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
            throw new common_1.NotFoundException(`Consultations for user ID: ${dataUser} not found`);
        }
        const formattedData = consultations.map((consultation) => ({
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
                        id: consultation.scheduleConsultant.consultantSpecialty.consultant.id,
                        name: consultation.scheduleConsultant.consultantSpecialty.consultant.name,
                    },
                    specialty: {
                        id: consultation.scheduleConsultant.consultantSpecialty.specialty.id,
                        name_specialty: consultation.scheduleConsultant.consultantSpecialty.specialty.name_specialty,
                    },
                    value_per_duration: consultation.scheduleConsultant.consultantSpecialty.value_per_duration,
                    duration: consultation.scheduleConsultant.consultantSpecialty.duration,
                },
            },
            appoinment_date: consultation.appoinment_date,
            appoinment_time: consultation.appoinment_time,
            status: consultation.status,
            attended: consultation.attended,
            created_at: consultation.created_at,
            updated_at: consultation.updated_at,
        }));
        return { data: formattedData };
    }
    async update(id, updateConsultationDto) {
        const consultation = await this.consultationRepository.preload({
            ...updateConsultationDto,
            id: +id,
        });
        if (!consultation) {
            throw new common_1.NotFoundException(`Consultation ID: ${id} not found`);
        }
        return this.consultationRepository.save(consultation);
    }
    async remove(id) {
        const consultation = await this.consultationRepository.findOne({
            where: { id: +id },
        });
        if (!consultation) {
            throw new common_1.NotFoundException(`Consultant ID: ${id} not found`);
        }
        return this.consultationRepository.remove(consultation);
    }
};
exports.ConsultationService = ConsultationService;
exports.ConsultationService = ConsultationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(consultation_entity_1.Consultation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ConsultationService);
//# sourceMappingURL=consultation.service.js.map