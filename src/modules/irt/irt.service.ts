// backend/src/modules/irt/irt.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // ← Adicionar estes imports
import { CreateIrtDto } from './dtos/create-irt.dto';
import { UpdateIrtDto } from './dtos/update-irt.dto';
import { Irt } from '@database/entities/irt/irt.entity';

@Injectable()
export class IrtService {
  constructor(
    @InjectRepository(Irt)
    private irtRepository: Repository<Irt>,
  ) {}

  async findAll() {
    try {
      const irts = await this.irtRepository.find({
        order: {
          inferiorLimit: 'ASC',
        },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Tabelas de IRT listadas com sucesso.',
        data: irts,
        path: '/irt',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch IRT | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar tabelas de IRT.',
          error: error.message,
          path: '/irt',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const irt = await this.irtRepository.findOne({
        where: { id },
      });

      if (!irt) {
        throw new NotFoundException(
          `Tabela de IRT com ID ${id} não encontrada`,
        );
      }

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Tabela de IRT encontrada com sucesso.',
        data: irt,
        path: `/irt/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch IRT | Error: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao buscar tabela de IRT.',
          error: error.message,
          path: `/irt/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createIrtDto: CreateIrtDto) {
    try {
      const newIrt = this.irtRepository.create(createIrtDto);
      const savedIrt = await this.irtRepository.save(newIrt);

      return {
        statusCode: HttpStatus.CREATED,
        method: 'POST',
        message: 'Tabela de IRT criada com sucesso.',
        data: savedIrt,
        path: '/irt',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to create IRT | Error: ${error.message}`);

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'POST',
          message: 'Erro ao criar tabela de IRT.',
          error: error.message,
          path: '/irt',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateIrtDto: UpdateIrtDto) {
    try {
      const irt = await this.irtRepository.findOne({
        where: { id },
      });

      if (!irt) {
        throw new NotFoundException(
          `Tabela de IRT com ID ${id} não encontrada`,
        );
      }

      await this.irtRepository.update(id, updateIrtDto);
      const updatedIrt = await this.irtRepository.findOne({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'PUT',
        message: 'Tabela de IRT atualizada com sucesso.',
        data: updatedIrt,
        path: `/irt/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to update IRT | Error: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'PUT',
          message: 'Erro ao atualizar tabela de IRT.',
          error: error.message,
          path: `/irt/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string) {
    try {
      const irt = await this.irtRepository.findOne({
        where: { id },
      });

      if (!irt) {
        throw new NotFoundException(
          `Tabela de IRT com ID ${id} não encontrada`,
        );
      }

      await this.irtRepository.remove(irt);

      return {
        statusCode: HttpStatus.OK,
        method: 'DELETE',
        message: 'Tabela de IRT deletada com sucesso.',
        path: `/irt/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to delete IRT | Error: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'DELETE',
          message: 'Erro ao deletar tabela de IRT.',
          error: error.message,
          path: `/irt/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async calculateIrt(salary: number): Promise<number> {
    try {
      // Buscar a faixa de IRT onde o salário está entre inferiorLimit e superiorLimit
      const irtBracket = await this.irtRepository
        .createQueryBuilder('irt')
        .where('irt.inferiorLimit <= :salary', { salary })
        .andWhere(
          '(irt.superiorLimit IS NULL OR irt.superiorLimit >= :salary)',
          { salary },
        )
        .orderBy('irt.inferiorLimit', 'DESC')
        .getOne();

      if (!irtBracket) {
        return 0;
      }

      // Cálculo do IRT
      let taxableAmount = salary - (irtBracket.inferiorLimit || 0);
      if (taxableAmount < 0) taxableAmount = 0;

      const irtValue =
        (taxableAmount * (irtBracket.tax || 0) / 100) + (irtBracket.FixedValue || 0);

      return Math.max(0, irtValue);
    } catch (error: any) {
      console.error(`Failed to calculate IRT | Error: ${error.message}`);
      return 0;
    }
  }
}
