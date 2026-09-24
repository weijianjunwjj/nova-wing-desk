import { BadRequestException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { describe, expect, it, vi } from 'vitest';
import { ModelEntity } from '../models/model.entity.js';
import type { ModelsService } from '../models/models.service.js';
import { ModelPresetEntity } from './model-preset.entity.js';
import { PresetsService } from './presets.service.js';

const model = Object.assign(new ModelEntity(), {
  id: '10000000-0000-4000-8000-000000000001', modelId: 'gpt-test', enabled: true,
  supportsReasoning: true, reasoningLevels: ['low'], defaultReasoningLevel: 'low',
});

function presetRepository() {
  return {
    findOneBy: vi.fn(async () => Object.assign(new ModelPresetEntity(), {
      key: 'implementation', modelId: model.id, model, enabled: true, reasoningLevel: 'low',
    })),
    merge: vi.fn((target, source) => Object.assign(target, source)),
    save: vi.fn(async (value) => value),
  } as unknown as Repository<ModelPresetEntity>;
}

describe('PresetsService', () => {
  it('updates a preset to a valid model policy', async () => {
    const models = { findOne: vi.fn(async () => model) } as unknown as ModelsService;
    const service = new PresetsService(presetRepository(), models);
    const result = await service.update('implementation', { reasoningLevel: 'low' });
    expect(result.modelId).toBe(model.id);
  });

  it('does not allow a preset to reference a missing model', async () => {
    const models = {
      findOne: vi.fn(async () => { throw new NotFoundException(); }),
    } as unknown as ModelsService;
    const service = new PresetsService(presetRepository(), models);
    await expect(service.update('implementation', {
      modelId: '20000000-0000-4000-8000-000000000002',
    })).rejects.toBeInstanceOf(NotFoundException);
  });

  it('rejects a reasoning level unsupported by the selected model', async () => {
    const models = { findOne: vi.fn(async () => model) } as unknown as ModelsService;
    const service = new PresetsService(presetRepository(), models);
    await expect(service.update('implementation', { reasoningLevel: 'high' }))
      .rejects.toBeInstanceOf(BadRequestException);
  });
});
