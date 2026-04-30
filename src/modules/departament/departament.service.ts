// backend/src/modules/departament/departament.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateDepartamentDto } from './dtos/create-departament.dto';
import { UpdateDepartamentDto } from './dtos/update-departament.dto';
import { Departament } from '@database/entities/departament/departament.entity';

@Injectable()
export class DepartamentService {
  constructor(
    @InjectRepository(Departament)
    private departamentRepository: Repository<Departament>,
  ) {}

  async findAll() {
    try {
      const departaments = await this.departamentRepository.find({
        order: {
          departamentName: 'ASC',
        },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Departamentos listados com sucesso.',
        data: departaments,
        path: '/departaments',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch departaments | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar departamentos.',
          error: error.message,
          path: '/departaments',
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
        whereCondition.departamentName = Like(`%${search}%`);
      }

      const [departaments, total] =
        await this.departamentRepository.findAndCount({
          where: whereCondition,
          order: {
            departamentName: 'ASC',
          },
          skip,
          take: limit,
        });

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Departamentos listados com sucesso.',
        data: {
          items: departaments,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        path: '/departaments/paginated',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch departaments | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar departamentos.',
          error: error.message,
          path: '/departaments/paginated',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const departament = await this.departamentRepository.findOne({
        where: { id },
      });

      if (!departament) {
        throw new NotFoundException(`Departamento com ID ${id} não encontrado`);
      }

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Departamento encontrado com sucesso.',
        data: departament,
        path: `/departaments/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch departament | Error: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao buscar departamento.',
          error: error.message,
          path: `/departaments/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createDepartamentDto: CreateDepartamentDto) {
    try {
      // Verificar se já existe um departamento com o mesmo nome
      const existingDepartament = await this.departamentRepository.findOne({
        where: { departamentName: createDepartamentDto.departamentName },
      });

      if (existingDepartament) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            method: 'POST',
            message: `Já existe um departamento com o nome "${createDepartamentDto.departamentName}".`,
            path: '/departaments',
            timestamp: Date.now(),
          },
          HttpStatus.CONFLICT,
        );
      }

      const newDepartament =
        this.departamentRepository.create(createDepartamentDto);
      const savedDepartament =
        await this.departamentRepository.save(newDepartament);

      return {
        statusCode: HttpStatus.CREATED,
        method: 'POST',
        message: 'Departamento criado com sucesso.',
        data: savedDepartament,
        path: '/departaments',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to create departament | Error: ${error.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'POST',
          message: 'Erro ao criar departamento.',
          error: error.message,
          path: '/departaments',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateDepartamentDto: UpdateDepartamentDto) {
    try {
      const departament = await this.departamentRepository.findOne({
        where: { id },
      });

      if (!departament) {
        throw new NotFoundException(`Departamento com ID ${id} não encontrado`);
      }

      // Se estiver a atualizar o nome, verificar se já existe outro com o mesmo nome
      if (
        updateDepartamentDto.departamentName &&
        updateDepartamentDto.departamentName !== departament.departamentName
      ) {
        const existingDepartament = await this.departamentRepository.findOne({
          where: { departamentName: updateDepartamentDto.departamentName },
        });

        if (existingDepartament) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              method: 'PUT',
              message: `Já existe um departamento com o nome "${updateDepartamentDto.departamentName}".`,
              path: `/departaments/${id}`,
              timestamp: Date.now(),
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      await this.departamentRepository.update(id, updateDepartamentDto);
      const updatedDepartament = await this.departamentRepository.findOne({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'PUT',
        message: 'Departamento atualizado com sucesso.',
        data: updatedDepartament,
        path: `/departaments/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to update departament | Error: ${error.message}`);

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
          message: 'Erro ao atualizar departamento.',
          error: error.message,
          path: `/departaments/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string) {
    try {
      const departament = await this.departamentRepository.findOne({
        where: { id },
        relations: ['employees'], // Se tiver relação com employees
      });

      if (!departament) {
        throw new NotFoundException(`Departamento com ID ${id} não encontrado`);
      }

      // Verificar se existem funcionários associados a este departamento
      if (departament.employees && departament.employees.length > 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            method: 'DELETE',
            message: `Não é possível deletar este departamento pois existem ${departament.employees.length} funcionário(s) associado(s) a ele.`,
            path: `/departaments/${id}`,
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.departamentRepository.remove(departament);

      return {
        statusCode: HttpStatus.OK,
        method: 'DELETE',
        message: 'Departamento deletado com sucesso.',
        path: `/departaments/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to delete departament | Error: ${error.message}`);

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
          message: 'Erro ao deletar departamento.',
          error: error.message,
          path: `/departaments/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
