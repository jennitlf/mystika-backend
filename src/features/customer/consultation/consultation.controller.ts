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
import { ConsultationService } from './consultation.service';
import { CreateConsultationDto } from 'src/shared/dtos/create-consultation.dto';
import { UpdateConsultationDto } from 'src/shared/dtos/update-consultation.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('consultation')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @Post()
  create(@Body() createConsultationDto: CreateConsultationDto) {
    return this.consultationService.create(createConsultationDto);
  }

  @Get()
  @ApiQuery({ name: 'idCustomer', required: false, type: Number, example: 1 })
  @ApiQuery({
    name: 'idConsultantSpecialty',
    required: false,
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'appoinmentDate',
    required: false,
    type: String,
    example: 'AAAA-MM-DD',
  })
  @ApiQuery({
    name: 'appoinmentTime',
    required: false,
    type: String,
    example: '00:00:00',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  findAll(
    @Query('idCustomer') idCustomer?: number,
    @Query('idConsultantSpecialty') idConsultantSpecialty?: number,
    @Query('appoinmentDate') appoinmentDate?: string,
    @Query('appoinmentTime') appoinmentTime?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.consultationService.findAll(
      { idCustomer, idConsultantSpecialty, appoinmentDate, appoinmentTime },
      page,
      limit,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultationService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConsultationDto: UpdateConsultationDto,
  ) {
    return this.consultationService.update(id, updateConsultationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultationService.remove(id);
  }
}
