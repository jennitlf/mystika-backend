import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ScheduleExceptionService } from './schedule-exception.service';
import CreateScheduleExceptionDto from 'src/shared/dtos/create-schedule-exception.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@Controller('schedule-exception')
export class ScheduleExceptionController {
  constructor(
    private readonly scheduleExceptionService: ScheduleExceptionService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createScheduleExceptionDto: CreateScheduleExceptionDto) {
    return this.scheduleExceptionService.create(createScheduleExceptionDto);
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleExceptionService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateScheduleExceptionDto: any) {
    return this.scheduleExceptionService.update(
      +id,
      updateScheduleExceptionDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.scheduleExceptionService.remove(+id);
  }
}
