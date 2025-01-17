import { Controller, Get, Post, Body, Param, Delete, Query, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { SpecialtyService } from './specialty.service';
import { CreateSpecialtyDto } from 'src/shared/dtos/create-specialty.dto';
import { UpdateSpecialtyDto } from 'src/shared/dtos/update-specialty.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';


@ApiTags('specialty')
@Controller('specialty')
export class SpecialtyController {
  constructor(private readonly specialtyService: SpecialtyService) {}

  @Post()
  create(@Body() createSpecialtyDto: CreateSpecialtyDto) {
    return this.specialtyService.create(createSpecialtyDto);
  }

  @Get()
  findAll() {
    return this.specialtyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.specialtyService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSpecialtyDto: UpdateSpecialtyDto) {
    return this.specialtyService.update(id, updateSpecialtyDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.specialtyService.remove(id);
  }
}
