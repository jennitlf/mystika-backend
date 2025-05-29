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
exports.ScheduleConsultantService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const schedule_consultant_entity_1 = require("../../../shared/entities/schedule_consultant.entity");
const schedule_exception_entity_1 = require("../../../shared/entities/schedule_exception.entity");
const date_utils_1 = require("../../../shared/utils/date.utils");
const consultation_entity_1 = require("../../../shared/entities/consultation.entity");
let ScheduleConsultantService = class ScheduleConsultantService {
    constructor(scheduleConsultantRepository, scheduleExceptionRepository, consultationRepository, dateUtilsService) {
        this.scheduleConsultantRepository = scheduleConsultantRepository;
        this.scheduleExceptionRepository = scheduleExceptionRepository;
        this.consultationRepository = consultationRepository;
        this.dateUtilsService = dateUtilsService;
    }
    parseTime(time) {
        const [hours, minutes] = time.split(':').map(Number);
        const date = this.dateUtilsService.getZonedDate();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }
    formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    generateTimes(start, end, duration) {
        const times = [];
        let currentTime = this.parseTime(start);
        const endTime = this.parseTime(end);
        while (currentTime.getTime() + duration * 60000 <= endTime.getTime()) {
            times.push(this.formatTime(currentTime));
            currentTime.setMinutes(currentTime.getMinutes() + duration);
        }
        return times;
    }
    async getTimeslots(idConsultantSpecialty, date) {
        const scheduleDate = date
            ? this.dateUtilsService.getZonedDate(new Date(date + 'T00:00:00'))
            : null;
        const now = this.dateUtilsService.getZonedDate();
        now.setSeconds(0, 0);
        const schedules = await this.scheduleConsultantRepository.find({
            where: {
                id_consultant_specialty: idConsultantSpecialty,
                ...(scheduleDate && { date: scheduleDate }),
            },
            relations: ['scheduleException', 'consultantSpecialty'],
        });
        const validSchedules = schedules.filter((schedule) => {
            const schDt = this.dateUtilsService.getZonedDate(new Date(schedule.date + 'T00:00:00'));
            return schDt >= now || schDt.toDateString() === now.toDateString();
        });
        const timeslots = await Promise.all(validSchedules.map(async (schedule) => {
            const { hour_initial, hour_end, date, scheduleException, consultantSpecialty, id, } = schedule;
            if (!consultantSpecialty) {
                throw new Error('ConsultantSpecialty não encontrado');
            }
            const { duration } = consultantSpecialty;
            const allTimes = this.generateTimes(hour_initial, hour_end, duration);
            const relevantExceptions = scheduleException.filter((ex) => ex.date_exception.toISOString().split('T')[0] ===
                this.dateUtilsService
                    .getZonedDate(new Date(date + 'T00:00:00'))
                    .toISOString()
                    .split('T')[0]);
            const unavailableTimes = relevantExceptions.map((ex) => this.formatTime(this.parseTime(ex.unavailable_time)));
            const availableTimes = allTimes.filter((time) => !unavailableTimes.includes(time));
            const schDate = this.dateUtilsService.getZonedDate(new Date(date + 'T00:00:00'));
            const filteredTimes = schDate.toDateString() === now.toDateString()
                ? availableTimes.filter((time) => this.parseTime(time) > now)
                : availableTimes;
            const scheduleDateISO = schDate.toISOString().split('T')[0];
            const consultations = await this.consultationRepository.find({
                where: {
                    id_schedule_consultant: id,
                    appoinment_date: (0, typeorm_1.Raw)((alias) => `DATE(${alias}) = '${scheduleDateISO}'`),
                },
            });
            const bookedTimes = consultations.map((consultation) => consultation.appoinment_time.slice(0, 5));
            const availableTimesAfterBooking = filteredTimes.filter((time) => !bookedTimes.includes(time));
            return {
                schedule_id: id,
                date,
                available_times: availableTimesAfterBooking,
            };
        }));
        return timeslots;
    }
    async createRecurring(createRecurringScheduleDto) {
        const { id_consultant_specialty, start_date, end_date, days_of_week, hour_initial, hour_end, status, } = createRecurringScheduleDto;
        const startDate = this.dateUtilsService.getZonedDate(new Date(start_date));
        const endDate = this.dateUtilsService.getZonedDate(new Date(end_date));
        const diffInMs = endDate.getTime() - startDate.getTime();
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        if (diffInDays > 90) {
            throw new common_1.HttpException('O intervalo máximo permitido é de 3 meses (aproximadamente 90 dias).', common_1.HttpStatus.BAD_REQUEST);
        }
        const schedules = [];
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
            if (days_of_week.includes(date.getDay())) {
                const scheduleDate = this.dateUtilsService.getZonedDate(new Date(date.toISOString().split('T')[0] + 'T00:00:00'));
                const scheduleExists = await this.scheduleConsultantRepository.findOne({
                    where: {
                        id_consultant_specialty,
                        date: scheduleDate,
                        hour_initial,
                        hour_end,
                    },
                });
                if (!scheduleExists) {
                    schedules.push(this.scheduleConsultantRepository.create({
                        id_consultant_specialty,
                        date: date.toISOString().split('T')[0],
                        hour_initial,
                        hour_end,
                        status,
                    }));
                }
            }
        }
        if (schedules.length > 0) {
            return this.scheduleConsultantRepository.save(schedules);
        }
        throw new common_1.HttpException('No new schedules were created; all dates already exist.', common_1.HttpStatus.CONFLICT);
    }
    async create(createScheduleConsultant) {
        const { id_consultant_specialty, date, hour_initial, hour_end } = createScheduleConsultant;
        const verification = await this.scheduleConsultantRepository
            .createQueryBuilder('schedule')
            .where('schedule.id_consultant_specialty = :id_consultant_specialty', {
            id_consultant_specialty,
        })
            .andWhere('schedule.date = :date', { date })
            .andWhere(new typeorm_1.Brackets((qb) => {
            qb.where('schedule.hour_initial = :hour_initial', {
                hour_initial,
            }).orWhere('schedule.hour_end = :hour_end', { hour_end });
        }))
            .getOne();
        if (verification) {
            throw new common_1.HttpException('Service already registered, enter a different day or time', common_1.HttpStatus.CONFLICT);
        }
        const schedule_consultant = this.scheduleConsultantRepository.create(createScheduleConsultant);
        return this.scheduleConsultantRepository.save(schedule_consultant);
    }
    async remove(id) {
        const schedule_consultant = await this.scheduleConsultantRepository.findOne({
            where: { id: +id },
        });
        if (!schedule_consultant) {
            throw new common_1.NotFoundException(`schedule consultant id: ${id} not found`);
        }
        return this.scheduleConsultantRepository.remove(schedule_consultant);
    }
};
exports.ScheduleConsultantService = ScheduleConsultantService;
exports.ScheduleConsultantService = ScheduleConsultantService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(schedule_consultant_entity_1.ScheduleConsultant)),
    __param(1, (0, typeorm_2.InjectRepository)(schedule_exception_entity_1.ScheduleException)),
    __param(2, (0, typeorm_2.InjectRepository)(consultation_entity_1.Consultation)),
    __metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        date_utils_1.DateUtilsService])
], ScheduleConsultantService);
//# sourceMappingURL=schedule-consultant.service.js.map