// backend/src/modules/company-data/company-data.controller.ts
import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { CompanyDataService } from './company-data.service';
import { CreateCompanyDataDto } from './dtos/create-company-data.dto';
import { UpdateCompanyDataDto } from './dtos/update-company-data.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';

@Controller('company-data')
@UseGuards(AuthGuard)
export class CompanyDataController {
  constructor(private readonly companyDataService: CompanyDataService) {}

  @Get()
  async findOne() {
    return await this.companyDataService.findOne();
  }

  @Post()
  async create(@Body() createCompanyDataDto: CreateCompanyDataDto) {
    return await this.companyDataService.create(createCompanyDataDto);
  }

  @Put()
  async update(@Body() updateCompanyDataDto: UpdateCompanyDataDto) {
    return await this.companyDataService.update(updateCompanyDataDto);
  }
}
