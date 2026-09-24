import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelEntity } from './model.entity.js';
import { ModelsController } from './models.controller.js';
import { ModelsService } from './models.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ModelEntity])],
  controllers: [ModelsController],
  providers: [ModelsService],
  exports: [ModelsService],
})
export class ModelsModule {}
