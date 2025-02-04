import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateCostumerDto } from 'src/shared/dtos/create-costumer.dto';
import { UpdateCostumerDto } from 'src/shared/dtos/update-costumer.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';


@ApiTags('Costumer')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createCostumerDto: CreateCostumerDto) {
    return this.userService.create(createCostumerDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(id);
  // }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateCostumerDto: UpdateCostumerDto) {
    return this.userService.update(+id, updateCostumerDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
