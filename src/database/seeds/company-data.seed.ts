// backend/src/database/seeds/company-data.seed.ts
import { DataSource } from 'typeorm';
import { CompanyData } from '../entities/company-data/company-data.entity';

export async function seedCompanyData(dataSource: DataSource) {
  const companyDataRepository = dataSource.getRepository(CompanyData);

  // Verificar se já existe dados da empresa
  const existingData = await companyDataRepository.findOne({ where: {} });

  if (existingData) {
    console.log('ℹ️ Dados da empresa já existem. Pulando seed...');
    return existingData;
  }

  const companyData = {
    companyName: 'Versatile Solution',
    companyNIF: '5417232452',
    tickectModel: 'Modelo Padrão RH',
    smtpEmail: 'noreply@versatilesolution.co.ao',
    smtpPassword: 'smtp_password_placeholder',
    SocialSecurityPassword: 'seg_social_123',
    corporativeEmail: 'geral@versatilesolution.co.ao',
    linkedin: 'https://www.linkedin.com/company/versatilesolution',
    whatsapp: '+244923456789',
    instagram: 'https://www.instagram.com/versatilesolution',
    phone1: '+244222123456',
    phone2: '+244923456788',
    street: 'Rua da Missão, 123',
    neighbourhood: 'Centro Empresarial',
    houseNumber: '45',
    fax: '+244222123457',
    postalCode: '1234-567',
    note: 'Empresa especializada em gestão de recursos humanos e nutrição',
  };

  const savedCompanyData = companyDataRepository.create(companyData);
  await companyDataRepository.save(savedCompanyData);

  console.log('✅ Dados da empresa criados com sucesso!');
  return savedCompanyData;
}
