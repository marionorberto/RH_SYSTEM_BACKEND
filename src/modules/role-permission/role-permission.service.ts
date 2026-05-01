// backend/src/modules/role-permission/role-permission.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AssignPermissionsDto } from './dtos/assign-role-permission.dto';
import { RolePermission } from '@database/entities/permission-role/permission-role.entity';
import { Role } from '@database/entities/role/role.entity';
import { Permission } from '@database/entities/permission/permission.entity';
import { CreateRolePermissionDto } from './dtos/create-role-permission.dto';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async findAll() {
    try {
      const rolePermissions = await this.rolePermissionRepository.find({
        relations: ['role', 'permission'],
        order: {
          role: { roleName: 'ASC' },
          permission: { nomePermission: 'ASC' },
        },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Associações role-permissão listadas com sucesso.',
        data: rolePermissions,
        path: '/role-permissions',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(
        `Failed to fetch role-permissions | Error: ${error.message}`,
      );
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar associações.',
          error: error.message,
          path: '/role-permissions',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByRole(roleId: string) {
    try {
      const role = await this.roleRepository.findOne({
        where: { id: roleId },
      });

      if (!role) {
        throw new NotFoundException(`Role com ID ${roleId} não encontrado`);
      }

      const rolePermissions = await this.rolePermissionRepository.find({
        where: { role: { id: roleId } },
        relations: ['permission'],
        order: {
          permission: { nomePermission: 'ASC' },
        },
      });

      const permissions = rolePermissions.map((rp) => rp.permission);

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: `Permissões do role ${role.roleName} listadas com sucesso.`,
        data: {
          role,
          permissions,
          permissionIds: permissions.map((p) => p.id),
        },
        path: `/role-permissions/role/${roleId}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(
        `Failed to fetch role permissions | Error: ${error.message}`,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao buscar permissões do role.',
          error: error.message,
          path: `/role-permissions/role/${roleId}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByPermission(permissionId: string) {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id: permissionId },
      });

      if (!permission) {
        throw new NotFoundException(
          `Permissão com ID ${permissionId} não encontrada`,
        );
      }

      const rolePermissions = await this.rolePermissionRepository.find({
        where: { permission: { id: permissionId } },
        relations: ['role'],
        order: {
          role: { roleName: 'ASC' },
        },
      });

      const roles = rolePermissions.map((rp) => rp.role);

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: `Roles com permissão ${permission.nomePermission} listados com sucesso.`,
        data: {
          permission,
          roles,
          roleIds: roles.map((r) => r.id),
        },
        path: `/role-permissions/permission/${permissionId}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(
        `Failed to fetch permission roles | Error: ${error.message}`,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao buscar roles da permissão.',
          error: error.message,
          path: `/role-permissions/permission/${permissionId}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createRolePermissionDto: CreateRolePermissionDto) {
    try {
      const { roleId, permissionId } = createRolePermissionDto;

      const role = await this.roleRepository.findOne({
        where: { id: roleId },
      });

      if (!role) {
        throw new NotFoundException(`Role com ID ${roleId} não encontrado`);
      }

      const permission = await this.permissionRepository.findOne({
        where: { id: permissionId },
      });

      if (!permission) {
        throw new NotFoundException(
          `Permissão com ID ${permissionId} não encontrada`,
        );
      }

      const existing = await this.rolePermissionRepository.findOne({
        where: {
          role: { id: roleId },
          permission: { id: permissionId },
        },
      });

      if (existing) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            method: 'POST',
            message: `A permissão "${permission.nomePermission}" já está associada ao role "${role.roleName}".`,
            path: '/role-permissions',
            timestamp: Date.now(),
          },
          HttpStatus.CONFLICT,
        );
      }

      const newRolePermission = this.rolePermissionRepository.create({
        role,
        permission,
      });

      const saved = await this.rolePermissionRepository.save(newRolePermission);

      return {
        statusCode: HttpStatus.CREATED,
        method: 'POST',
        message: `Permissão "${permission.nomePermission}" associada ao role "${role.roleName}" com sucesso.`,
        data: {
          id: saved.id,
          role: { id: role.id, roleName: role.roleName },
          permission: {
            id: permission.id,
            nomePermission: permission.nomePermission,
          },
        },
        path: '/role-permissions',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(
        `Failed to create role-permission | Error: ${error.message}`,
      );

      if (
        error instanceof HttpException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'POST',
          message: 'Erro ao associar permissão ao role.',
          error: error.message,
          path: '/role-permissions',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async assignPermissions(assignPermissionsDto: AssignPermissionsDto) {
    try {
      const { roleId, permissionIds } = assignPermissionsDto;

      const role = await this.roleRepository.findOne({
        where: { id: roleId },
      });

      if (!role) {
        throw new NotFoundException(`Role com ID ${roleId} não encontrado`);
      }

      const permissions =
        await this.permissionRepository.findByIds(permissionIds);

      if (permissions.length !== permissionIds.length) {
        const foundIds = permissions.map((p) => p.id);
        const notFound = permissionIds.filter((id) => !foundIds.includes(id));
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            method: 'POST',
            message: `Permissões não encontradas: ${notFound.join(', ')}`,
            path: '/role-permissions/assign-many',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      // Remover associações existentes
      await this.rolePermissionRepository.delete({
        role: { id: roleId },
      });

      // Criar novas associações
      const newAssociations = permissions.map((permission) =>
        this.rolePermissionRepository.create({
          role,
          permission,
        }),
      );

      const saved = await this.rolePermissionRepository.save(newAssociations);
      console.log(saved);
      return {
        statusCode: HttpStatus.OK,
        method: 'POST',
        message: `${permissions.length} permissão(ões) associada(s) ao role "${role.roleName}" com sucesso.`,
        data: {
          role: { id: role.id, roleName: role.roleName },
          permissions: permissions.map((p) => ({
            id: p.id,
            nomePermission: p.nomePermission,
          })),
        },
        path: '/role-permissions/assign-many',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to assign permissions | Error: ${error.message}`);

      if (
        error instanceof HttpException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'POST',
          message: 'Erro ao associar permissões ao role.',
          error: error.message,
          path: '/role-permissions/assign-many',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(roleId: string, permissionId: string) {
    try {
      const rolePermission = await this.rolePermissionRepository.findOne({
        where: {
          role: { id: roleId },
          permission: { id: permissionId },
        },
        relations: ['role', 'permission'],
      });

      if (!rolePermission) {
        throw new NotFoundException(`Associação não encontrada`);
      }

      await this.rolePermissionRepository.remove(rolePermission);

      return {
        statusCode: HttpStatus.OK,
        method: 'DELETE',
        message: `Permissão "${rolePermission.permission.nomePermission}" removida do role "${rolePermission.role.roleName}" com sucesso.`,
        path: `/role-permissions/${roleId}/${permissionId}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(
        `Failed to remove role-permission | Error: ${error.message}`,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'DELETE',
          message: 'Erro ao remover associação.',
          error: error.message,
          path: `/role-permissions/${roleId}/${permissionId}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeAllByRole(roleId: string) {
    try {
      const role = await this.roleRepository.findOne({
        where: { id: roleId },
      });

      if (!role) {
        throw new NotFoundException(`Role com ID ${roleId} não encontrado`);
      }

      const result = await this.rolePermissionRepository.delete({
        role: { id: roleId },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'DELETE',
        message: `Todas as permissões foram removidas do role "${role.roleName}". Total: ${result.affected}`,
        path: `/role-permissions/role/${roleId}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(
        `Failed to remove all permissions | Error: ${error.message}`,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'DELETE',
          message: 'Erro ao remover todas as permissões.',
          error: error.message,
          path: `/role-permissions/role/${roleId}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
