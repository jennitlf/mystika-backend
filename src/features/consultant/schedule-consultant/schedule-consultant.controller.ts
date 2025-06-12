import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ScheduleConsultantService } from './schedule-consultant.service';
import { CreateScheduleConsultantDto } from 'src/shared/dtos/create-schedule-consultant.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateScheduleRecurringDto } from 'src/shared/dtos/create-schedule-recurring.dto';
import { createRoleGuard } from 'src/auth/factories/role-guard.factory';
import { OwnershipScheduleConsultant } from 'src/auth/guards/ownership-schedule-consultant.guard';

@ApiBearerAuth()
@Controller('schedule-consultant')
export class ScheduleConsultantController {
  constructor(
    private readonly scheduleConsultantService: ScheduleConsultantService,
  ) {}

  @Get(':idConsultantSpecialty/timeslots')
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    example: '2025-01-01',
  })
  async getTimeslots(
    @Param('idConsultantSpecialty') idConsultantSpecialty: number,
    @Query('date') date?: string,
  ) {
    return await this.scheduleConsultantService.getTimeslots(
      idConsultantSpecialty,
      date,
    );
  }

  @UseGuards(createRoleGuard(['adm', 'consultant']), OwnershipScheduleConsultant)
  @Post()
  create(@Body() createScheduleConsultantDto: CreateScheduleConsultantDto) {
    return this.scheduleConsultantService.create(createScheduleConsultantDto);
  }
  @Post('recurring')
  @UseGuards(createRoleGuard(['adm', 'consultant']), OwnershipScheduleConsultant)
  async createRecurring(
    @Body() createRecurringScheduleDto: CreateScheduleRecurringDto,
  ) {
    console.log('passei pelos guards')
    return this.scheduleConsultantService.createRecurring(
      createRecurringScheduleDto,
    );
  }

  @UseGuards(createRoleGuard(['adm', 'consultant']), OwnershipScheduleConsultant)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleConsultantService.remove(id);
  }
}
