// backend/src/modules/departament/departament.controller.ts
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
import { DepartamentService } from './departament.service';
import { CreateDepartamentDto } from './dtos/create-departament.dto';
import { UpdateDepartamentDto } from './dtos/update-departament.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';

@Controller('departaments')
@UseGuards(AuthGuard)
export class DepartamentController {
  constructor(private readonly departamentService: DepartamentService) {}

  @Get()
  async findAll() {
    return await this.departamentService.findAll();
  }

  @Get('paginated')
  async findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return await this.departamentService.findAllPaginated(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.departamentService.findOne(id);
  }

  @Post()
  async create(@Body() createDepartamentDto: CreateDepartamentDto) {
    return await this.departamentService.create(createDepartamentDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDepartamentDto: UpdateDepartamentDto,
  ) {
    return await this.departamentService.update(id, updateDepartamentDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.departamentService.delete(id);
  }
}
