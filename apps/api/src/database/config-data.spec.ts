import { describe, expect, it, vi } from 'vitest';
import type { DataSource, QueryRunner } from 'typeorm';
import { seedDatabase } from './seed.js';
import { AlignReviewerPreset1720000001000 } from './migrations/1720000001000-align-reviewer-preset.js';

const legacyReview = {
  name: 'Review',
  model_id: '10000000-0000-4000-8000-000000000002',
  reasoning_level: 'medium',
  enabled: true,
  description: 'Code and change review.',
};

describe('runtime configuration seed and migration', () => {
  it('seeds the DeepSeek runtime alias and points review at it', async () => {
    const statements: string[] = [];
    const query = vi.fn(async (statement: string) => { statements.push(statement); });
    await seedDatabase({ query } as unknown as DataSource);

    expect(statements).toHaveLength(2);
    expect(statements[0]).toContain("'deepseek', 'sonnet', 'DeepSeek route alias: sonnet'");
    expect(statements[0]).toContain("true, false, '[]', NULL");
    expect(statements[1]).toContain("'review', 'Review', '10000000-0000-4000-8000-000000000003', NULL");
  });

  it('moves only the untouched starter review preset to the DeepSeek runtime alias', async () => {
    const statements: string[] = [];
    const query = vi.fn(async (statement: string) => {
      statements.push(statement);
      return statement.includes('SELECT') ? [legacyReview] : undefined;
    });
    await new AlignReviewerPreset1720000001000().up({ query } as unknown as QueryRunner);

    expect(statements).toHaveLength(3);
    expect(statements[0]).toContain("'deepseek', 'sonnet'");
    expect(statements[2]).toContain('UPDATE "model_presets"');
    expect(statements[2]).toContain('"reasoning_level" = NULL');
  });

  it('does not overwrite a user-customized review preset', async () => {
    for (const customized of [
      { ...legacyReview, model_id: '90000000-0000-4000-8000-000000000009' },
      { ...legacyReview, reasoning_level: 'high' },
      { ...legacyReview, enabled: false },
      { ...legacyReview, description: 'My reviewer policy.' },
    ]) {
      const statements: string[] = [];
      const query = vi.fn(async (statement: string) => {
        statements.push(statement);
        return statement.includes('SELECT') ? [customized] : undefined;
      });
      await new AlignReviewerPreset1720000001000().up({ query } as unknown as QueryRunner);
      expect(statements, JSON.stringify(customized)).toHaveLength(2);
      expect(statements.some((statement) => statement.includes('UPDATE "model_presets"'))).toBe(false);
    }
  });
});
