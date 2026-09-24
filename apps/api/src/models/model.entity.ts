import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { ReasoningLevel } from './reasoning-level.js';

@Entity({ name: 'models' })
export class ModelEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 64 })
  provider: string;

  @Column({ name: 'model_id', type: 'varchar', length: 128, unique: true })
  modelId: string;

  @Column({ name: 'display_name', type: 'varchar', length: 128 })
  displayName: string;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;

  @Column({ name: 'supports_reasoning', type: 'boolean', default: false })
  supportsReasoning: boolean;

  @Column({ name: 'reasoning_levels', type: 'jsonb', default: () => "'[]'::jsonb" })
  reasoningLevels: ReasoningLevel[];

  @Column({ name: 'default_reasoning_level', type: 'varchar', length: 16, nullable: true })
  defaultReasoningLevel: ReasoningLevel | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'sort_order', type: 'integer', default: 0 })
  sortOrder: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
