import { Column, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import type { ModelRoutingSettings } from './model-routing.js';

@Entity('desk_config')
export class ConfigRecord {
  @PrimaryColumn({ type: 'text' })
  key!: string;

  @Column({ type: 'jsonb' })
  value!: ModelRoutingSettings;

  @Column({ type: 'integer' })
  revision!: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
