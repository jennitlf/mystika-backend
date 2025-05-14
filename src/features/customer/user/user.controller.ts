import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateCustomerDto } from 'src/shared/dtos/create-customer.dto';
import { UpdateCostumerDto } from 'src/shared/dtos/update-customer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
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
  @UseGuards(JwtAuthGuard, createRoleGuard(['administrador', 'user']))
  findAll() {
    return this.userService.findAll();
  }

  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Get('id/:id')
  @UseGuards(
    JwtAuthGuard,
    createRoleGuard(['administrador', 'user']),
    OwnershipGuard,
  )
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @UseGuards(
    JwtAuthGuard,
    createRoleGuard(['administrador', 'user']),
    OwnershipGuard,
  )
  update(
    @Param('id') id: string,
    @Body() updateCostumerDto: UpdateCostumerDto,
  ) {
    return this.userService.update(+id, updateCostumerDto);
  }

  @Delete(':id')
  @UseGuards(
    JwtAuthGuard,
    createRoleGuard(['administrador', 'user']),
    OwnershipGuard,
  )
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
