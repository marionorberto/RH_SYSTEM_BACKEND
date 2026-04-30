// backend/src/modules/fiscal-year/fiscal-year.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { FiscalYearService } from './fiscal-year.service';
import { CreateFiscalYearDto } from './dtos/create-fiscal-year.dto';
import { UpdateFiscalYearDto } from './dtos/update-fiscal-year.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';

@Controller('fiscal-years')
@UseGuards(AuthGuard)
export class FiscalYearController {
  constructor(private readonly fiscalYearService: FiscalYearService) {}

  @Get()
  async findAll() {
    return await this.fiscalYearService.findAll();
  }

  @Get('current')
  async findCurrent() {
    const currentYear = await this.fiscalYearService.findCurrentYear();
    return {
      statusCode: HttpStatus.OK,
      message: 'Ano fiscal atual recuperado.',
      data: currentYear,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.fiscalYearService.findOne(id);
  }

  @Post()
  async create(@Body() createFiscalYearDto: CreateFiscalYearDto) {
    return await this.fiscalYearService.create(createFiscalYearDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFiscalYearDto: UpdateFiscalYearDto,
  ) {
    return await this.fiscalYearService.update(id, updateFiscalYearDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.fiscalYearService.delete(id);
  }
}
