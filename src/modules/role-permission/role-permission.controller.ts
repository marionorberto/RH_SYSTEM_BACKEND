// backend/src/modules/role-permission/role-permission.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RolePermissionService } from './role-permission.service';
import { AssignPermissionsDto } from './dtos/assign-role-permission.dto';
import { AuthGuard } from '../../shared/auth/auth.guard';
import { CreateRolePermissionDto } from './dtos/create-role-permission.dto';

@Controller('role-permissions')
@UseGuards(AuthGuard)
export class RolePermissionController {
  constructor(private readonly rolePermissionService: RolePermissionService) {}

  @Get()
  async findAll() {
    return await this.rolePermissionService.findAll();
  }

  @Get('role/:roleId')
  async findByRole(@Param('roleId') roleId: string) {
    return await this.rolePermissionService.findByRole(roleId);
  }

  @Get('permission/:permissionId')
  async findByPermission(@Param('permissionId') permissionId: string) {
    return await this.rolePermissionService.findByPermission(permissionId);
  }

  @Post()
  async create(@Body() createRolePermissionDto: CreateRolePermissionDto) {
    return await this.rolePermissionService.create(createRolePermissionDto);
  }

  @Post('assign-many')
  async assignPermissions(@Body() assignPermissionsDto: AssignPermissionsDto) {
    return await this.rolePermissionService.assignPermissions(
      assignPermissionsDto,
    );
  }

  @Delete(':roleId/:permissionId')
  async remove(
    @Param('roleId') roleId: string,
    @Param('permissionId') permissionId: string,
  ) {
    return await this.rolePermissionService.remove(roleId, permissionId);
  }

  @Delete('role/:roleId')
  async removeAllByRole(@Param('roleId') roleId: string) {
    return await this.rolePermissionService.removeAllByRole(roleId);
  }
}
