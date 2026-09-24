export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api/v1';

export type ReasoningLevel = 'low' | 'medium' | 'high' | 'xhigh' | 'max' | 'ultra';
export const reasoningLevels: ReasoningLevel[] = [
  'low',
  'medium',
  'high',
  'xhigh',
  'max',
  'ultra',
];

export interface Model {
  id: string;
  provider: string;
  modelId: string;
  displayName: string;
  enabled: boolean;
  supportsReasoning: boolean;
  reasoningLevels: ReasoningLevel[];
  defaultReasoningLevel: ReasoningLevel | null;
  description: string | null;
  sortOrder: number;
}

export interface Preset {
  key: string;
  name: string;
  modelId: string;
  model: { id: string; modelId: string; displayName: string; enabled: boolean };
  reasoningLevel: ReasoningLevel | null;
  enabled: boolean;
  description: string | null;
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string | string[] } | null;
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
    throw new Error(message ?? `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}
