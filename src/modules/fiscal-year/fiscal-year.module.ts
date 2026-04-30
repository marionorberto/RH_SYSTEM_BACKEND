// backend/src/modules/fiscal-year/fiscal-year.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiscalYearController } from './fiscal-year.controller';
import { FiscalYearService } from './fiscal-year.service';
import { FiscalYear } from '@database/entities/fiscal-year/fiscal-year.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FiscalYear])],
  controllers: [FiscalYearController],
  providers: [FiscalYearService],
  exports: [FiscalYearService],
})
export class FiscalYearModule {}
