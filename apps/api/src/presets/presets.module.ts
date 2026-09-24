import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelsModule } from '../models/models.module.js';
import { ModelPresetEntity } from './model-preset.entity.js';
import { PresetsController } from './presets.controller.js';
import { PresetsService } from './presets.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ModelPresetEntity]), ModelsModule],
  controllers: [PresetsController],
  providers: [PresetsService],
  exports: [PresetsService],
})
export class PresetsModule {}
