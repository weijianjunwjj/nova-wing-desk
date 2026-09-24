import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModelsService } from '../models/models.service.js';
import { ModelPresetEntity } from './model-preset.entity.js';
import { UpdatePresetDto } from './preset.dto.js';

@Injectable()
export class PresetsService {
  constructor(
    @InjectRepository(ModelPresetEntity)
    private readonly presets: Repository<ModelPresetEntity>,
    private readonly models: ModelsService,
  ) {}

  findAll(): Promise<ModelPresetEntity[]> {
    return this.presets.find({ order: { key: 'ASC' } });
  }

  findEnabled(): Promise<ModelPresetEntity[]> {
    return this.presets.find({ where: { enabled: true }, order: { key: 'ASC' } });
  }

  async update(key: string, dto: UpdatePresetDto): Promise<ModelPresetEntity> {
    const preset = await this.presets.findOneBy({ key });
    if (!preset) throw new NotFoundException(`Preset ${key} was not found`);

    const model = await this.models.findOne(dto.modelId ?? preset.modelId);
    const reasoningLevel =
      dto.reasoningLevel === undefined ? preset.reasoningLevel : dto.reasoningLevel;
    const enabled = dto.enabled ?? preset.enabled;

    if (enabled && !model.enabled) {
      throw new BadRequestException('An enabled preset must reference an enabled model');
    }
    if (reasoningLevel && !model.reasoningLevels.includes(reasoningLevel)) {
      throw new BadRequestException(
        `Reasoning level ${reasoningLevel} is not supported by ${model.modelId}`,
      );
    }
    if (!model.supportsReasoning && reasoningLevel) {
      throw new BadRequestException(`${model.modelId} does not support reasoning`);
    }

    const next = this.presets.merge(preset, { ...dto, modelId: model.id, model });
    return this.presets.save(next);
  }
}
