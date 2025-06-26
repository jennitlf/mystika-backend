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
  UseInterceptors,
} from '@nestjs/common';
import { ScheduleConsultantService } from './schedule-consultant.service';
import { CreateScheduleConsultantDto } from 'src/shared/dtos/create-schedule-consultant.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { CreateScheduleRecurringDto } from 'src/shared/dtos/create-schedule-recurring.dto';
import { createRoleGuard } from 'src/auth/factories/role-guard.factory';
import { OwnershipScheduleConsultant } from 'src/auth/guards/ownership-schedule-consultant.guard';
import { NoCacheInterceptor } from 'src/middlewares/no-cache.interceptor';

@ApiBearerAuth()
@Controller('schedule-consultant')
export class ScheduleConsultantController {
  constructor(
    private readonly scheduleConsultantService: ScheduleConsultantService,
  ) {}

  @Get(':idConsultantSpecialty/timeslots/:timeZone')
  @UseInterceptors(NoCacheInterceptor)
  @ApiQuery({
    name: 'date',
    required: false,
    type: String,
    example: '2025-01-01',
  })
  async getTimeslots(
    @Param('idConsultantSpecialty') idConsultantSpecialty: number,
    @Param('timeZone') timeZone: string,
    @Query('date') date?: string,
  ) {
    return await this.scheduleConsultantService.getTimeslots(
      idConsultantSpecialty,
      decodeURIComponent(timeZone),
      date,
    );
  }

  @Post('recurring/:timeZone')
  @UseGuards(createRoleGuard(['adm', 'consultant']), OwnershipScheduleConsultant)
  async createRecurring(
    @Param('timeZone') timeZone: string,
    @Body() createRecurringScheduleDto: CreateScheduleRecurringDto,
  ) {
    return this.scheduleConsultantService.createRecurring(
      createRecurringScheduleDto,
      decodeURIComponent(timeZone)
    );
  }

  @UseGuards(createRoleGuard(['adm', 'consultant']), OwnershipScheduleConsultant)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleConsultantService.remove(id);
  }
}
