import { BadRequestException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import { describe, expect, it, vi } from 'vitest';
import { ModelEntity } from './model.entity.js';
import { ModelsService } from './models.service.js';

function repository() {
  return {
    create: vi.fn((value) => value),
    save: vi.fn(async (value) => value),
    find: vi.fn(),
    findOneBy: vi.fn(),
    merge: vi.fn((target, source) => Object.assign(target, source)),
  } as unknown as Repository<ModelEntity>;
}

describe('ModelsService', () => {
  it('creates a valid model with defaults', async () => {
    const repo = repository();
    const service = new ModelsService(repo);
    const result = await service.create({
      provider: 'openai',
      modelId: 'test-model',
      displayName: 'Test Model',
    });
    expect(result.enabled).toBe(true);
    expect(result.reasoningLevels).toEqual([]);
    expect(repo.save).toHaveBeenCalledOnce();
  });

  it('rejects an invalid default reasoning level', async () => {
    const service = new ModelsService(repository());
    await expect(
      service.create({
        provider: 'openai',
        modelId: 'test-model',
        displayName: 'Test Model',
        supportsReasoning: true,
        reasoningLevels: ['low'],
        defaultReasoningLevel: 'high',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
