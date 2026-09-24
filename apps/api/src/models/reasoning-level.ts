export const REASONING_LEVELS = ['low', 'medium', 'high', 'xhigh', 'max', 'ultra'] as const;

export type ReasoningLevel = (typeof REASONING_LEVELS)[number];
