// backend/src/modules/nacionality/nacionality.controller.ts
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
import { NacionalityService } from './nacionality.service';
import { CreateNacionalityDto } from './dtos/create-nacionality.dto';
import { UpdateNacionalityDto } from './dtos/update-nacionality.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';

@Controller('nacionalities')
@UseGuards(AuthGuard)
export class NacionalityController {
  constructor(private readonly nacionalityService: NacionalityService) {}

  @Get()
  async findAll() {
    return await this.nacionalityService.findAll();
  }

  @Get('paginated')
  async findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return await this.nacionalityService.findAllPaginated(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.nacionalityService.findOne(id);
  }

  @Post()
  async create(@Body() createNacionalityDto: CreateNacionalityDto) {
    return await this.nacionalityService.create(createNacionalityDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNacionalityDto: UpdateNacionalityDto,
  ) {
    return await this.nacionalityService.update(id, updateNacionalityDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.nacionalityService.delete(id);
  }
}
