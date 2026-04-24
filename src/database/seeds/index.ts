// backend/src/database/seeds/index.ts
import { DataSource } from 'typeorm';
import { seedUsers } from './user.seed';

export async function runSeeds(dataSource: DataSource) {
  try {
    console.log('🌱 Starting database seeds...');
    await seedUsers(dataSource);
    console.log('✅ All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    throw error;
  }
}
