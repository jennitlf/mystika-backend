import { Controller, Get, Query } from '@nestjs/common';
import { GeneralFindService } from './general-find.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('consult general data from consultants')
@Controller('general-find')
export class GeneralFindController {
  constructor(private readonly generalFindService: GeneralFindService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 9 })
  @ApiQuery({ name: 'name', required: false, type: String, example: 'John' })
  @ApiQuery({
    name: 'specialties',
    required: false,
    type: [String],
    example: ['mapa astral', 'tarot das fadas'],
  })
  @ApiQuery({ name: 'minValue', required: false, type: Number, example: 50 })
  @ApiQuery({ name: 'maxValue', required: false, type: Number, example: 200 })
  generalConsultantData(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 9,
    @Query('name') name?: string,
    @Query('specialties') specialties?: string[],
    @Query('minValue') minValue?: number,
    @Query('maxValue') maxValue?: number,
  ) {
    return this.generalFindService.generalConsultantData(
      page,
      limit,
      name,
      specialties,
      minValue,
      maxValue,
    );
  }
}
