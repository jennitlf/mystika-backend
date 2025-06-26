// src/features/consultation/consultation.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Query,
  UseGuards,
  Request,
  Param,
  Patch,
} from '@nestjs/common';
import { ConsultationService } from './consultation.service';
import { CreateConsultationDto } from 'src/shared/dtos/create-consultation.dto';
import { UpdateConsultationDto } from 'src/shared/dtos/update-consultation.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { createRoleGuard } from 'src/auth/factories/role-guard.factory';
import { OwnershipOrAdminGuard } from 'src/auth/guards/ownership-or-admin.guard';
import { PaginationQueryDto } from 'src/shared/dtos/pagination-query.dto';

@ApiBearerAuth()
@Controller('consultation/:timeZone')
export class ConsultationController {
  constructor(private readonly consultationService: ConsultationService) {}

  @UseGuards(createRoleGuard(['user']))
  @Post()
  create(
    @Param('timeZone') timeZone: string,
    @Request() req,
    @Body() createConsultationDto: CreateConsultationDto,
  ) {
    const dataUser = req.user.id;
    return this.consultationService.create(
      decodeURIComponent(timeZone),
      dataUser,
      createConsultationDto,
    );
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
    name: 'appoinment_date_time',
    required: false,
    type: String,
    example: '00:00:00',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  findAll(
    @Param('timeZone') timeZone: string,
    @Query('idCustomer') idCustomer?: number,
    @Query('idConsultantSpecialty') idConsultantSpecialty?: number,
    @Query('appoinment_date_time') appoinment_date_time?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.consultationService.findAll(
      decodeURIComponent(timeZone),
      { idCustomer, idConsultantSpecialty, appoinment_date_time },
      page,
      limit,
    );
  }

  @UseGuards(
    createRoleGuard(['adm', 'user', 'consultant']),
    OwnershipOrAdminGuard,
  )
  @Get('byUserId')
  async findOne(@Param('timeZone') timeZone: string, @Request() req) {
    const dataUser = req.user.id;
    const result = await this.consultationService.findOne(
      decodeURIComponent(timeZone),
      dataUser,
    );
    return result;
  }

  @UseGuards(createRoleGuard(['consultant']))
  @Get('byConsultorId')
  async findByConsultorId(@Param('timeZone') timeZone: string, @Request() req) {
    const dataUser = req.user.id;
    const result = await this.consultationService.findOneByIdConsultant(
      decodeURIComponent(timeZone),
      dataUser,
    );
    return result;
  }

  @UseGuards(createRoleGuard(['consultant']))
  @Patch('consultor/:id')
  updateByConsultant(
    @Param('id') id: string,
    @Param('timeZone') timeZone: string,
    @Body() updateConsultationDto: UpdateConsultationDto,
    @Request() req,
  ) {
    return this.consultationService.updateStatusByConsultant(
      id,
      timeZone,
      updateConsultationDto,
      req.user.id,
    );
  }

  @UseGuards(createRoleGuard(['user']), OwnershipOrAdminGuard)
  @Patch('customer/cancel/:id')
  cancelByCustomer(
    @Param('id') id: string,
    @Param('timeZone') timeZone: string,
    @Request() req,
  ) {
    return this.consultationService.cancelConsultationByCustomer(
      id,
      decodeURIComponent(timeZone),
      req.user.id,
    );
  }

  @UseGuards(createRoleGuard(['user']))
  @Get('byUserId/paginated')
  async getConsultationsByUserIdPaginated(
    @Param('timeZone') timeZone: string,
    @Request() req,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const userId = req.user.id;
    const { page, limit } = paginationQuery;

    const { data, total } =
      await this.consultationService.findConsultationsByUserIdPaginated(
        decodeURIComponent(timeZone),
        userId,
        page,
        limit,
      );
    return {
      data: data,
      totalCount: total,
      currentPage: page,
      limit: limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  @UseGuards(createRoleGuard(['adm']))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultationService.remove(id);
  }
}
