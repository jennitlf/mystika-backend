import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CosultantSupportService } from './cosultant-support.service';
// import { CreateCosultantSupportDto } from './dto/create-cosultant-support.dto';
// import { UpdateCosultantSupportDto } from './dto/update-cosultant-support.dto';

@Controller('cosultant-support')
export class CosultantSupportController {
  constructor(
    private readonly cosultantSupportService: CosultantSupportService,
  ) {}

  @Post()
  create(@Body() createCosultantSupportDto: any) {
    return this.cosultantSupportService.create(createCosultantSupportDto);
  }

  @Get()
  findAll() {
    return this.cosultantSupportService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cosultantSupportService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCosultantSupportDto: any) {
    return this.cosultantSupportService.update(+id, updateCosultantSupportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cosultantSupportService.remove(+id);
  }
}
