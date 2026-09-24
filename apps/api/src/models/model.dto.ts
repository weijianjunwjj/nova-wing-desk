import { Transform, Type } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import type { ModelEntity } from './model.entity.js';
import { REASONING_LEVELS, type ReasoningLevel } from './reasoning-level.js';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateModelDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  provider: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  modelId: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  displayName: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  supportsReasoning?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn(REASONING_LEVELS, { each: true })
  reasoningLevels?: ReasoningLevel[];

  @IsOptional()
  @IsIn(REASONING_LEVELS)
  defaultReasoningLevel?: ReasoningLevel | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export class UpdateModelDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(64)
  provider?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  modelId?: string;

  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  displayName?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  supportsReasoning?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn(REASONING_LEVELS, { each: true })
  reasoningLevels?: ReasoningLevel[];

  @IsOptional()
  @IsIn(REASONING_LEVELS)
  defaultReasoningLevel?: ReasoningLevel | null;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string | null;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;
}

export interface ModelResponseDto {
  id: string;
  provider: string;
  modelId: string;
  displayName: string;
  enabled: boolean;
  supportsReasoning: boolean;
  reasoningLevels: ReasoningLevel[];
  defaultReasoningLevel: ReasoningLevel | null;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export function toModelResponse(model: ModelEntity): ModelResponseDto {
  return {
    id: model.id,
    provider: model.provider,
    modelId: model.modelId,
    displayName: model.displayName,
    enabled: model.enabled,
    supportsReasoning: model.supportsReasoning,
    reasoningLevels: model.reasoningLevels,
    defaultReasoningLevel: model.defaultReasoningLevel,
    description: model.description,
    sortOrder: model.sortOrder,
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}
