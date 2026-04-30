// backend/src/modules/function/function.controller.ts
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
import { FunctionService } from './function.service';
import { CreateFunctionDto } from './dtos/create-function.dto';
import { UpdateFunctionDto } from './dtos/update-function.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';

@Controller('functions')
@UseGuards(AuthGuard)
export class FunctionController {
  constructor(private readonly functionService: FunctionService) {}

  @Get()
  async findAll() {
    return await this.functionService.findAll();
  }

  @Get('paginated')
  async findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return await this.functionService.findAllPaginated(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.functionService.findOne(id);
  }

  @Post()
  async create(@Body() createFunctionDto: CreateFunctionDto) {
    return await this.functionService.create(createFunctionDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateFunctionDto: UpdateFunctionDto,
  ) {
    return await this.functionService.update(id, updateFunctionDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.functionService.delete(id);
  }
}
