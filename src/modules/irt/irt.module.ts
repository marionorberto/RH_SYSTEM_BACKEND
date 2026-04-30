// backend/src/modules/irt/irt.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrtController } from './irt.controller';
import { IrtService } from './irt.service';
import { Irt } from '@database/entities/irt/irt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Irt])],
  controllers: [IrtController],
  providers: [IrtService],
  exports: [IrtService],
})
export class IrtModule {}
