// backend/src/modules/employee/employee.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { EmployeeService } from './employee.service';

@Controller('employees')
@UseGuards(AuthGuard)
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Get()
  async findAll() {
    return await this.employeeService.findAll();
  }

  @Get('without-user')
  async findWithoutUser() {
    return await this.employeeService.findWithoutUser();
  }

  @Get('paginated')
  async findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return await this.employeeService.findAllPaginated(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.employeeService.findOne(id);
  }

  @Post()
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return await this.employeeService.create(createEmployeeDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto,
  ) {
    return await this.employeeService.update(id, updateEmployeeDto);
  }

  @Patch(':id/toggle-status')
  async toggleStatus(@Param('id') id: string) {
    return await this.employeeService.toggleStatus(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.employeeService.delete(id);
  }
}
