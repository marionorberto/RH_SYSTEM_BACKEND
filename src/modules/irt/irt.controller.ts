// backend/src/modules/irt/irt.controller.ts
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
import { IrtService } from './irt.service';
import { CreateIrtDto } from './dtos/create-irt.dto';
import { UpdateIrtDto } from './dtos/update-irt.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';

@Controller('irt')
@UseGuards(AuthGuard)
export class IrtController {
  constructor(private readonly irtService: IrtService) {}

  @Get()
  async findAll() {
    return await this.irtService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.irtService.findOne(id);
  }

  @Post()
  async create(@Body() createIrtDto: CreateIrtDto) {
    return await this.irtService.create(createIrtDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateIrtDto: UpdateIrtDto,
  ) {
    return await this.irtService.update(id, updateIrtDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.irtService.delete(id);
  }

  @Post('calculate')
  async calculateIrt(@Body() data: { salary: number }) {
    const irtValue = await this.irtService.calculateIrt(data.salary);
    return {
      statusCode: HttpStatus.OK,
      message: 'Cálculo de IRT realizado com sucesso.',
      data: {
        salary: data.salary,
        irtValue,
        netSalary: data.salary - irtValue,
      },
      timestamp: Date.now(),
    };
  }
}
