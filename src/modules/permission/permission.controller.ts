// backend/src/modules/permission/permission.controller.ts
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
import { PermissionService } from './permission.service';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';

@Controller('permissions')
@UseGuards(AuthGuard)
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  async findAll() {
    return await this.permissionService.findAll();
  }

  @Get('paginated')
  async findAllPaginated(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('search') search?: string,
  ) {
    return await this.permissionService.findAllPaginated(page, limit, search);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.permissionService.findOne(id);
  }

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionService.create(createPermissionDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return await this.permissionService.update(id, updatePermissionDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.permissionService.delete(id);
  }
}
