import { describe, expect, it, vi } from 'vitest';
import { ModelEntity } from '../models/model.entity.js';
import type { ModelsService } from '../models/models.service.js';
import { ModelPresetEntity } from '../presets/model-preset.entity.js';
import type { PresetsService } from '../presets/presets.service.js';
import { RuntimeConfigService } from './runtime-config.service.js';

function makeModel(id: string, modelId: string, enabled: boolean) {
  return Object.assign(new ModelEntity(), {
    id, provider: 'openai', modelId, displayName: modelId, enabled,
    supportsReasoning: true, reasoningLevels: ['low'], defaultReasoningLevel: 'low',
  });
}

describe('RuntimeConfigService', () => {
  it('aggregates enabled models and filters presets whose model is disabled', async () => {
    const enabled = makeModel('10000000-0000-4000-8000-000000000001', 'enabled-model', true);
    const disabled = makeModel('20000000-0000-4000-8000-000000000002', 'disabled-model', false);
    const presets = [
      Object.assign(new ModelPresetEntity(), { key: 'default', modelId: enabled.id, model: enabled, enabled: true, reasoningLevel: 'low' }),
      Object.assign(new ModelPresetEntity(), { key: 'review', modelId: disabled.id, model: disabled, enabled: true, reasoningLevel: 'low' }),
    ];
    const modelsService = { findEnabled: vi.fn(async () => [enabled]) } as unknown as ModelsService;
    const presetsService = { findEnabled: vi.fn(async () => presets) } as unknown as PresetsService;
    const result = await new RuntimeConfigService(modelsService, presetsService).getConfig();

    expect(result.version).toBe(1);
    expect(result.models.map((item) => item.model)).toEqual(['enabled-model']);
    expect(result.presets).toEqual({ default: { model: 'enabled-model', reasoningLevel: 'low' } });
    expect(result.presets.review).toBeUndefined();
  });

  it('publishes the DeepSeek reviewer runtime alias without reasoning', async () => {
    const reviewer = Object.assign(new ModelEntity(), {
      id: '10000000-0000-4000-8000-000000000003',
      provider: 'deepseek', modelId: 'sonnet', displayName: 'DeepSeek route alias: sonnet', enabled: true,
      supportsReasoning: false, reasoningLevels: [], defaultReasoningLevel: null,
    });
    const presets = [Object.assign(new ModelPresetEntity(), {
      key: 'review', modelId: reviewer.id, model: reviewer, enabled: true, reasoningLevel: null,
    })];
    const modelsService = { findEnabled: vi.fn(async () => [reviewer]) } as unknown as ModelsService;
    const presetsService = { findEnabled: vi.fn(async () => presets) } as unknown as PresetsService;

    const result = await new RuntimeConfigService(modelsService, presetsService).getConfig();

    expect(result.models).toEqual([{
      provider: 'deepseek', model: 'sonnet', displayName: 'DeepSeek route alias: sonnet',
      supportsReasoning: false, reasoningLevels: [], defaultReasoningLevel: null,
    }]);
    expect(result.presets.review).toEqual({ model: 'sonnet', reasoningLevel: null });
  });
});
