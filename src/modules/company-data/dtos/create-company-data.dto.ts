// backend/src/modules/company-data/dtos/create-company-data.dto.ts
import {
  IsString,
  IsOptional,
  MaxLength,
  IsEmail,
  IsUrl,
  IsNumberString,
} from 'class-validator';

export class CreateCompanyDataDto {
  @MaxLength(255, {
    message: 'O nome da empresa deve ter no máximo 255 caracteres!',
  })
  @IsString({ message: 'O nome da empresa deve ser texto' })
  companyName: string;

  @MaxLength(20, { message: 'O NIF deve ter no máximo 20 caracteres!' })
  @IsString({ message: 'O NIF deve ser texto' })
  companyNIF: string;

  @MaxLength(100, {
    message: 'O modelo de recibo deve ter no máximo 100 caracteres!',
  })
  @IsString({ message: 'O modelo de recibo deve ser texto' })
  @IsOptional()
  tickectModel?: string;

  @MaxLength(255, {
    message: 'O email SMTP deve ter no máximo 255 caracteres!',
  })
  @IsEmail({}, { message: 'Por favor introduza um email SMTP válido!' })
  @IsOptional()
  smtpEmail?: string;

  @MaxLength(255, {
    message: 'A password SMTP deve ter no máximo 255 caracteres!',
  })
  @IsString({ message: 'A password SMTP deve ser texto' })
  @IsOptional()
  smtpPassword?: string;

  @MaxLength(50, {
    message: 'O número de segurança social deve ter no máximo 50 caracteres!',
  })
  @IsString({ message: 'O número de segurança social deve ser texto' })
  @IsOptional()
  SocialSecurityPassword?: string;

  @MaxLength(255, {
    message: 'O email corporativo deve ter no máximo 255 caracteres!',
  })
  @IsEmail({}, { message: 'Por favor introduza um email corporativo válido!' })
  @IsOptional()
  corporativeEmail?: string;

  @MaxLength(255, { message: 'O LinkedIn deve ter no máximo 255 caracteres!' })
  @IsUrl({}, { message: 'Por favor introduza uma URL válida para o LinkedIn!' })
  @IsOptional()
  linkedin?: string;

  @MaxLength(20, { message: 'O WhatsApp deve ter no máximo 20 caracteres!' })
  @IsNumberString({}, { message: 'O WhatsApp deve conter apenas números!' })
  @IsOptional()
  whatsapp?: string;

  @MaxLength(255, { message: 'O Instagram deve ter no máximo 255 caracteres!' })
  @IsUrl(
    {},
    { message: 'Por favor introduza uma URL válida para o Instagram!' },
  )
  @IsOptional()
  instagram?: string;

  @MaxLength(20, { message: 'O telefone deve ter no máximo 20 caracteres!' })
  @IsNumberString({}, { message: 'O telefone deve conter apenas números!' })
  @IsOptional()
  phone1?: string;

  @MaxLength(20, { message: 'O telefone 2 deve ter no máximo 20 caracteres!' })
  @IsNumberString({}, { message: 'O telefone 2 deve conter apenas números!' })
  @IsOptional()
  phone2?: string;

  @MaxLength(255, { message: 'A rua deve ter no máximo 255 caracteres!' })
  @IsString({ message: 'A rua deve ser texto' })
  @IsOptional()
  street?: string;

  @MaxLength(255, { message: 'O bairro deve ter no máximo 255 caracteres!' })
  @IsString({ message: 'O bairro deve ser texto' })
  @IsOptional()
  neighbourhood?: string;

  @MaxLength(50, {
    message: 'O número da casa deve ter no máximo 50 caracteres!',
  })
  @IsString({ message: 'O número da casa deve ser texto' })
  @IsOptional()
  houseNumber?: string;

  @MaxLength(20, { message: 'O fax deve ter no máximo 20 caracteres!' })
  @IsNumberString({}, { message: 'O fax deve conter apenas números!' })
  @IsOptional()
  fax?: string;

  @IsString({ message: 'O logotipo deve ser texto (base64)' })
  @IsOptional()
  logotipo64?: string;

  @MaxLength(20, {
    message: 'O código postal deve ter no máximo 20 caracteres!',
  })
  @IsString({ message: 'O código postal deve ser texto' })
  @IsOptional()
  postalCode?: string;

  @IsString({ message: 'As notas devem ser texto' })
  @IsOptional()
  note?: string;
}
