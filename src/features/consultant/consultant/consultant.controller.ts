import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ConsultantService } from './consultant.service';
import { CreateConsultantDto } from 'src/shared/dtos/create-consultant.dto';
import { UpdateConsultantDto } from 'src/shared/dtos/update-consultant.dto';
import { createRoleGuard } from 'src/auth/factories/role-guard.factory';
import { OwnershipGuard } from 'src/auth/guards/ownership.guard';

@ApiTags('consultants')
@Controller('consultant')
export class ConsultantController {
  constructor(private readonly consultantService: ConsultantService) {}

  @Post()
  create(@Body() createConsultantDto: CreateConsultantDto) {
    return this.consultantService.create(createConsultantDto);
  }

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.consultantService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultantService.findOne(id);
  }

  @UseGuards(createRoleGuard(['consultant', 'adm']), OwnershipGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConsultantDto: UpdateConsultantDto,
  ) {
    return this.consultantService.update(id, updateConsultantDto);
  }

@UseGuards(createRoleGuard(['adm']))
@HttpCode(HttpStatus.NO_CONTENT)
@Delete(':id')
remove(@Param('id') id: string) {
  return this.consultantService.remove(id);
}
}
