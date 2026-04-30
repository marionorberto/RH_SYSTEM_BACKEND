// backend/src/database/seeds/index.ts
import { DataSource } from 'typeorm';
import { seedUsers } from './user.seed';
import { seedFunctions } from './function.seed';
import { seedDepartaments } from './departament.seed';

export async function runSeeds(dataSource: DataSource) {
  try {
    console.log('🌱 Starting database seeds...');
    await seedUsers(dataSource);
    await seedFunctions(dataSource);
    await seedDepartaments(dataSource);
    console.log('✅ All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    throw error;
  }
}
