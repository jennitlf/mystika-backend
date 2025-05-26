import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConsultantSupportService } from './cosultant-support.service';
// import { CreateCosultantSupportDto } from './dto/create-cosultant-support.dto';
// import { UpdateCosultantSupportDto } from './dto/update-cosultant-support.dto';

@Controller('cosultant-support')
export class ConsultantSupportController {
  constructor(
    private readonly consultantSupportService: ConsultantSupportService,
  ) {}

  @Post()
  create(@Body() createCosultantSupportDto: any) {
    return this.consultantSupportService.create(createCosultantSupportDto);
  }

  @Get()
  findAll() {
    return this.consultantSupportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.consultantSupportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCosultantSupportDto: any) {
    return this.consultantSupportService.update(+id, updateCosultantSupportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.consultantSupportService.remove(+id);
  }
}
