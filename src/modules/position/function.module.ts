// backend/src/modules/function/function.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FunctionController } from './function.controller';
import { FunctionService } from './function.service';
import { Function } from '@database/entities/function/function.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Function])],
  controllers: [FunctionController],
  providers: [FunctionService],
  exports: [FunctionService],
})
export class FunctionModule {}
