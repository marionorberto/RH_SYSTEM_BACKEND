// backend/src/modules/company-data/company-data.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyDataController } from './company-data.controller';
import { CompanyDataService } from './company-data.service';
import { CompanyData } from '@database/entities/company-data/company-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyData])],
  controllers: [CompanyDataController],
  providers: [CompanyDataService],
  exports: [CompanyDataService],
})
export class CompanyDataModule {}
