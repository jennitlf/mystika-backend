import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  Patch,
} from '@nestjs/common';
import { ConsultantSupportService } from './cosultant-support.service';
import { CreateConsultantSupportDto } from 'src/shared/dtos/create-consultant-support.dto';
import { UpdateConsultantSupportDto } from 'src/shared/dtos/update-consultant-support.dto'; 
import { createRoleGuard } from 'src/auth/factories/role-guard.factory';
import { OwnershipConsultantOrAdminGuard } from 'src/auth/guards/ownership-consultant-or-admin.guard';

@Controller('consultant-support')
export class ConsultantSupportController {
  constructor(
    private readonly consultantSupportService: ConsultantSupportService,
  ) {}

  @UseGuards(createRoleGuard(['consultant']))
  @Post()
  create(
    @Request() req,
    @Body() createConsultantSupportDto: CreateConsultantSupportDto,
  ) {
    const UserId = req.user.id;
    return this.consultantSupportService.create(
      UserId,
      createConsultantSupportDto,
    );
  }

  @UseGuards(createRoleGuard(['adm']))
  @Get()
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name?: string,
    @Query('email') email?: string,
    @Query('phone') phone?: string,
    @Query('title') title?: string,
    @Query('content') content?: string,
    @Query('status') status?: string,
  ) {
    return this.consultantSupportService.findAll(
      page,
      limit,
      name,
      email,
      phone,
      title,
      content,
      status,
    );
  }

  @UseGuards(createRoleGuard(['consultant']))
  @Get('byUser')
  findAllByUser(@Request() req) {
    const userId = req.user.id;
    return this.consultantSupportService.findAllByUserId(userId);
  }

  @UseGuards(createRoleGuard(['adm', 'consultant']), OwnershipConsultantOrAdminGuard)
  @Get('record/:id')
  findOne(@Param('id') id: string) {
    return this.consultantSupportService.findOne(+id);
  }

  @UseGuards(createRoleGuard(['adm', 'consultant']), OwnershipConsultantOrAdminGuard)
  @Patch('record/:id')
  update(
    @Param('id') id: string,
    @Body() updateConsultantSupportDto: UpdateConsultantSupportDto,
  ) {
    return this.consultantSupportService.update(+id, updateConsultantSupportDto);
  }

  @UseGuards(createRoleGuard(['adm', 'consultant']), OwnershipConsultantOrAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultantSupportService.remove(+id);
  }
}
