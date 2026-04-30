// backend/src/modules/departament/departament.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartamentController } from './departament.controller';
import { DepartamentService } from './departament.service';
import { Departament } from '@database/entities/departament/departament.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Departament])],
  controllers: [DepartamentController],
  providers: [DepartamentService],
  exports: [DepartamentService],
})
export class DepartamentModule {}
