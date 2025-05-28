import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ConsultantSupportService } from './cosultant-support.service';
import { CreateConsultantSupportDto } from 'src/shared/dtos/create-consultant-support.dto';
import { UpdateConsultantSupportDto } from 'src/shared/dtos/update-consultant-support.dto'; 
import { createRoleGuard } from 'src/auth/factories/role-guard.factory';
import { ValidateUserGuard } from 'src/auth/guards/validate-user.guard';
import { OwnershipOrAdminGuard } from 'src/auth/guards/ownership-or-admin.guard';
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
  findAll() {
    return this.consultantSupportService.findAll();
  }

  @UseGuards(createRoleGuard(['consultant', 'adm']))
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
  @Put('record/:id')
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
