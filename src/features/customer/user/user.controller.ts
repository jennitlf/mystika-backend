import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from 'src/shared/dtos/create-customer.dto';
import { UpdateCostumerDto } from 'src/shared/dtos/update-customer.dto';
import { OwnershipGuard } from 'src/auth/guards/ownership.guard';
import { createRoleGuard } from 'src/auth/factories/role-guard.factory';

@ApiTags('Customer')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createCostumerDto: CreateCustomerDto) {
    return this.userService.create(createCostumerDto);
  }

  @Get()
  @UseGuards(createRoleGuard(['adm', 'user']))
  findAll() {
    return this.userService.findAll();
  }

  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get('id/:id')
  @UseGuards(createRoleGuard(['adm', 'user']), OwnershipGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(createRoleGuard(['adm', 'user']), OwnershipGuard)
  update(
    @Param('id') id: string,
    @Body() updateCostumerDto: UpdateCostumerDto,
  ) {
    return this.userService.update(+id, updateCostumerDto);
  }

  @Delete(':id')
  @UseGuards(createRoleGuard(['adm', 'user']), OwnershipGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
