// backend/src/modules/function/function.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateFunctionDto } from './dtos/create-function.dto';
import { UpdateFunctionDto } from './dtos/update-function.dto';
import { Function } from '@database/entities/function/function.entity';

@Injectable()
export class FunctionService {
  constructor(
    @InjectRepository(Function)
    private functionRepository: Repository<Function>,
  ) {}

  async findAll() {
    try {
      const functions = await this.functionRepository.find({
        order: {
          functionName: 'ASC',
        },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Funções listadas com sucesso.',
        data: functions,
        path: '/functions',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch functions | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar funções.',
          error: error.message,
          path: '/functions',
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
        whereCondition.functionName = Like(`%${search}%`);
      }

      const [functions, total] = await this.functionRepository.findAndCount({
        where: whereCondition,
        order: {
          functionName: 'ASC',
        },
        skip,
        take: limit,
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Funções listadas com sucesso.',
        data: {
          items: functions,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        path: '/functions/paginated',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch functions | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar funções.',
          error: error.message,
          path: '/functions/paginated',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const functionEntity = await this.functionRepository.findOne({
        where: { id },
      });

      if (!functionEntity) {
        throw new NotFoundException(`Função com ID ${id} não encontrada`);
      }

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Função encontrada com sucesso.',
        data: functionEntity,
        path: `/functions/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch function | Error: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao buscar função.',
          error: error.message,
          path: `/functions/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createFunctionDto: CreateFunctionDto) {
    try {
      // Verificar se já existe uma função com o mesmo nome
      const existingFunction = await this.functionRepository.findOne({
        where: { functionName: createFunctionDto.functionName },
      });

      if (existingFunction) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            method: 'POST',
            message: `Já existe uma função com o nome "${createFunctionDto.functionName}".`,
            path: '/functions',
            timestamp: Date.now(),
          },
          HttpStatus.CONFLICT,
        );
      }

      const newFunction = this.functionRepository.create(createFunctionDto);
      const savedFunction = await this.functionRepository.save(newFunction);

      return {
        statusCode: HttpStatus.CREATED,
        method: 'POST',
        message: 'Função criada com sucesso.',
        data: savedFunction,
        path: '/functions',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to create function | Error: ${error.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'POST',
          message: 'Erro ao criar função.',
          error: error.message,
          path: '/functions',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateFunctionDto: UpdateFunctionDto) {
    try {
      const functionEntity = await this.functionRepository.findOne({
        where: { id },
      });

      if (!functionEntity) {
        throw new NotFoundException(`Função com ID ${id} não encontrada`);
      }

      // Se estiver a atualizar o nome, verificar se já existe outro com o mesmo nome
      if (
        updateFunctionDto.functionName &&
        updateFunctionDto.functionName !== functionEntity.functionName
      ) {
        const existingFunction = await this.functionRepository.findOne({
          where: { functionName: updateFunctionDto.functionName },
        });

        if (existingFunction) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              method: 'PUT',
              message: `Já existe uma função com o nome "${updateFunctionDto.functionName}".`,
              path: `/functions/${id}`,
              timestamp: Date.now(),
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      await this.functionRepository.update(id, updateFunctionDto);
      const updatedFunction = await this.functionRepository.findOne({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'PUT',
        message: 'Função atualizada com sucesso.',
        data: updatedFunction,
        path: `/functions/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to update function | Error: ${error.message}`);

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
          message: 'Erro ao atualizar função.',
          error: error.message,
          path: `/functions/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string) {
    try {
      const functionEntity = await this.functionRepository.findOne({
        where: { id },
        relations: ['employees'],
      });

      if (!functionEntity) {
        throw new NotFoundException(`Função com ID ${id} não encontrada`);
      }

      // Verificar se existem funcionários associados a esta função
      if (functionEntity.employees && functionEntity.employees.length > 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            method: 'DELETE',
            message: `Não é possível deletar esta função pois existem ${functionEntity.employees.length} funcionário(s) associado(s) a ela.`,
            path: `/functions/${id}`,
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.functionRepository.remove(functionEntity);

      return {
        statusCode: HttpStatus.OK,
        method: 'DELETE',
        message: 'Função deletada com sucesso.',
        path: `/functions/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to delete function | Error: ${error.message}`);

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
          message: 'Erro ao deletar função.',
          error: error.message,
          path: `/functions/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
