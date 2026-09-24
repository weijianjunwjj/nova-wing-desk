import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateModelDto, UpdateModelDto } from './model.dto.js';
import { ModelEntity } from './model.entity.js';

@Injectable()
export class ModelsService {
  constructor(
    @InjectRepository(ModelEntity)
    private readonly models: Repository<ModelEntity>,
  ) {}

  findAll(): Promise<ModelEntity[]> {
    return this.models.find({ order: { sortOrder: 'ASC', displayName: 'ASC' } });
  }

  findEnabled(): Promise<ModelEntity[]> {
    return this.models.find({
      where: { enabled: true },
      order: { sortOrder: 'ASC', displayName: 'ASC' },
    });
  }

  async findOne(id: string): Promise<ModelEntity> {
    const model = await this.models.findOneBy({ id });
    if (!model) throw new NotFoundException(`Model ${id} was not found`);
    return model;
  }

  async create(dto: CreateModelDto): Promise<ModelEntity> {
    this.validateReasoning(dto);
    return this.models.save(
      this.models.create({
        ...dto,
        enabled: dto.enabled ?? true,
        supportsReasoning: dto.supportsReasoning ?? false,
        reasoningLevels: dto.reasoningLevels ?? [],
        defaultReasoningLevel: dto.defaultReasoningLevel ?? null,
        description: dto.description ?? null,
        sortOrder: dto.sortOrder ?? 0,
      }),
    );
  }

  async update(id: string, dto: UpdateModelDto): Promise<ModelEntity> {
    const model = await this.findOne(id);
    const next = this.models.merge(model, dto);
    this.validateReasoning(next);
    return this.models.save(next);
  }

  private validateReasoning(input: {
    supportsReasoning?: boolean;
    reasoningLevels?: string[];
    defaultReasoningLevel?: string | null;
  }): void {
    const levels = input.reasoningLevels ?? [];
    if (!input.supportsReasoning && (levels.length > 0 || input.defaultReasoningLevel)) {
      throw new BadRequestException(
        'A model without reasoning support cannot define reasoning levels',
      );
    }
    if (
      input.supportsReasoning &&
      input.defaultReasoningLevel &&
      !levels.includes(input.defaultReasoningLevel)
    ) {
      throw new BadRequestException('Default reasoning level must be included in reasoningLevels');
    }
  }
}
