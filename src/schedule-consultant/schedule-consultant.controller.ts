import { Controller, Get, Post, Body, Put, Param, Delete, Query } from '@nestjs/common';
import { ScheduleConsultantService } from './schedule-consultant.service';
import { CreateScheduleConsultantDto } from 'src/shared/dtos/create-schedule-consultant.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('schedule-consultant')
export class ScheduleConsultantController {
  constructor(private readonly scheduleConsultantService: ScheduleConsultantService) {}

    @Get(':idConsultantSpecialty/timeslots')
    @ApiQuery({ name: 'date', required: false, type: String, example: '2025-01-01' })
    async getTimeslots(
        @Param('idConsultantSpecialty') idConsultantSpecialty: number,
        @Query('date') date?: string,
    ) {
        return await this.scheduleConsultantService.getTimeslots(
            idConsultantSpecialty,
            date, 
        );
    }

    @Post()
    create (@Body() createScheduleConsultantDto: CreateScheduleConsultantDto){
        return this.scheduleConsultantService.create(createScheduleConsultantDto)
    }

    @Delete(':id')
    remove (@Param('id') id: string) {
        return this.scheduleConsultantService.remove(id)
    }

}
