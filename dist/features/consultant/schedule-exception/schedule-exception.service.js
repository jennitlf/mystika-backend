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
exports.ScheduleExceptionService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const schedule_consultant_entity_1 = require("../../../shared/entities/schedule_consultant.entity");
const schedule_exception_entity_1 = require("../../../shared/entities/schedule_exception.entity");
const typeorm_2 = require("typeorm");
let ScheduleExceptionService = class ScheduleExceptionService {
    constructor(scheduleExceptionRepository, scheduleConsultantRepository) {
        this.scheduleExceptionRepository = scheduleExceptionRepository;
        this.scheduleConsultantRepository = scheduleConsultantRepository;
    }
    async create(createScheduleExceptionDto) {
        const scheduleConsultantValid = await this.scheduleConsultantRepository.findOne({
            where: { id: +createScheduleExceptionDto.id_schedule_consultant },
        });
        if (!scheduleConsultantValid) {
            throw new common_1.NotFoundException(`schedule consultant id: ${createScheduleExceptionDto.id_schedule_consultant} not found, enter a valid id`);
        }
        const schedule_exception = this.scheduleExceptionRepository.create(createScheduleExceptionDto);
        return this.scheduleExceptionRepository.save(schedule_exception);
    }
    async findAll(filters) {
        const { idScheduleConsultant } = filters;
        const query = this.scheduleExceptionRepository
            .createQueryBuilder('scheduleException')
            .innerJoinAndSelect('scheduleException.scheduleConsultant', 'scheduleConsultant');
        if (idScheduleConsultant)
            query.andWhere('scheduleConsultant.id = :idScheduleConsultant', {
                idScheduleConsultant,
            });
        return query.getMany();
    }
    findOne(id) {
        return `This action returns a #${id} scheduleException`;
    }
    update(id, updateScheduleExceptionDto) {
        return `This action updates a #${id} scheduleException`;
    }
    remove(id) {
        return `This action removes a #${id} scheduleException`;
    }
};
exports.ScheduleExceptionService = ScheduleExceptionService;
exports.ScheduleExceptionService = ScheduleExceptionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(schedule_exception_entity_1.ScheduleException)),
    __param(1, (0, typeorm_1.InjectRepository)(schedule_consultant_entity_1.ScheduleConsultant)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ScheduleExceptionService);
//# sourceMappingURL=schedule-exception.service.js.map