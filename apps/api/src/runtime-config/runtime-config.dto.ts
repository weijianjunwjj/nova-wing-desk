import type { ReasoningLevel } from '../models/reasoning-level.js';

export interface RuntimeModelDto {
  provider: string;
  model: string;
  displayName: string;
  supportsReasoning: boolean;
  reasoningLevels: ReasoningLevel[];
  defaultReasoningLevel: ReasoningLevel | null;
}

export interface RuntimePresetDto {
  model: string;
  reasoningLevel: ReasoningLevel | null;
}

export interface RuntimeConfigDto {
  version: 1;
  models: RuntimeModelDto[];
  presets: Record<string, RuntimePresetDto>;
}
