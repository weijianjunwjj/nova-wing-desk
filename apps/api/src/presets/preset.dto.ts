import { Transform } from 'class-transformer';
import { IsBoolean, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import type { ReasoningLevel } from '../models/reasoning-level.js';
import { REASONING_LEVELS } from '../models/reasoning-level.js';
import type { ModelPresetEntity } from './model-preset.entity.js';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class UpdatePresetDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  name?: string;

  @IsOptional()
  @IsUUID()
  modelId?: string;

  @IsOptional()
  @IsIn(REASONING_LEVELS)
  reasoningLevel?: ReasoningLevel | null;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;
}

export interface PresetResponseDto {
  key: string;
  name: string;
  modelId: string;
  model: { id: string; modelId: string; displayName: string; enabled: boolean };
  reasoningLevel: ReasoningLevel | null;
  enabled: boolean;
  description: string | null;
  updatedAt: string;
}

export function toPresetResponse(preset: ModelPresetEntity): PresetResponseDto {
  return {
    key: preset.key,
    name: preset.name,
    modelId: preset.modelId,
    model: {
      id: preset.model.id,
      modelId: preset.model.modelId,
      displayName: preset.model.displayName,
      enabled: preset.model.enabled,
    },
    reasoningLevel: preset.reasoningLevel,
    enabled: preset.enabled,
    description: preset.description,
    updatedAt: preset.updatedAt.toISOString(),
  };
}
