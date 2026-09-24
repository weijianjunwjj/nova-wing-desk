import assert from 'node:assert/strict';
import test from 'node:test';
import { DEFAULT_MODEL_ROUTING, parseModelRoutingUpdate } from '../dist/model-routing.js';

test('accepts an edited profile without changing the built-in template', () => {
  const input = structuredClone({ expectedRevision: 0, ...DEFAULT_MODEL_ROUTING });
  input.profiles.balanced.executor.model = 'gpt-5.6-luna';
  const parsed = parseModelRoutingUpdate(input);
  assert.equal(parsed.profiles.balanced.executor.model, 'gpt-5.6-luna');
  assert.equal(DEFAULT_MODEL_ROUTING.profiles.balanced.executor.model, 'gpt-6-luna');
});

test('rejects unsupported shapes and credentials in the configuration', () => {
  const valid = { expectedRevision: 1, ...DEFAULT_MODEL_ROUTING };
  assert.throws(() => parseModelRoutingUpdate({ ...valid, apiKey: 'secret' }), /body must contain exactly/);
  assert.throws(() => parseModelRoutingUpdate({ ...valid, expectedRevision: -1 }), /expectedRevision/);
  assert.throws(() => parseModelRoutingUpdate({ ...valid, profiles: { ...valid.profiles, unknown: {} } }), /profiles must contain exactly/);
  const withSecret = structuredClone(valid);
  withSecret.profiles.economy.executor.apiKey = 'secret';
  assert.throws(() => parseModelRoutingUpdate(withSecret), /must contain exactly/);
});

test('rejects invalid model identifiers and reasoning effort', () => {
  const invalidModel = structuredClone({ expectedRevision: 1, ...DEFAULT_MODEL_ROUTING });
  invalidModel.profiles.quality.retry.model = '$(echo unsafe)';
  assert.throws(() => parseModelRoutingUpdate(invalidModel), /model is invalid/);
  const invalidEffort = structuredClone({ expectedRevision: 1, ...DEFAULT_MODEL_ROUTING });
  invalidEffort.profiles.quality.retry.reasoningEffort = 'ultra';
  assert.throws(() => parseModelRoutingUpdate(invalidEffort), /reasoningEffort is invalid/);
});
