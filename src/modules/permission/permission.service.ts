// backend/src/modules/permission/permission.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreatePermissionDto } from './dtos/create-permission.dto';
import { UpdatePermissionDto } from './dtos/update-permission.dto';
import { Permission } from '@database/entities/permission/permission.entity';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async findAll() {
    try {
      const permissions = await this.permissionRepository.find({
        order: {
          nomePermission: 'ASC',
        },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Permissões listadas com sucesso.',
        data: permissions,
        path: '/permissions',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch permissions | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar permissões.',
          error: error.message,
          path: '/permissions',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    try {
      const skip = (page - 1) * limit;

      const whereCondition: any = {};
      if (search && search.trim() !== '') {
        whereCondition.nomePermission = Like(`%${search}%`);
      }

      const [permissions, total] = await this.permissionRepository.findAndCount(
        {
          where: whereCondition,
          order: {
            nomePermission: 'ASC',
          },
          skip,
          take: limit,
        },
      );

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Permissões listadas com sucesso.',
        data: {
          items: permissions,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        path: '/permissions/paginated',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch permissions | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar permissões.',
          error: error.message,
          path: '/permissions/paginated',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id },
        relations: ['rolePermissions', 'rolePermissions.role'],
      });

      if (!permission) {
        throw new NotFoundException(`Permissão com ID ${id} não encontrada`);
      }

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Permissão encontrada com sucesso.',
        data: permission,
        path: `/permissions/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch permission | Error: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao buscar permissão.',
          error: error.message,
          path: `/permissions/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      const existingPermission = await this.permissionRepository.findOne({
        where: { nomePermission: createPermissionDto.nomePermission },
      });

      if (existingPermission) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            method: 'POST',
            message: `Já existe uma permissão com o nome "${createPermissionDto.nomePermission}".`,
            path: '/permissions',
            timestamp: Date.now(),
          },
          HttpStatus.CONFLICT,
        );
      }

      const newPermission =
        this.permissionRepository.create(createPermissionDto);
      const savedPermission =
        await this.permissionRepository.save(newPermission);

      return {
        statusCode: HttpStatus.CREATED,
        method: 'POST',
        message: 'Permissão criada com sucesso.',
        data: savedPermission,
        path: '/permissions',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to create permission | Error: ${error.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'POST',
          message: 'Erro ao criar permissão.',
          error: error.message,
          path: '/permissions',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto) {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id },
      });

      if (!permission) {
        throw new NotFoundException(`Permissão com ID ${id} não encontrada`);
      }

      if (
        updatePermissionDto.nomePermission &&
        updatePermissionDto.nomePermission !== permission.nomePermission
      ) {
        const existingPermission = await this.permissionRepository.findOne({
          where: { nomePermission: updatePermissionDto.nomePermission },
        });

        if (existingPermission) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              method: 'PUT',
              message: `Já existe uma permissão com o nome "${updatePermissionDto.nomePermission}".`,
              path: `/permissions/${id}`,
              timestamp: Date.now(),
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      await this.permissionRepository.update(id, updatePermissionDto);
      const updatedPermission = await this.permissionRepository.findOne({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'PUT',
        message: 'Permissão atualizada com sucesso.',
        data: updatedPermission,
        path: `/permissions/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to update permission | Error: ${error.message}`);

      if (
        error instanceof HttpException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'PUT',
          message: 'Erro ao atualizar permissão.',
          error: error.message,
          path: `/permissions/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string) {
    try {
      const permission = await this.permissionRepository.findOne({
        where: { id },
        relations: ['rolePermissions'],
      });

      if (!permission) {
        throw new NotFoundException(`Permissão com ID ${id} não encontrada`);
      }

      if (permission.rolePermissions && permission.rolePermissions.length > 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            method: 'DELETE',
            message: `Não é possível deletar esta permissão pois está associada a ${permission.rolePermissions.length} role(s).`,
            path: `/permissions/${id}`,
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.permissionRepository.remove(permission);

      return {
        statusCode: HttpStatus.OK,
        method: 'DELETE',
        message: 'Permissão deletada com sucesso.',
        path: `/permissions/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to delete permission | Error: ${error.message}`);

      if (
        error instanceof HttpException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'DELETE',
          message: 'Erro ao deletar permissão.',
          error: error.message,
          path: `/permissions/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
