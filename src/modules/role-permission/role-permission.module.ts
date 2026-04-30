// backend/src/modules/role-permission/role-permission.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermission } from '@database/entities/permission-role/permission-role.entity';
import { Permission } from '@database/entities/permission/permission.entity';
import { Role } from '@database/entities/role/role.entity';
import { RolePermissionService } from './role-permission.service';
import { RolePermissionController } from './role-permission.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission, Role, Permission])],
  controllers: [RolePermissionController],
  providers: [RolePermissionService],
  exports: [RolePermissionService],
})
export class RolePermissionModule {}
