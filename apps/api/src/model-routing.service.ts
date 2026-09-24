import { ConflictException, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigRecord } from './config-record.entity.js';
import { DEFAULT_MODEL_ROUTING, type ModelRoutingSettings, type ModelRoutingUpdate } from './model-routing.js';

const CONFIG_KEY = 'model-routing';

export type ModelRoutingDocument = ModelRoutingSettings & {
  revision: number;
  updatedAt: string | null;
};

@Injectable()
export class ModelRoutingService implements OnApplicationShutdown {
  constructor(private readonly database: DataSource) {}

  async get(): Promise<ModelRoutingDocument> {
    const record = await this.database.getRepository(ConfigRecord).findOneBy({ key: CONFIG_KEY });
    if (!record) return { ...DEFAULT_MODEL_ROUTING, revision: 0, updatedAt: null };
    return { ...record.value, revision: record.revision, updatedAt: record.updatedAt.toISOString() };
  }

  async update(input: ModelRoutingUpdate): Promise<ModelRoutingDocument> {
    const { expectedRevision, selectedProfile, profiles } = input;
    // Insert a revision-0 row on the first write, then use one atomic compare-and-swap
    // UPDATE. Concurrent writers cannot both commit the same expected revision.
    const updated = await this.database.transaction(async (manager) => {
      if (expectedRevision === 0) {
        await manager.query(
          'INSERT INTO "desk_config" ("key", "value", "revision") VALUES ($1, $2::jsonb, 0) ON CONFLICT ("key") DO NOTHING',
          [CONFIG_KEY, JSON.stringify(DEFAULT_MODEL_ROUTING)],
        );
      }
      const rows = (await manager.query(
        'UPDATE "desk_config" SET "value" = $1::jsonb, "revision" = "revision" + 1, "updated_at" = now() WHERE "key" = $2 AND "revision" = $3 RETURNING "revision", "updated_at"',
        [JSON.stringify({ selectedProfile, profiles }), CONFIG_KEY, expectedRevision],
      )) as Array<{ revision: number; updated_at: Date }>;
      if (rows.length !== 1) throw new ConflictException('Configuration changed. Reload before saving.');
      return rows[0];
    });
    return { selectedProfile, profiles, revision: updated.revision, updatedAt: updated.updated_at.toISOString() };
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.database.isInitialized) await this.database.destroy();
  }
}
