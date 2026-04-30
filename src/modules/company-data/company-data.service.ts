// backend/src/modules/company-data/company-data.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCompanyDataDto } from './dtos/create-company-data.dto';
import { UpdateCompanyDataDto } from './dtos/update-company-data.dto';
import { CompanyData } from '@database/entities/company-data/company-data.entity';

@Injectable()
export class CompanyDataService {
  constructor(
    @InjectRepository(CompanyData)
    private companyDataRepository: Repository<CompanyData>,
  ) {}

  async findOne() {
    try {
      // Buscar o primeiro registro (deve ser apenas um, singleton)
      const companyData = await this.companyDataRepository.findOne({
        where: {},
        order: {
          createdAt: 'DESC',
        },
      });

      if (!companyData) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          method: 'GET',
          message:
            'Dados da empresa não encontrados. Por favor, crie um registro.',
          data: null,
          path: '/company-data',
          timestamp: Date.now(),
        };
      }

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Dados da empresa encontrados com sucesso.',
        data: companyData,
        path: '/company-data',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch company data | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao buscar dados da empresa.',
          error: error.message,
          path: '/company-data',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createCompanyDataDto: CreateCompanyDataDto) {
    try {
      // Verificar se já existe um registro
      const existingData = await this.companyDataRepository.findOne({
        where: {},
      });

      if (existingData) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            method: 'POST',
            message:
              'Os dados da empresa já foram configurados. Use o método PUT para atualizar.',
            path: '/company-data',
            timestamp: Date.now(),
          },
          HttpStatus.CONFLICT,
        );
      }

      const newCompanyData =
        this.companyDataRepository.create(createCompanyDataDto);
      const savedCompanyData =
        await this.companyDataRepository.save(newCompanyData);

      // Remover dados sensíveis antes de retornar
      const { smtpPassword, ...safeData } = savedCompanyData;

      console.log(smtpPassword);

      return {
        statusCode: HttpStatus.CREATED,
        method: 'POST',
        message: 'Dados da empresa criados com sucesso.',
        data: safeData,
        path: '/company-data',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to create company data | Error: ${error.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'POST',
          message: 'Erro ao criar dados da empresa.',
          error: error.message,
          path: '/company-data',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(updateCompanyDataDto: UpdateCompanyDataDto) {
    try {
      const companyData = await this.companyDataRepository.findOne({
        where: {},
      });

      if (!companyData) {
        throw new NotFoundException(
          'Dados da empresa não encontrados. Por favor, crie um registro primeiro.',
        );
      }

      // Atualizar apenas os campos fornecidos
      await this.companyDataRepository.update(
        companyData.id,
        updateCompanyDataDto,
      );
      const updatedCompanyData = await this.companyDataRepository.findOne({
        where: { id: companyData.id },
      });

      // Remover dados sensíveis antes de retornar
      const { smtpPassword, ...safeData } = updatedCompanyData;
      console.log(smtpPassword);

      return {
        statusCode: HttpStatus.OK,
        method: 'PUT',
        message: 'Dados da empresa atualizados com sucesso.',
        data: safeData,
        path: '/company-data',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to update company data | Error: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            method: 'PUT',
            message: error.message,
            path: '/company-data',
            timestamp: Date.now(),
          },
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'PUT',
          message: 'Erro ao atualizar dados da empresa.',
          error: error.message,
          path: '/company-data',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
