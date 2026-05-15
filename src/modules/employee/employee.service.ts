// backend/src/modules/employee/employee.service.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { UpdateEmployeeDto } from './dtos/update-employee.dto';
import { Employee } from '@database/entities/employee/employee.entity';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async findAll() {
    try {
      const employees = await this.employeeRepository.find({
        relations: ['nacionality', 'function', 'category', 'bank', 'user'],
        order: {
          employee_name: 'ASC',
        },
      });

      // Adicionar flag hasUser
      const employeesWithFlag = employees.map(emp => ({
        ...emp,
        hasUser: !!emp.user,
      }));

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Funcionários listados com sucesso.',
        data: employeesWithFlag,
        path: '/employees',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch employees | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar funcionários.',
          error: error.message,
          path: '/employees',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findWithoutUser() {
    try {
      const employees = await this.employeeRepository.find({
        relations: ['nacionality', 'function', 'category', 'bank', 'user'],
        where: {
          user: null, // Apenas funcionários sem usuário associado
        },
        order: {
          employee_name: 'ASC',
        },
      });

      const employeesWithFlag = employees.map(emp => ({
        ...emp,
        hasUser: false,
      }));

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Funcionários sem usuário listados com sucesso.',
        data: employeesWithFlag,
        path: '/employees/without-user',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch employees without user | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar funcionários sem usuário.',
          error: error.message,
          path: '/employees/without-user',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllPaginated(page: number = 1, limit: number = 10, search?: string) {
    try {
      const skip = (page - 1) * limit;
      
      const whereCondition: any = {};
      if (search && search.trim() !== '') {
        whereCondition.employee_name = Like(`%${search}%`);
      }

      const [employees, total] = await this.employeeRepository.findAndCount({
        where: whereCondition,
        relations: ['nacionality', 'function', 'category', 'bank', 'user'],
        order: {
          employee_name: 'ASC',
        },
        skip,
        take: limit,
      });

      const employeesWithFlag = employees.map(emp => ({
        ...emp,
        hasUser: !!emp.user,
      }));

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Funcionários listados com sucesso.',
        data: {
          items: employeesWithFlag,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        path: '/employees/paginated',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch employees | Error: ${error.message}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao listar funcionários.',
          error: error.message,
          path: '/employees/paginated',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { id },
        relations: ['nacionality', 'function', 'category', 'bank', 'user'],
      });

      if (!employee) {
        throw new NotFoundException(`Funcionário com ID ${id} não encontrado`);
      }

      const employeeWithFlag = {
        ...employee,
        hasUser: !!employee.user,
      };

      return {
        statusCode: HttpStatus.OK,
        method: 'GET',
        message: 'Funcionário encontrado com sucesso.',
        data: employeeWithFlag,
        path: `/employees/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to fetch employee | Error: ${error.message}`);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'GET',
          message: 'Erro ao buscar funcionário.',
          error: error.message,
          path: `/employees/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      // Verificar se já existe funcionário com o mesmo email
      if (createEmployeeDto.email) {
        const existingEmployee = await this.employeeRepository.findOne({
          where: { email: createEmployeeDto.email },
        });

        if (existingEmployee) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              method: 'POST',
              message: `Já existe um funcionário com o email "${createEmployeeDto.email}".`,
              path: '/employees',
              timestamp: Date.now(),
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      // Mapear os campos do DTO para a entidade
      const employeeData = {
        employee_name: createEmployeeDto.employee_name,
        fatherName: createEmployeeDto.fatherName,
        motherName: createEmployeeDto.motherName,
        birthday: createEmployeeDto.birthday ? new Date(createEmployeeDto.birthday) : null,
        gender: createEmployeeDto.gender,
        civilState: createEmployeeDto.civilState,
        idNacionality: createEmployeeDto.nationalityId,
        typeDoc1: createEmployeeDto.typeDoc1,
        docNumber1: createEmployeeDto.docNumber1,
        typeDoc2: createEmployeeDto.typeDoc2,
        docNumber2: createEmployeeDto.docNumber2,
        academic_level: createEmployeeDto.academic_level,
        telefone1: createEmployeeDto.telefone1,
        telefone2: createEmployeeDto.telefone2,
        email: createEmployeeDto.email,
        linkedin: createEmployeeDto.linkedin,
        whatsapp: createEmployeeDto.whatsapp,
        instagram: createEmployeeDto.instagram,
        street: createEmployeeDto.street,
        neighbourhood: createEmployeeDto.neighbourhood,
        houseNumber: createEmployeeDto.houseNumber,
        idFunction: createEmployeeDto.functionId,
        idCategory: createEmployeeDto.categoryId,
        idBank: createEmployeeDto.bankId,
        numSegsocial: createEmployeeDto.numSegsocial,
        numContaBanc: createEmployeeDto.numContaBanc,
        iBanknta: createEmployeeDto.iBanknta,
        estado: createEmployeeDto.estado !== undefined ? createEmployeeDto.estado : true,
      };

      const newEmployee = this.employeeRepository.create(employeeData);
      const savedEmployee = await this.employeeRepository.save(newEmployee);

      // Buscar o funcionário salvo com as relações
      const employeeWithRelations = await this.employeeRepository.findOne({
        where: { id: savedEmployee.id },
        relations: ['nacionality', 'function', 'category', 'bank', 'user'],
      });

      return {
        statusCode: HttpStatus.CREATED,
        method: 'POST',
        message: 'Funcionário criado com sucesso.',
        data: {
          ...employeeWithRelations,
          hasUser: false,
        },
        path: '/employees',
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to create employee | Error: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }
      
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'POST',
          message: 'Erro ao criar funcionário.',
          error: error.message,
          path: '/employees',
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { id },
      });

      if (!employee) {
        throw new NotFoundException(`Funcionário com ID ${id} não encontrado`);
      }

      // Verificar conflito de email se estiver a atualizar
      if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
        const existingEmployee = await this.employeeRepository.findOne({
          where: { email: updateEmployeeDto.email },
        });

        if (existingEmployee) {
          throw new HttpException(
            {
              statusCode: HttpStatus.CONFLICT,
              method: 'PUT',
              message: `Já existe um funcionário com o email "${updateEmployeeDto.email}".`,
              path: `/employees/${id}`,
              timestamp: Date.now(),
            },
            HttpStatus.CONFLICT,
          );
        }
      }

      // Preparar dados para atualização
      const updateData: any = { ...updateEmployeeDto };
      
      if (updateEmployeeDto.birthday) {
        updateData.birthday = new Date(updateEmployeeDto.birthday);
      }
      
      if (updateEmployeeDto.nationalityId) {
        updateData.idNacionality = updateEmployeeDto.nationalityId;
        delete updateData.nationalityId;
      }
      
      if (updateEmployeeDto.functionId) {
        updateData.idFunction = updateEmployeeDto.functionId;
        delete updateData.functionId;
      }
      
      if (updateEmployeeDto.categoryId) {
        updateData.idCategory = updateEmployeeDto.categoryId;
        delete updateData.categoryId;
      }
      
      if (updateEmployeeDto.bankId) {
        updateData.idBank = updateEmployeeDto.bankId;
        delete updateData.bankId;
      }

      await this.employeeRepository.update(id, updateData);
      
      const updatedEmployee = await this.employeeRepository.findOne({
        where: { id },
        relations: ['nacionality', 'function', 'category', 'bank', 'user'],
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'PUT',
        message: 'Funcionário atualizado com sucesso.',
        data: {
          ...updatedEmployee,
          hasUser: !!updatedEmployee.user,
        },
        path: `/employees/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to update employee | Error: ${error.message}`);
      
      if (error instanceof HttpException || error instanceof NotFoundException) {
        throw error;
      }
      
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'PUT',
          message: 'Erro ao atualizar funcionário.',
          error: error.message,
          path: `/employees/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async toggleStatus(id: string) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { id },
      });

      if (!employee) {
        throw new NotFoundException(`Funcionário com ID ${id} não encontrado`);
      }

      await this.employeeRepository.update(id, {
        estado: !employee.estado,
      });

      return {
        statusCode: HttpStatus.OK,
        method: 'PATCH',
        message: `Funcionário ${employee.estado ? 'desativado' : 'ativado'} com sucesso.`,
        path: `/employees/${id}/toggle-status`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to toggle employee status | Error: ${error.message}`);
      
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'PATCH',
          message: 'Erro ao alterar status do funcionário.',
          error: error.message,
          path: `/employees/${id}/toggle-status`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(id: string) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!employee) {
        throw new NotFoundException(`Funcionário com ID ${id} não encontrado`);
      }

      // Verificar se o funcionário tem um usuário associado
      if (employee.user) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            method: 'DELETE',
            message: 'Não é possível deletar este funcionário pois ele possui um usuário associado. Delete primeiro o usuário.',
            path: `/employees/${id}`,
            timestamp: Date.now(),
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.employeeRepository.remove(employee);

      return {
        statusCode: HttpStatus.OK,
        method: 'DELETE',
        message: 'Funcionário deletado com sucesso.',
        path: `/employees/${id}`,
        timestamp: Date.now(),
      };
    } catch (error: any) {
      console.error(`Failed to delete employee | Error: ${error.message}`);
      
      if (error instanceof HttpException || error instanceof NotFoundException) {
        throw error;
      }
      
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          method: 'DELETE',
          message: 'Erro ao deletar funcionário.',
          error: error.message,
          path: `/employees/${id}`,
          timestamp: Date.now(),
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}