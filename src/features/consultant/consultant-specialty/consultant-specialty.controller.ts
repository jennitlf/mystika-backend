import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Put,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ConsultantSpecialtyService } from './consultant-specialty.service';
import { CreateConsultantSpecialtyDto } from 'src/shared/dtos/create-consultant-specialty.dto';
import { UpdateConsultantSpecialtyDto } from 'src/shared/dtos/update-consultant-specialty.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('consultant data in each specialty')
@Controller('consultant-specialty')
export class ConsultantSpecialtyController {
  constructor(
    private readonly consultantSpecialtyService: ConsultantSpecialtyService,
  ) {}

  @Post()
  create(@Body() createConsultantSpecialtyDto: CreateConsultantSpecialtyDto) {
    return this.consultantSpecialtyService.create(createConsultantSpecialtyDto);
  }

  @Get()
  @ApiQuery({
    name: 'consultantName',
    required: false,
    type: String,
    example: 'John',
  })
  @ApiQuery({
    name: 'idConsultant',
    required: false,
    type: Number,
    example: '1',
  })
  @ApiQuery({
    name: 'specialty',
    required: false,
    type: String,
    example: 'Tarot',
  })
  @ApiQuery({ name: 'minPrice', required: false, type: Number, example: 50 })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number, example: 200 })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  findAll(
    @Query('consultantName') consultantName?: string,
    @Query('idConsultant') idConsultant?: number,
    @Query('specialty') specialty?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.consultantSpecialtyService.findConsultantsByFilters(
      { consultantName, idConsultant, specialty, minPrice, maxPrice },
      page,
      limit,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultantSpecialtyService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateConsultantSpecialtyDto: UpdateConsultantSpecialtyDto,
  ) {
    return this.consultantSpecialtyService.update(
      id,
      updateConsultantSpecialtyDto,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultantSpecialtyService.remove(id);
  }
}
