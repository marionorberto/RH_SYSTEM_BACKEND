// backend/src/modules/employee/dtos/create-employee.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsUUID,
  IsBoolean,
  MaxLength,
  MinLength,
  IsEmail,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum GeneroEnum {
  MASCULINO = 'MASCULINO',
  FEMININO = 'FEMININO',
}

export enum EstadoCivilEnum {
  SOLTEIRO = 'SOLTEIRO(A)',
  CASADO = 'CASADO(A)',
  VIUVO = 'VIÚVO(A)',
}

export enum TipoDocumentoEnum {
  BI = 'BI',
  PASSAPORTE = 'PASSAPORTE',
  CARTAO_RESIDENTE = 'CARTAO_RESIDENTE',
  CARTA_CONDUCAO = 'CARTA_CONDUCAO',
}

export enum NivelAcademicoEnum {
  ENSINO_BASE = 'ENSINO_BASE',
  ENSINO_MEDIO = 'ENSINO_MEDIO',
  FREQUENCIA_UNIVERSITARIA = 'FREQUENCIA_UNIVERSITARIA',
  LICENCIADO = 'LICENCIADO',
  MESTRADO = 'MESTRADO',
  DOUTORAMENTO = 'DOUTORAMENTO',
}

export class CreateEmployeeDto {
  @MaxLength(255, { message: 'O nome deve ter no máximo 255 caracteres!' })
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres!' })
  @IsString({ message: 'O nome deve ser texto' })
  @IsNotEmpty({ message: 'O nome do funcionário é obrigatório!' })
  employee_name: string;

  @MaxLength(255, { message: 'O nome do pai deve ter no máximo 255 caracteres!' })
  @IsString({ message: 'O nome do pai deve ser texto' })
  @IsOptional()
  fatherName?: string;

  @MaxLength(255, { message: 'O nome da mãe deve ter no máximo 255 caracteres!' })
  @MinLength(3, { message: 'O nome da mãe deve ter no mínimo 3 caracteres!' })
  @IsString({ message: 'O nome da mãe deve ser texto' })
  @IsNotEmpty({ message: 'O nome da mãe é obrigatório!' })
  motherName: string;

  @IsDateString({}, { message: 'Data de nascimento inválida!' })
  @IsNotEmpty({ message: 'Data de nascimento é obrigatória!' })
  birthday: string;

  @IsEnum(GeneroEnum, { message: 'Gênero inválido!' })
  @IsNotEmpty({ message: 'Gênero é obrigatório!' })
  gender: string;

  @IsEnum(EstadoCivilEnum, { message: 'Estado civil inválido!' })
  @IsOptional()
  civilState?: string;

  @IsUUID(4, { message: 'ID da nacionalidade inválido!' })
  @IsNotEmpty({ message: 'Nacionalidade é obrigatória!' })
  nationalityId: string;

  @IsEnum(TipoDocumentoEnum, { message: 'Tipo de documento 1 inválido!' })
  @IsOptional()
  typeDoc1?: string;

  @MaxLength(100, { message: 'Número do documento 1 deve ter no máximo 100 caracteres!' })
  @IsString({ message: 'Número do documento 1 deve ser texto' })
  @IsOptional()
  docNumber1?: string;

  @IsEnum(TipoDocumentoEnum, { message: 'Tipo de documento 2 inválido!' })
  @IsOptional()
  typeDoc2?: string;

  @MaxLength(100, { message: 'Número do documento 2 deve ter no máximo 100 caracteres!' })
  @IsString({ message: 'Número do documento 2 deve ser texto' })
  @IsOptional()
  docNumber2?: string;

  @IsEnum(NivelAcademicoEnum, { message: 'Nível acadêmico inválido!' })
  @IsOptional()
  academic_level?: string;

  @MaxLength(20, { message: 'Telefone 1 deve ter no máximo 20 caracteres!' })
  @IsString({ message: 'Telefone 1 deve ser texto' })
  @IsOptional()
  telefone1?: string;

  @MaxLength(20, { message: 'Telefone 2 deve ter no máximo 20 caracteres!' })
  @IsString({ message: 'Telefone 2 deve ser texto' })
  @IsOptional()
  telefone2?: string;

  @IsEmail({}, { message: 'Email inválido!' })
  @MaxLength(255, { message: 'Email deve ter no máximo 255 caracteres!' })
  @IsOptional()
  email?: string;

  @MaxLength(255, { message: 'LinkedIn deve ter no máximo 255 caracteres!' })
  @IsOptional()
  linkedin?: string;

  @MaxLength(20, { message: 'WhatsApp deve ter no máximo 20 caracteres!' })
  @IsOptional()
  whatsapp?: string;

  @MaxLength(255, { message: 'Instagram deve ter no máximo 255 caracteres!' })
  @IsOptional()
  instagram?: string;

  @MaxLength(255, { message: 'Rua deve ter no máximo 255 caracteres!' })
  @IsOptional()
  street?: string;

  @MaxLength(255, { message: 'Bairro deve ter no máximo 255 caracteres!' })
  @IsOptional()
  neighbourhood?: string;

  @MaxLength(50, { message: 'Número da casa deve ter no máximo 50 caracteres!' })
  @IsOptional()
  houseNumber?: string;

  @IsUUID(4, { message: 'ID da função inválido!' })
  @IsOptional()
  functionId?: string;

  @IsUUID(4, { message: 'ID da categoria inválido!' })
  @IsOptional()
  categoryId?: string;

  // @IsUUID(4, { message: 'ID do banco inválido!' })
  @IsOptional()
  bankId?: string;

  @MaxLength(50, { message: 'Número de segurança social deve ter no máximo 50 caracteres!' })
  @IsOptional()
  numSegsocial?: string;

  @MaxLength(50, { message: 'Número da conta bancária deve ter no máximo 50 caracteres!' })
  @IsOptional()
  numContaBanc?: string;

  @MaxLength(50, { message: 'IBAN deve ter no máximo 50 caracteres!' })
  @IsOptional()
  iBanknta?: string;

  @IsBoolean({ message: 'Estado deve ser booleano!' })
  @IsOptional()
  estado?: boolean;
}