// backend/src/modules/fiscal-year/fiscal-year.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFiscalYearDto } from './dtos/create-fiscal-year.dto';
import { UpdateFiscalYearDto } from './dtos/update-fiscal-year.dto';
import { FiscalYear } from '@database/entities/fiscal-year/fiscal-year.entity';

@Injectable()
export class FiscalYearService {
  constructor(
    @InjectRepository(FiscalYear)
    private fiscalYearRepository: Repository<FiscalYear>,
  ) {}

  async findAll() {
    try {
      const fiscalYears = await this.fiscalYearRepository.find({
        order: {
          year: 'DESC',
        },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Anos fiscais listados com sucesso.',
        data: fiscalYears,
        path: '/fiscal-years',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch fiscal years | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar anos fiscais.',
          error: error.message,
          path: '/fiscal-years',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const fiscalYear = await this.fiscalYearRepository.findOne({
        where: { id },
      });

      if (!fiscalYear) {
        throw new NotFoundException(`Ano fiscal com ID ${id} não encontrado`);
      }

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Ano fiscal encontrado com sucesso.',
        data: fiscalYear,
        path: `/fiscal-years/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch fiscal year | Error: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao buscar ano fiscal.',
          error: error.message,
          path: `/fiscal-years/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findCurrentYear() {
    const currentYear = new Date().getFullYear().toString();
    const fiscalYear = await this.fiscalYearRepository.findOne({
      where: { year: currentYear },
    });

    return fiscalYear;
  }

  async create(createFiscalYearDto: CreateFiscalYearDto) {
    try {
      // Verificar se já existe um ano fiscal com o mesmo nome
      const existingYear = await this.fiscalYearRepository.findOne({
        where: { year: createFiscalYearDto.year },
      });

      if (existingYear) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            method: 'POST',
            message: `Já existe um ano fiscal com a designação "${createFiscalYearDto.year}".`,
            path: '/fiscal-years',
            timestamp: Date.now(),
          },
          HttpStatus.CONFLICT,
        );
      }

      const newFiscalYear =
        this.fiscalYearRepository.create(createFiscalYearDto);
      const savedFiscalYear =
        await this.fiscalYearRepository.save(newFiscalYear);

      return {
        statusCode: HttpStatus.CREATED,
        method: 'POST',
        message: 'Ano fiscal criado com sucesso.',
        data: savedFiscalYear,
        path: '/fiscal-years',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to create fiscal year | Error: ${error.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'POST',
          message: 'Erro ao criar ano fiscal.',
          error: error.message,
          path: '/fiscal-years',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateFiscalYearDto: UpdateFiscalYearDto) {
    try {
      const fiscalYear = await this.fiscalYearRepository.findOne({
        where: { id },
      });

      if (!fiscalYear) {
        throw new NotFoundException(`Ano fiscal com ID ${id} não encontrado`);
      }

      if (
        updateFiscalYearDto.year &&
        updateFiscalYearDto.year !== fiscalYear.year
      ) {
        const existingYear = await this.fiscalYearRepository.findOne({
          where: { year: updateFiscalYearDto.year },
        });

        if (existingYear) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              method: 'PUT',
              message: `Já existe um ano fiscal com a designação "${updateFiscalYearDto.year}".`,
              path: `/fiscal-years/${id}`,
              timestamp: Date.now(),
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      await this.fiscalYearRepository.update(id, updateFiscalYearDto);
      const updatedFiscalYear = await this.fiscalYearRepository.findOne({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'PUT',
        message: 'Ano fiscal atualizado com sucesso.',
        data: updatedFiscalYear,
        path: `/fiscal-years/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to update fiscal year | Error: ${error.message}`);

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
          message: 'Erro ao atualizar ano fiscal.',
          error: error.message,
          path: `/fiscal-years/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string) {
    try {
      const fiscalYear = await this.fiscalYearRepository.findOne({
        where: { id },
      });

      if (!fiscalYear) {
        throw new NotFoundException(`Ano fiscal com ID ${id} não encontrado`);
      }

      await this.fiscalYearRepository.remove(fiscalYear);

      return {
        statusCode: HttpStatus.OK,
        method: 'DELETE',
        message: 'Ano fiscal deletado com sucesso.',
        path: `/fiscal-years/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to delete fiscal year | Error: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'DELETE',
          message: 'Erro ao deletar ano fiscal.',
          error: error.message,
          path: `/fiscal-years/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
