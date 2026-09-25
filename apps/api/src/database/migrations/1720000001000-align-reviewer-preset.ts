import type { MigrationInterface, QueryRunner } from 'typeorm';

const LEGACY_REVIEW_MODEL_ID = '10000000-0000-4000-8000-000000000002';
const DEEPSEEK_REVIEW_MODEL_ID = '10000000-0000-4000-8000-000000000003';
const LEGACY_REVIEW_DESCRIPTION = 'Code and change review.';
const DEEPSEEK_REVIEW_DESCRIPTION = 'Independent code and change review through the NovaWing DeepSeek/Claude CLI route.';

interface ReviewPresetRow {
  name: string;
  model_id: string;
  reasoning_level: string | null;
  enabled: boolean;
  description: string | null;
}

function isLegacyStarterReviewPreset(value: ReviewPresetRow | undefined): boolean {
  return value?.name === 'Review'
    && value.model_id === LEGACY_REVIEW_MODEL_ID
    && value.reasoning_level === 'medium'
    && value.enabled === true
    && value.description === LEGACY_REVIEW_DESCRIPTION;
}

export class AlignReviewerPreset1720000001000 implements MigrationInterface {
  name = 'AlignReviewerPreset1720000001000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "models"
        ("id", "provider", "model_id", "display_name", "enabled", "supports_reasoning", "reasoning_levels", "default_reasoning_level", "description", "sort_order")
      VALUES
        ('${DEEPSEEK_REVIEW_MODEL_ID}', 'deepseek', 'sonnet', 'DeepSeek route alias: sonnet', true, false, '[]', NULL, 'Runtime alias used by NovaWing through its DeepSeek-backed Claude CLI route; not a DeepSeek model name.', 30)
      ON CONFLICT DO NOTHING
    `);

    const rows = await queryRunner.query(`
      SELECT "name", "model_id", "reasoning_level", "enabled", "description"
      FROM "model_presets"
      WHERE "key" = 'review'
    `) as ReviewPresetRow[];

    if (isLegacyStarterReviewPreset(rows[0])) {
      await queryRunner.query(`
        UPDATE "model_presets"
        SET "model_id" = '${DEEPSEEK_REVIEW_MODEL_ID}',
            "reasoning_level" = NULL,
            "description" = '${DEEPSEEK_REVIEW_DESCRIPTION}',
            "updated_at" = now()
        WHERE "key" = 'review'
          AND "name" = 'Review'
          AND "model_id" = '${LEGACY_REVIEW_MODEL_ID}'
          AND "reasoning_level" = 'medium'
          AND "enabled" = true
          AND "description" = '${LEGACY_REVIEW_DESCRIPTION}'
      `);
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE "model_presets"
      SET "model_id" = '${LEGACY_REVIEW_MODEL_ID}',
          "reasoning_level" = 'medium',
          "description" = '${LEGACY_REVIEW_DESCRIPTION}',
          "updated_at" = now()
      WHERE "key" = 'review'
        AND "name" = 'Review'
        AND "model_id" = '${DEEPSEEK_REVIEW_MODEL_ID}'
        AND "reasoning_level" IS NULL
        AND "enabled" = true
        AND "description" = '${DEEPSEEK_REVIEW_DESCRIPTION}'
    `);
    await queryRunner.query(`
      DELETE FROM "models"
      WHERE "id" = '${DEEPSEEK_REVIEW_MODEL_ID}'
        AND NOT EXISTS (SELECT 1 FROM "model_presets" WHERE "model_id" = '${DEEPSEEK_REVIEW_MODEL_ID}')
    `);
  }
}
