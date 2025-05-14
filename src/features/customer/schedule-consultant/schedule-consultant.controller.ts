import { Controller, Get, Post, Body, Put, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ScheduleConsultantService } from './schedule-consultant.service';
import { CreateScheduleConsultantDto } from 'src/shared/dtos/create-schedule-consultant.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateScheduleRecurringDto } from 'src/shared/dtos/create-schedule-recurring.dto';

@ApiBearerAuth()
@Controller('schedule-consultant')
export class ScheduleConsultantController {
  constructor(private readonly scheduleConsultantService: ScheduleConsultantService) {}

    @Get(':idConsultantSpecialty/timeslots')
    @ApiQuery({ name: 'date', required: false, type: String, example: '2025-01-01' })
    async getTimeslots(
        @Param('idConsultantSpecialty') idConsultantSpecialty: number,
        @Query('date') date?: string,
    ) {
        return await this.scheduleConsultantService.getTimeslots(idConsultantSpecialty, date);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create (@Body() createScheduleConsultantDto: CreateScheduleConsultantDto){
        return this.scheduleConsultantService.create(createScheduleConsultantDto)
    }
    @Post('recurring')
    @UseGuards(JwtAuthGuard)
    async createRecurring(@Body() createRecurringScheduleDto: CreateScheduleRecurringDto) {
    return this.scheduleConsultantService.createRecurring(createRecurringScheduleDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    remove (@Param('id') id: string) {
        return this.scheduleConsultantService.remove(id)
    }

}
