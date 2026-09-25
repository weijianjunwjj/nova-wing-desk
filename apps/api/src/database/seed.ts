import type { DataSource } from 'typeorm';

export async function seedDatabase(database: DataSource): Promise<void> {
  await database.query(`
    INSERT INTO "models"
      ("id", "provider", "model_id", "display_name", "enabled", "supports_reasoning", "reasoning_levels", "default_reasoning_level", "description", "sort_order")
    VALUES
      ('10000000-0000-4000-8000-000000000001', 'openai', 'gpt-6-luna', 'GPT-6 Luna', true, true, '["low", "medium", "high"]', 'low', 'Editable starter configuration for economical everyday work.', 10),
      ('10000000-0000-4000-8000-000000000002', 'openai', 'gpt-6-sol', 'GPT-6 Sol', true, true, '["low", "medium", "high", "xhigh"]', 'medium', 'Editable starter configuration for demanding implementation and review.', 20),
      ('10000000-0000-4000-8000-000000000003', 'deepseek', 'sonnet', 'DeepSeek route alias: sonnet', true, false, '[]', NULL, 'Runtime alias used by NovaWing through its DeepSeek-backed Claude CLI route; not a DeepSeek model name.', 30)
    ON CONFLICT DO NOTHING
  `);
  await database.query(`
    INSERT INTO "model_presets" ("key", "name", "model_id", "reasoning_level", "enabled", "description")
    VALUES
      ('default', 'Default', '10000000-0000-4000-8000-000000000001', 'low', true, 'General NovaWing tasks.'),
      ('planning', 'Planning', '10000000-0000-4000-8000-000000000002', 'high', true, 'Architecture and execution planning.'),
      ('implementation', 'Implementation', '10000000-0000-4000-8000-000000000001', 'low', true, 'Routine implementation work.'),
      ('review', 'Review', '10000000-0000-4000-8000-000000000003', NULL, true, 'Independent code and change review through the NovaWing DeepSeek/Claude CLI route.'),
      ('economy', 'Economy', '10000000-0000-4000-8000-000000000001', 'low', true, 'Cost-sensitive work.')
    ON CONFLICT DO NOTHING
  `);
}
