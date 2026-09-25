import './env.js';
import { DataSource, type DataSourceOptions } from 'typeorm';
import { InitialConfigRegistry1720000000000 } from './database/migrations/1720000000000-initial-config-registry.js';
import { AlignReviewerPreset1720000001000 } from './database/migrations/1720000001000-align-reviewer-preset.js';
import { ModelEntity } from './models/model.entity.js';
import { ModelPresetEntity } from './presets/model-preset.entity.js';

export function databaseOptions(): DataSourceOptions {
  const connection = process.env.DATABASE_URL
    ? { url: process.env.DATABASE_URL }
    : {
        host: process.env.POSTGRES_HOST ?? '127.0.0.1',
        port: Number(process.env.POSTGRES_PORT ?? 5432),
        username: process.env.POSTGRES_USER ?? 'novawing',
        password: process.env.POSTGRES_PASSWORD ?? 'novawing',
        database: process.env.POSTGRES_DB ?? 'novawing_desk',
      };

  return {
    type: 'postgres',
    ...connection,
    entities: [ModelEntity, ModelPresetEntity],
    migrations: [InitialConfigRegistry1720000000000, AlignReviewerPreset1720000001000],
    synchronize: false,
  };
}

export function createDatabase(): DataSource {
  return new DataSource(databaseOptions());
}
