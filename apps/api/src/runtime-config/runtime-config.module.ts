import { Module } from '@nestjs/common';
import { ModelsModule } from '../models/models.module.js';
import { PresetsModule } from '../presets/presets.module.js';
import { RuntimeConfigController } from './runtime-config.controller.js';
import { RuntimeConfigService } from './runtime-config.service.js';

@Module({
  imports: [ModelsModule, PresetsModule],
  controllers: [RuntimeConfigController],
  providers: [RuntimeConfigService],
})
export class RuntimeConfigModule {}
