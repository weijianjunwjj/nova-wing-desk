export type EvalReviewStatus = 'ACCEPT' | 'REVISION_REQUIRED' | 'ACCEPT_WITH_SPEC_NOTE';

export interface CareerEvalRun {
  id: string;
  taskId: 'L1' | 'M1' | 'H1';
  harness: string;
  model: string;
  effort: string;
  durationSeconds: number | null;
  durationBasis: string;
  reviewStatus: EvalReviewStatus;
  firstPassAccepted: boolean;
  comparable: boolean;
  commitSha: string;
  note?: string;
}

export const careerEval = {
  frozenAt: '2026-10-07',
  source: 'NovaWing benchmark/career-eval-v1.json',
  primaryMetric: 'Time to Accepted Result (TTAR)',
  tasks: [
    { id: 'L1' as const, difficulty: 'LOW', name: 'TypeScript exactOptionalPropertyTypes regression',
      focus: 'Minimal local fix; correctness and overhead.' },
    { id: 'M1' as const, difficulty: 'MEDIUM', name: 'Execution Ledger restart durability',
      focus: 'Migration semantics, durable state precedence, bounded restart behavior.' },
    { id: 'H1' as const, difficulty: 'HIGH', name: 'Host-owned implementation checkpoint',
      focus: 'Cross-module authority, Git tree/content integrity, persistence ordering, crash consistency.' },
  ],
  runs: [
    { id: 'L1-dsh-flash-high', taskId: 'L1', harness: 'DeepSeek Harness', model: 'DeepSeek-V4.1-Flash',
      effort: 'High', durationSeconds: 44, durationBasis: 'agent-reported', reviewStatus: 'ACCEPT',
      firstPassAccepted: true, comparable: true, commitSha: '5761c126bddebc7021864d5511e706d6fa039b94',
      note: 'One-line fix matched the hidden historical reference.' },
    { id: 'L1-codex-sol-high', taskId: 'L1', harness: 'Codex', model: 'GPT-6.1 Sol',
      effort: 'High', durationSeconds: 195, durationBasis: 'client wall-clock', reviewStatus: 'ACCEPT',
      firstPassAccepted: true, comparable: true, commitSha: '16ef4a6bd70602c6f3605e942d1806ff02f4b8dc',
      note: 'Wall-clock included reconnect delay; active execution was about 60s.' },
    { id: 'M1-dsh-flash-high', taskId: 'M1', harness: 'DeepSeek Harness', model: 'DeepSeek-V4.1-Flash',
      effort: 'High', durationSeconds: null, durationBasis: 'not reliably captured', reviewStatus: 'ACCEPT',
      firstPassAccepted: true, comparable: true, commitSha: 'ed051ea98a2f1db9acee692cce928b2a53dfa121' },
    { id: 'M1-codex-sol-high', taskId: 'M1', harness: 'Codex', model: 'GPT-6.1 Sol',
      effort: 'High', durationSeconds: null, durationBasis: 'not reliably captured', reviewStatus: 'ACCEPT_WITH_SPEC_NOTE',
      firstPassAccepted: true, comparable: false, commitSha: 'c003fd62500c6215ba6b69552be5c63f5439b84b',
      note: 'Excluded from strict comparison because the prompt referenced a validation script absent from the baseline.' },
    { id: 'M1-cc-deepseek-high', taskId: 'M1', harness: 'Claude Code', model: 'DeepSeek v4 Flash route',
      effort: 'High', durationSeconds: 270, durationBasis: 'user wall-clock', reviewStatus: 'ACCEPT',
      firstPassAccepted: true, comparable: true, commitSha: 'd3fa93d4342ed0ab01f5b9a5c8845b79e71603a4',
      note: 'DeepSeek route externally evidenced through CC Switch; client self-report named the model incorrectly.' },
    { id: 'H1-dsh-flash-high', taskId: 'H1', harness: 'DeepSeek Harness', model: 'DeepSeek-V4.1-Flash',
      effort: 'High', durationSeconds: 856, durationBasis: 'user wall-clock', reviewStatus: 'REVISION_REQUIRED',
      firstPassAccepted: false, comparable: true, commitSha: '18b3dba96b9327d5270e2c25dbd20b95299633df',
      note: 'Missed dispatch binding, full evidence invalidation, and ownership-before-verification ordering.' },
    { id: 'H1-dsh-flash-max', taskId: 'H1', harness: 'DeepSeek Harness', model: 'DeepSeek-V4.1-Flash',
      effort: 'Max', durationSeconds: 1157, durationBasis: 'user wall-clock', reviewStatus: 'REVISION_REQUIRED',
      firstPassAccepted: false, comparable: true, commitSha: '55569a0c4b19a893e547eb5d91d0bde060501255',
      note: 'Extra reasoning time did not close dispatch, ordering, TOCTOU, and hardlink gaps.' },
    { id: 'H1-codex-sol-high', taskId: 'H1', harness: 'Codex', model: 'GPT-6.1 Sol',
      effort: 'High', durationSeconds: 1163, durationBasis: 'user wall-clock', reviewStatus: 'ACCEPT',
      firstPassAccepted: true, comparable: true, commitSha: '4dbcfd406056325b0facad86278406961adf89cf',
      note: 'Only fresh H1 pilot run to reach first-pass ACCEPT.' },
    { id: 'H1-cc-deepseek-high', taskId: 'H1', harness: 'Claude Code', model: 'DeepSeek v4 Flash route',
      effort: 'High', durationSeconds: 739, durationBasis: 'user wall-clock', reviewStatus: 'REVISION_REQUIRED',
      firstPassAccepted: false, comparable: true, commitSha: '3c2ce166da3db3b3ce7ca3ef2f1fa98e903c30a9',
      note: 'Faster first result, but the same class of deep authority/ordering/tree-integrity gaps remained.' },
  ] satisfies CareerEvalRun[],
  conclusion: [
    'Route by accepted-result latency, not by public benchmark score or first-response speed.',
    'Low/medium work favors fast DeepSeek-based harnesses when acceptance is clear and deterministic.',
    'For the H1 security/state-consistency task, Codex High was the only fresh first-pass ACCEPT.',
    'Claude Code improved the same DeepSeek route’s H1 first-result latency versus DeepSeek Harness High, but did not remove the deep correctness misses.',
    'This is a small engineering pilot, not a universal model ranking.',
  ],
} as const;
