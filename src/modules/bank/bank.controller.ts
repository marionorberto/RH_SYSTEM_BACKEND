// backend/src/modules/bank/bank.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankDto } from './dtos/create-bank.dto';
import { UpdateBankDto } from './dtos/update-bank.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';

@Controller('banks')
@UseGuards(AuthGuard)
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Get()
  async findAll() {
    return await this.bankService.findAll();
  }

  @Get('paginated')
  async findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return await this.bankService.findAllPaginated(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.bankService.findOne(id);
  }

  @Post()
  async create(@Body() createBankDto: CreateBankDto) {
    return await this.bankService.create(createBankDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBankDto: UpdateBankDto) {
    return await this.bankService.update(id, updateBankDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.bankService.delete(id);
  }
}
