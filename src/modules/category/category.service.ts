// backend/src/modules/category/category.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { Category } from '@database/entities/category/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async findAll() {
    try {
      const categories = await this.categoryRepository.find({
        order: {
          categoryName: 'ASC',
        },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Categorias listadas com sucesso.',
        data: categories,
        path: '/categories',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch categories | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar categorias.',
          error: error.message,
          path: '/categories',
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
        whereCondition.categoryName = Like(`%${search}%`);
      }

      const [categories, total] = await this.categoryRepository.findAndCount({
        where: whereCondition,
        order: {
          categoryName: 'ASC',
        },
        skip,
        take: limit,
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Categorias listadas com sucesso.',
        data: {
          items: categories,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        path: '/categories/paginated',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch categories | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar categorias.',
          error: error.message,
          path: '/categories/paginated',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
      }

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Categoria encontrada com sucesso.',
        data: category,
        path: `/categories/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch category | Error: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao buscar categoria.',
          error: error.message,
          path: `/categories/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const existingCategory = await this.categoryRepository.findOne({
        where: { categoryName: createCategoryDto.categoryName },
      });

      if (existingCategory) {
        throw new HttpException(
          {
            statusCode: HttpStatus.CONFLICT,
            method: 'POST',
            message: `Já existe uma categoria com o nome "${createCategoryDto.categoryName}".`,
            path: '/categories',
            timestamp: Date.now(),
          },
          HttpStatus.CONFLICT,
        );
      }

      const newCategory = this.categoryRepository.create(createCategoryDto);
      const savedCategory = await this.categoryRepository.save(newCategory);

      return {
        statusCode: HttpStatus.CREATED,
        method: 'POST',
        message: 'Categoria criada com sucesso.',
        data: savedCategory,
        path: '/categories',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to create category | Error: ${error.message}`);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'POST',
          message: 'Erro ao criar categoria.',
          error: error.message,
          path: '/categories',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
      });

      if (!category) {
        throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
      }

      if (
        updateCategoryDto.categoryName &&
        updateCategoryDto.categoryName !== category.categoryName
      ) {
        const existingCategory = await this.categoryRepository.findOne({
          where: { categoryName: updateCategoryDto.categoryName },
        });

        if (existingCategory) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              method: 'PUT',
              message: `Já existe uma categoria com o nome "${updateCategoryDto.categoryName}".`,
              path: `/categories/${id}`,
              timestamp: Date.now(),
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      await this.categoryRepository.update(id, updateCategoryDto);
      const updatedCategory = await this.categoryRepository.findOne({
        where: { id },
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'PUT',
        message: 'Categoria atualizada com sucesso.',
        data: updatedCategory,
        path: `/categories/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to update category | Error: ${error.message}`);

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
          message: 'Erro ao atualizar categoria.',
          error: error.message,
          path: `/categories/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string) {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['employees'],
      });

      if (!category) {
        throw new NotFoundException(`Categoria com ID ${id} não encontrada`);
      }

      if (category.employees && category.employees.length > 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            method: 'DELETE',
            message: `Não é possível deletar esta categoria pois existem ${category.employees.length} funcionário(s) associado(s) a ela.`,
            path: `/categories/${id}`,
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.categoryRepository.remove(category);

      return {
        statusCode: HttpStatus.OK,
        method: 'DELETE',
        message: 'Categoria deletada com sucesso.',
        path: `/categories/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to delete category | Error: ${error.message}`);

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
          message: 'Erro ao deletar categoria.',
          error: error.message,
          path: `/categories/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
