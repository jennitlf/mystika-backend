import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ScheduleExceptionService } from './schedule-exception.service';
import CreateScheduleExceptionDto from 'src/shared/dtos/create-schedule-exception.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { createRoleGuard } from 'src/auth/factories/role-guard.factory';

@ApiBearerAuth()
@Controller('schedule-exception')
export class ScheduleExceptionController {
  constructor(
    private readonly scheduleExceptionService: ScheduleExceptionService,
  ) {}

  @UseGuards(createRoleGuard(['consultant']))
  @Post('/:timeZone')
  create(
    @Param('timeZone') timeZone: string,
    @Body() createScheduleExceptionDto: CreateScheduleExceptionDto
  ) {
    return this.scheduleExceptionService.create( decodeURIComponent(timeZone), createScheduleExceptionDto);
  }

  @Get()
  @ApiQuery({
    name: 'id schedule consultant',
    required: false,
    type: Number,
    example: '1',
  })
  findAll(@Query('id schedule consultant') idScheduleConsultant?: number) {
    return this.scheduleExceptionService.findAll({ idScheduleConsultant });
  }

  @UseGuards(createRoleGuard(['consultant']))
  @Delete()
  remove(@Body() id: string) {
    return this.scheduleExceptionService.remove(+id);
  }
}
