// backend/src/modules/nacionality/nacionality.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NacionalityController } from './nacionality.controller';
import { NacionalityService } from './nacionality.service';
import { Nacionality } from '@database/entities/nacionality/nacionality.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Nacionality])],
  controllers: [NacionalityController],
  providers: [NacionalityService],
  exports: [NacionalityService],
})
export class NacionalityModule {}
