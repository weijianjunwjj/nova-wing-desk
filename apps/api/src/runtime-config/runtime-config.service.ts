import { Injectable } from '@nestjs/common';
import { ModelsService } from '../models/models.service.js';
import { PresetsService } from '../presets/presets.service.js';
import type { RuntimeConfigDto } from './runtime-config.dto.js';

@Injectable()
export class RuntimeConfigService {
  constructor(
    private readonly models: ModelsService,
    private readonly presets: PresetsService,
  ) {}

  async getConfig(): Promise<RuntimeConfigDto> {
    const [models, presets] = await Promise.all([
      this.models.findEnabled(),
      this.presets.findEnabled(),
    ]);
    const enabledModelIds = new Set(models.map((model) => model.id));

    return {
      version: 1,
      models: models.map((model) => ({
        provider: model.provider,
        model: model.modelId,
        displayName: model.displayName,
        supportsReasoning: model.supportsReasoning,
        reasoningLevels: model.reasoningLevels,
        defaultReasoningLevel: model.defaultReasoningLevel,
      })),
      presets: Object.fromEntries(
        presets
          .filter((preset) => enabledModelIds.has(preset.modelId))
          .map((preset) => [
            preset.key,
            { model: preset.model.modelId, reasoningLevel: preset.reasoningLevel },
          ]),
      ),
    };
  }
}
