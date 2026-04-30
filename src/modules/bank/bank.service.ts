// backend/src/modules/bank/bank.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateBankDto } from './dtos/create-bank.dto';
import { UpdateBankDto } from './dtos/update-bank.dto';
import { Bank } from '@database/entities/bank/bank.entity';

@Injectable()
export class BankService {
  constructor(
    @InjectRepository(Bank)
    private bankRepository: Repository<Bank>,
  ) {}

  async findAll() {
    try {
      const banks = await this.bankRepository.find({
        order: {
          bank_name: 'ASC',
        },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Bancos listados com sucesso.',
        data: banks,
        path: '/banks',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch banks | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar bancos.',
          error: error.message,
          path: '/banks',
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
        whereCondition.bank_name = Like(`%${search}%`);
      }

      const [banks, total] = await this.bankRepository.findAndCount({
        where: whereCondition,
        order: {
          bank_name: 'ASC',
        },
        skip,
        take: limit,
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Bancos listados com sucesso.',
        data: {
          items: banks,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        path: '/banks/paginated',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch banks | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar bancos.',
          error: error.message,
          path: '/banks/paginated',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const bank = await this.bankRepository.findOne({
        where: { id },
      });

      if (!bank) {
        throw new NotFoundException(`Banco com ID ${id} não encontrado`);
      }

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Banco encontrado com sucesso.',
        data: bank,
        path: `/banks/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch bank | Error: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao buscar banco.',
          error: error.message,
          path: `/banks/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createBankDto: CreateBankDto) {
    try {
      // Verificar se já existe um banco com o mesmo código
      const existingByCode = await this.bankRepository.findOne({
        where: { code: createBankDto.code },
      });

      if (existingByCode) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            method: 'POST',
            message: `Já existe um banco com o código "${createBankDto.code}".`,
            path: '/banks',
            timestamp: Date.now(),
          },
          HttpStatus.CONFLICT,
        );
      }

      // Verificar se já existe um banco com a mesma sigla
      const existingBySigla = await this.bankRepository.findOne({
        where: { sigla: createBankDto.sigla },
      });

      if (existingBySigla) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            method: 'POST',
            message: `Já existe um banco com a sigla "${createBankDto.sigla}".`,
            path: '/banks',
            timestamp: Date.now(),
          },
          HttpStatus.CONFLICT,
        );
      }

      const newBank = this.bankRepository.create(createBankDto);
      const savedBank = await this.bankRepository.save(newBank);

      return {
        statusCode: HttpStatus.CREATED,
        method: 'POST',
        message: 'Banco criado com sucesso.',
        data: savedBank,
        path: '/banks',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to create bank | Error: ${error.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'POST',
          message: 'Erro ao criar banco.',
          error: error.message,
          path: '/banks',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateBankDto: UpdateBankDto) {
    try {
      const bank = await this.bankRepository.findOne({
        where: { id },
      });

      if (!bank) {
        throw new NotFoundException(`Banco com ID ${id} não encontrado`);
      }

      // Verificar conflitos de código
      if (updateBankDto.code && updateBankDto.code !== bank.code) {
        const existingByCode = await this.bankRepository.findOne({
          where: { code: updateBankDto.code },
        });

        if (existingByCode) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              method: 'PUT',
              message: `Já existe um banco com o código "${updateBankDto.code}".`,
              path: `/banks/${id}`,
              timestamp: Date.now(),
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      // Verificar conflitos de sigla
      if (updateBankDto.sigla && updateBankDto.sigla !== bank.sigla) {
        const existingBySigla = await this.bankRepository.findOne({
          where: { sigla: updateBankDto.sigla },
        });

        if (existingBySigla) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              method: 'PUT',
              message: `Já existe um banco com a sigla "${updateBankDto.sigla}".`,
              path: `/banks/${id}`,
              timestamp: Date.now(),
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      await this.bankRepository.update(id, updateBankDto);
      const updatedBank = await this.bankRepository.findOne({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'PUT',
        message: 'Banco atualizado com sucesso.',
        data: updatedBank,
        path: `/banks/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to update bank | Error: ${error.message}`);

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
          message: 'Erro ao atualizar banco.',
          error: error.message,
          path: `/banks/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string) {
    try {
      const bank = await this.bankRepository.findOne({
        where: { id },
        relations: ['employee'],
      });

      if (!bank) {
        throw new NotFoundException(`Banco com ID ${id} não encontrado`);
      }

      // Verificar se existem funcionários associados a este banco
      if (bank.employee && bank.employee.length > 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            method: 'DELETE',
            message: `Não é possível deletar este banco pois existem ${bank.employee.length} funcionário(s) associado(s) a ele.`,
            path: `/banks/${id}`,
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.bankRepository.remove(bank);

      return {
        statusCode: HttpStatus.OK,
        method: 'DELETE',
        message: 'Banco deletado com sucesso.',
        path: `/banks/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to delete bank | Error: ${error.message}`);

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
          message: 'Erro ao deletar banco.',
          error: error.message,
          path: `/banks/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
