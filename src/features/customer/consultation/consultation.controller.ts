import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  UseGuards,
  Put,
  Request,
} from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { CreateConsultationDto } from 'src/shared/dtos/create-consultation.dto';
import { UpdateConsultationDto } from 'src/shared/dtos/update-consultation.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { createRoleGuard } from 'src/auth/factories/role-guard.factory';
import { OwnershipOrAdminGuard } from 'src/auth/guards/ownership-or-admin.guard';

@ApiBearerAuth()
@Controller('consultation')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @UseGuards(createRoleGuard(['user']))
  @Post()
  create(@Request() req, @Body() createConsultationDto: CreateConsultationDto) {
    const dataUser = req.user.id;
    return this.consultationService.create(dataUser, createConsultationDto);
  }

  @UseGuards(createRoleGuard(['adm']))
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

  @UseGuards(
    createRoleGuard(['adm', 'user', 'consultant']),
    OwnershipOrAdminGuard,
  )
  @Get('byUserId')
  async findOne(@Request() req) {
    const dataUser = req.user.id;
    const result = await this.consultationService.findOne(dataUser)
    return result;
  }

  @UseGuards(
    createRoleGuard(['adm', 'user', 'consultant']),
    OwnershipOrAdminGuard,
  )
  @Put(':id')
  update(@Request() req, @Body() updateConsultationDto: UpdateConsultationDto) {
    const dataUser = req.user.id;
    return this.consultationService.update(dataUser, updateConsultationDto);
  }
  @UseGuards(createRoleGuard(['adm']))
  @Delete(':id')
  remove(@Request() req) {
    const dataUser = req.user.id;
    return this.consultationService.remove(dataUser);
  }
}
