// backend/src/modules/nacionality/nacionality.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateNacionalityDto } from './dtos/create-nacionality.dto';
import { UpdateNacionalityDto } from './dtos/update-nacionality.dto';
import { Nacionality } from '@database/entities/nacionality/nacionality.entity';

@Injectable()
export class NacionalityService {
  constructor(
    @InjectRepository(Nacionality)
    private nacionalityRepository: Repository<Nacionality>,
  ) {}

  async findAll() {
    try {
      const nacionalities = await this.nacionalityRepository.find({
        order: {
          nomeNacionalidade: 'ASC',
        },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Nacionalidades listadas com sucesso.',
        data: nacionalities,
        path: '/nacionalities',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch nacionalities | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar nacionalidades.',
          error: error.message,
          path: '/nacionalities',
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
        whereCondition.nomeNacionalidade = Like(`%${search}%`);
      }

      const [nacionalities, total] =
        await this.nacionalityRepository.findAndCount({
          where: whereCondition,
          order: {
            nomeNacionalidade: 'ASC',
          },
          skip,
          take: limit,
        });

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Nacionalidades listadas com sucesso.',
        data: {
          items: nacionalities,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        path: '/nacionalities/paginated',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch nacionalities | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar nacionalidades.',
          error: error.message,
          path: '/nacionalities/paginated',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const nacionality = await this.nacionalityRepository.findOne({
        where: { id },
      });

      if (!nacionality) {
        throw new NotFoundException(
          `Nacionalidade com ID ${id} não encontrada`,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Nacionalidade encontrada com sucesso.',
        data: nacionality,
        path: `/nacionalities/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch nacionality | Error: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao buscar nacionalidade.',
          error: error.message,
          path: `/nacionalities/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneByCode(isocode: string) {
    try {
      const nacionality = await this.nacionalityRepository.findOne({
        where: { isocode },
      });

      return nacionality;
    } catch (error: any) {
      console.error(
        `Failed to fetch nacionality by code | Error: ${error.message}`,
      );
      return null;
    }
  }

  async create(createNacionalityDto: CreateNacionalityDto) {
    try {
      // Verificar se já existe uma nacionalidade com o mesmo nome
      const existingByName = await this.nacionalityRepository.findOne({
        where: { nomeNacionalidade: createNacionalityDto.nomeNacionalidade },
      });

      if (existingByName) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            method: 'POST',
            message: `Já existe uma nacionalidade com o nome "${createNacionalityDto.nomeNacionalidade}".`,
            path: '/nacionalities',
            timestamp: Date.now(),
          },
          HttpStatus.CONFLICT,
        );
      }

      // Verificar se já existe uma nacionalidade com o mesmo ISO code
      const existingByCode = await this.nacionalityRepository.findOne({
        where: { isocode: createNacionalityDto.isocode },
      });

      if (existingByCode) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            method: 'POST',
            message: `Já existe uma nacionalidade com o ISO code "${createNacionalityDto.isocode}".`,
            path: '/nacionalities',
            timestamp: Date.now(),
          },
          HttpStatus.CONFLICT,
        );
      }

      const newNacionality =
        this.nacionalityRepository.create(createNacionalityDto);
      const savedNacionality =
        await this.nacionalityRepository.save(newNacionality);

      return {
        statusCode: HttpStatus.CREATED,
        method: 'POST',
        message: 'Nacionalidade criada com sucesso.',
        data: savedNacionality,
        path: '/nacionalities',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to create nacionality | Error: ${error.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'POST',
          message: 'Erro ao criar nacionalidade.',
          error: error.message,
          path: '/nacionalities',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateNacionalityDto: UpdateNacionalityDto) {
    try {
      const nacionality = await this.nacionalityRepository.findOne({
        where: { id },
      });

      if (!nacionality) {
        throw new NotFoundException(
          `Nacionalidade com ID ${id} não encontrada`,
        );
      }

      // Se estiver a atualizar o nome, verificar se já existe outro com o mesmo nome
      if (
        updateNacionalityDto.nomeNacionalidade &&
        updateNacionalityDto.nomeNacionalidade !== nacionality.nomeNacionalidade
      ) {
        const existingByName = await this.nacionalityRepository.findOne({
          where: { nomeNacionalidade: updateNacionalityDto.nomeNacionalidade },
        });

        if (existingByName) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              method: 'PUT',
              message: `Já existe uma nacionalidade com o nome "${updateNacionalityDto.nomeNacionalidade}".`,
              path: `/nacionalities/${id}`,
              timestamp: Date.now(),
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      // Se estiver a atualizar o ISO code, verificar se já existe outro com o mesmo código
      if (
        updateNacionalityDto.isocode &&
        updateNacionalityDto.isocode !== nacionality.isocode
      ) {
        const existingByCode = await this.nacionalityRepository.findOne({
          where: { isocode: updateNacionalityDto.isocode },
        });

        if (existingByCode) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              method: 'PUT',
              message: `Já existe uma nacionalidade com o ISO code "${updateNacionalityDto.isocode}".`,
              path: `/nacionalities/${id}`,
              timestamp: Date.now(),
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      await this.nacionalityRepository.update(id, updateNacionalityDto);
      const updatedNacionality = await this.nacionalityRepository.findOne({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'PUT',
        message: 'Nacionalidade atualizada com sucesso.',
        data: updatedNacionality,
        path: `/nacionalities/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to update nacionality | Error: ${error.message}`);

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
          message: 'Erro ao atualizar nacionalidade.',
          error: error.message,
          path: `/nacionalities/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string) {
    try {
      const nacionality = await this.nacionalityRepository.findOne({
        where: { id },
        relations: ['employees'],
      });

      if (!nacionality) {
        throw new NotFoundException(
          `Nacionalidade com ID ${id} não encontrada`,
        );
      }

      // Verificar se existem funcionários associados a esta nacionalidade
      if (nacionality.employees && nacionality.employees.length > 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            method: 'DELETE',
            message: `Não é possível deletar esta nacionalidade pois existem ${nacionality.employees.length} funcionário(s) associado(s) a ela.`,
            path: `/nacionalities/${id}`,
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.nacionalityRepository.remove(nacionality);

      return {
        statusCode: HttpStatus.OK,
        method: 'DELETE',
        message: 'Nacionalidade deletada com sucesso.',
        path: `/nacionalities/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to delete nacionality | Error: ${error.message}`);

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
          message: 'Erro ao deletar nacionalidade.',
          error: error.message,
          path: `/nacionalities/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
