import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ModelEntity } from '../models/model.entity.js';
import type { ReasoningLevel } from '../models/reasoning-level.js';

@Entity({ name: 'model_presets' })
export class ModelPresetEntity {
  @PrimaryColumn({ type: 'varchar', length: 64 })
  key: string;

  @Column({ type: 'varchar', length: 128 })
  name: string;

  @Column({ name: 'model_id', type: 'uuid' })
  modelId: string;

  @ManyToOne(() => ModelEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'model_id' })
  model: ModelEntity;

  @Column({ name: 'reasoning_level', type: 'varchar', length: 16, nullable: true })
  reasoningLevel: ReasoningLevel | null;

  @Column({ type: 'boolean', default: true })
  enabled: boolean;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
