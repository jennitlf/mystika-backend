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
import { CustomerSupportService } from './customer-support.service';
import { CreateCustomerSupportDto } from '../../../shared/dtos/create-customer-support.dto';
import { UpdateCustomerSupportDto } from '../../../shared/dtos/update-customer-support.dto';
import { createRoleGuard } from 'src/auth/factories/role-guard.factory';
import { ValidateUserGuard } from 'src/auth/guards/validate-user.guard';
import { OwnershipOrAdminGuard } from 'src/auth/guards/ownership-or-admin.guard';

@Controller('customer-support')
export class CustomerSupportController {
  constructor(
    private readonly customerSupportService: CustomerSupportService,
  ) {}

  @UseGuards(createRoleGuard(['user']), ValidateUserGuard)
  @Post()
  create(
    @Request() req,
    @Body() createCustomerSupportDto: CreateCustomerSupportDto,
  ) {
    const dataUser = req.user;
    return this.customerSupportService.create(
      dataUser,
      createCustomerSupportDto,
    );
  }

  @UseGuards(createRoleGuard(['adm']))
  @Get()
  findAll() {
    return this.customerSupportService.findAll();
  }

  @UseGuards(createRoleGuard(['user']), ValidateUserGuard)
  @Get('byUser')
  findAllByUser(@Request() req) {
    const userId = req.user.id;
    return this.customerSupportService.findAllByUserId(userId);
  }

  @UseGuards(createRoleGuard(['adm', 'user']), OwnershipOrAdminGuard)
  @Get('record/:id')
  findOne(@Param('id') id: string) {
    return this.customerSupportService.findOne(+id);
  }

  @UseGuards(createRoleGuard(['adm', 'user']), OwnershipOrAdminGuard)
  @Put('record/:id')
  update(
    @Param('id') id: string,
    @Body() updateCustomerSupportDto: UpdateCustomerSupportDto,
  ) {
    console.log(id, updateCustomerSupportDto);
    return this.customerSupportService.update(+id, updateCustomerSupportDto);
  }

  @UseGuards(createRoleGuard(['adm', 'user']), OwnershipOrAdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerSupportService.remove(+id);
  }
}
