import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ScheduleConsultantService } from './schedule-consultant.service';
import { CreateScheduleConsultantDto } from '../shared/dtos/create-schedule-consultant.dto';
import { UpdateScheduleConsultantDto } from '../shared/dtos/update-schedule-consultant.dto';

@Controller('schedule-consultant')
export class ScheduleConsultantController {
  constructor(private readonly scheduleConsultantService: ScheduleConsultantService) {}

  @Post()
  create(@Body() createScheduleConsultantDto: CreateScheduleConsultantDto) {
    return this.scheduleConsultantService.create(createScheduleConsultantDto);
  }

  @Get()
  findAll() {
    return this.scheduleConsultantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleConsultantService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleConsultantDto: UpdateScheduleConsultantDto) {
    return this.scheduleConsultantService.update(+id, updateScheduleConsultantDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleConsultantService.remove(+id);
  }
}
