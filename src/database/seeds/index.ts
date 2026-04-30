// backend/src/database/seeds/index.ts
import { DataSource } from 'typeorm';
import { seedUsers } from './user.seed';
import { seedFunctions } from './function.seed';
import { seedDepartaments } from './departament.seed';
import { seedCompanyData } from './company-data.seed';
import { seedNacionalities } from './nacionallity.seed';
import { seedIrt } from './irt.seed';
import { seedBanks } from './bank.seed';
import { seedFiscalYears } from './fiscal-year.seed';

export async function runSeeds(dataSource: DataSource) {
  try {
    console.log('🌱 Starting database seeds...');
    await seedFunctions(dataSource);
    await seedDepartaments(dataSource);
    await seedCompanyData(dataSource);
    await seedNacionalities(dataSource);
    await seedIrt(dataSource);
    await seedBanks(dataSource);
    await seedFiscalYears(dataSource);
    await seedUsers(dataSource);
    console.log('✅ All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    throw error;
  }
}
