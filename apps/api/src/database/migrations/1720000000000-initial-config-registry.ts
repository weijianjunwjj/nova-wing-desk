import type { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialConfigRegistry1720000000000 implements MigrationInterface {
  name = 'InitialConfigRegistry1720000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "models" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "provider" varchar(64) NOT NULL,
        "model_id" varchar(128) NOT NULL,
        "display_name" varchar(128) NOT NULL,
        "enabled" boolean NOT NULL DEFAULT true,
        "supports_reasoning" boolean NOT NULL DEFAULT false,
        "reasoning_levels" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "default_reasoning_level" varchar(16),
        "description" text,
        "sort_order" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_models" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_models_model_id" UNIQUE ("model_id")
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "model_presets" (
        "key" varchar(64) NOT NULL,
        "name" varchar(128) NOT NULL,
        "model_id" uuid NOT NULL,
        "reasoning_level" varchar(16),
        "enabled" boolean NOT NULL DEFAULT true,
        "description" text,
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_model_presets" PRIMARY KEY ("key"),
        CONSTRAINT "FK_model_presets_model" FOREIGN KEY ("model_id") REFERENCES "models"("id") ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(`
      INSERT INTO "models"
        ("id", "provider", "model_id", "display_name", "enabled", "supports_reasoning", "reasoning_levels", "default_reasoning_level", "description", "sort_order")
      VALUES
        ('10000000-0000-4000-8000-000000000001', 'openai', 'gpt-6-luna', 'GPT-6 Luna', true, true, '["low", "medium", "high"]', 'low', 'Editable starter configuration for economical everyday work.', 10),
        ('10000000-0000-4000-8000-000000000002', 'openai', 'gpt-6-sol', 'GPT-6 Sol', true, true, '["low", "medium", "high", "xhigh"]', 'medium', 'Editable starter configuration for demanding implementation and review.', 20),
        ('10000000-0000-4000-8000-000000000003', 'deepseek', 'sonnet', 'DeepSeek route alias: sonnet', true, false, '[]', NULL, 'Runtime alias used by NovaWing through its DeepSeek-backed Claude CLI route; not a DeepSeek model name.', 30)
    `);
    await queryRunner.query(`
      INSERT INTO "model_presets" ("key", "name", "model_id", "reasoning_level", "enabled", "description")
      VALUES
        ('default', 'Default', '10000000-0000-4000-8000-000000000001', 'low', true, 'General NovaWing tasks.'),
        ('planning', 'Planning', '10000000-0000-4000-8000-000000000002', 'high', true, 'Architecture and execution planning.'),
        ('implementation', 'Implementation', '10000000-0000-4000-8000-000000000001', 'low', true, 'Routine implementation work.'),
        ('review', 'Review', '10000000-0000-4000-8000-000000000003', NULL, true, 'Independent code and change review through the NovaWing DeepSeek/Claude CLI route.'),
        ('economy', 'Economy', '10000000-0000-4000-8000-000000000001', 'low', true, 'Cost-sensitive work.')
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "model_presets"');
    await queryRunner.query('DROP TABLE "models"');
  }
}
