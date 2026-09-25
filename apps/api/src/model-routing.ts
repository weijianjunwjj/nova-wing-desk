export const PROFILE_IDS = ['economy', 'balanced', 'quality'] as const;
export const ROLE_IDS = ['executor', 'retry', 'reviewer', 'escalation'] as const;
export const REASONING_EFFORTS = ['low', 'medium', 'high'] as const;

export type ProfileId = (typeof PROFILE_IDS)[number];
export type RoleId = (typeof ROLE_IDS)[number];
export type ReasoningEffort = (typeof REASONING_EFFORTS)[number];
export type ModelTarget = { model: string; reasoningEffort: ReasoningEffort };
export type ModelProfile = Record<RoleId, ModelTarget>;
export type ModelRoutingSettings = {
  selectedProfile: ProfileId;
  profiles: Record<ProfileId, ModelProfile>;
};
export type ModelRoutingUpdate = ModelRoutingSettings & { expectedRevision: number };

// Strategy templates only. NovaWing does not currently consume this configuration.
export const DEFAULT_MODEL_ROUTING: ModelRoutingSettings = {
  selectedProfile: 'balanced',
  profiles: {
    economy: {
      executor: { model: 'gpt-6-luna', reasoningEffort: 'low' },
      retry: { model: 'gpt-6-luna', reasoningEffort: 'medium' },
      reviewer: { model: 'gpt-6-luna', reasoningEffort: 'medium' },
      escalation: { model: 'gpt-6-sol', reasoningEffort: 'medium' },
    },
    balanced: {
      executor: { model: 'gpt-6-luna', reasoningEffort: 'low' },
      retry: { model: 'gpt-6-luna', reasoningEffort: 'medium' },
      reviewer: { model: 'gpt-6-sol', reasoningEffort: 'medium' },
      escalation: { model: 'gpt-6-sol', reasoningEffort: 'high' },
    },
    quality: {
      executor: { model: 'gpt-6-sol', reasoningEffort: 'medium' },
      retry: { model: 'gpt-6-sol', reasoningEffort: 'high' },
      reviewer: { model: 'gpt-6-sol', reasoningEffort: 'high' },
      escalation: { model: 'gpt-6-sol', reasoningEffort: 'high' },
    },
  },
};

function objectWithKeys(value: unknown, keys: readonly string[], path: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${path} must be an object`);
  }
  const record = value as Record<string, unknown>;
  if (Object.keys(record).length !== keys.length || keys.some((key) => !Object.hasOwn(record, key))) {
    throw new Error(`${path} must contain exactly: ${keys.join(', ')}`);
  }
  return record;
}

export function parseModelRoutingUpdate(input: unknown): ModelRoutingUpdate {
  const body = objectWithKeys(input, ['expectedRevision', 'selectedProfile', 'profiles'], 'body');
  if (!Number.isSafeInteger(body.expectedRevision) || (body.expectedRevision as number) < 0) {
    throw new Error('expectedRevision must be a non-negative safe integer');
  }
  if (!PROFILE_IDS.includes(body.selectedProfile as ProfileId)) {
    throw new Error('selectedProfile is invalid');
  }
  const rawProfiles = objectWithKeys(body.profiles, PROFILE_IDS, 'profiles');
  const profiles = {} as Record<ProfileId, ModelProfile>;
  for (const id of PROFILE_IDS) {
    const rawProfile = objectWithKeys(rawProfiles[id], ROLE_IDS, `profiles.${id}`);
    const profile = {} as ModelProfile;
    for (const role of ROLE_IDS) {
      const target = objectWithKeys(rawProfile[role], ['model', 'reasoningEffort'], `profiles.${id}.${role}`);
      if (typeof target.model !== 'string' || !/^[a-z0-9][a-z0-9._-]{1,79}$/.test(target.model)) {
        throw new Error(`profiles.${id}.${role}.model is invalid`);
      }
      if (!REASONING_EFFORTS.includes(target.reasoningEffort as ReasoningEffort)) {
        throw new Error(`profiles.${id}.${role}.reasoningEffort is invalid`);
      }
      profile[role] = { model: target.model, reasoningEffort: target.reasoningEffort as ReasoningEffort };
    }
    profiles[id] = profile;
  }
  return {
    expectedRevision: body.expectedRevision as number,
    selectedProfile: body.selectedProfile as ProfileId,
    profiles,
  };
}
