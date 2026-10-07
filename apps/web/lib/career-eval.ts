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
  primaryMetric: '被验收结果耗时（TTAR）',
  tasks: [
    { id: 'L1' as const, difficulty: 'LOW', name: 'TypeScript exactOptionalPropertyTypes 回归修复',
      focus: '最小局部修复，观察正确性与执行开销。' },
    { id: 'M1' as const, difficulty: 'MEDIUM', name: 'Execution Ledger 重启持久化',
      focus: '迁移语义、持久状态优先级与有界重启行为。' },
    { id: 'H1' as const, difficulty: 'HIGH', name: 'Host 持有的 implementation checkpoint',
      focus: '跨模块 authority、Git tree/content 完整性、持久化顺序与 crash consistency。' },
  ],
  runs: [
    { id: 'L1-dsh-flash-high', taskId: 'L1', harness: 'DeepSeek Harness', model: 'DeepSeek-V4.1-Flash',
      effort: 'High', durationSeconds: 44, durationBasis: 'Agent 自报', reviewStatus: 'ACCEPT',
      firstPassAccepted: true, comparable: true, commitSha: '5761c126bddebc7021864d5511e706d6fa039b94',
      note: '单行修复与隐藏的历史参考实现完全一致。' },
    { id: 'L1-codex-sol-high', taskId: 'L1', harness: 'Codex', model: 'GPT-6.1 Sol',
      effort: 'High', durationSeconds: 195, durationBasis: '客户端墙钟时间', reviewStatus: 'ACCEPT',
      firstPassAccepted: true, comparable: true, commitSha: '16ef4a6bd70602c6f3605e942d1806ff02f4b8dc',
      note: '墙钟时间包含重连等待；实际执行约 60 秒。' },
    { id: 'M1-dsh-flash-high', taskId: 'M1', harness: 'DeepSeek Harness', model: 'DeepSeek-V4.1-Flash',
      effort: 'High', durationSeconds: null, durationBasis: '未可靠记录', reviewStatus: 'ACCEPT',
      firstPassAccepted: true, comparable: true, commitSha: 'ed051ea98a2f1db9acee692cce928b2a53dfa121' },
    { id: 'M1-codex-sol-high', taskId: 'M1', harness: 'Codex', model: 'GPT-6.1 Sol',
      effort: 'High', durationSeconds: null, durationBasis: '未可靠记录', reviewStatus: 'ACCEPT_WITH_SPEC_NOTE',
      firstPassAccepted: true, comparable: false, commitSha: 'c003fd62500c6215ba6b69552be5c63f5439b84b',
      note: '题面引用了 baseline 中不存在的验证脚本，因此不纳入严格横向比较。' },
    { id: 'M1-cc-deepseek-high', taskId: 'M1', harness: 'Claude Code', model: 'DeepSeek v4 Flash 路由',
      effort: 'High', durationSeconds: 270, durationBasis: '用户墙钟时间', reviewStatus: 'ACCEPT',
      firstPassAccepted: true, comparable: true, commitSha: 'd3fa93d4342ed0ab01f5b9a5c8845b79e71603a4',
      note: '通过 CC Switch 与 DeepSeek 余额变化确认真实路由；客户端自身的模型自报不准确。' },
    { id: 'H1-dsh-flash-high', taskId: 'H1', harness: 'DeepSeek Harness', model: 'DeepSeek-V4.1-Flash',
      effort: 'High', durationSeconds: 856, durationBasis: '用户墙钟时间', reviewStatus: 'REVISION_REQUIRED',
      firstPassAccepted: false, comparable: true, commitSha: '18b3dba96b9327d5270e2c25dbd20b95299633df',
      note: '遗漏 dispatch 绑定、完整证据失效，以及 verifier 前确认 ownership 的顺序约束。' },
    { id: 'H1-dsh-flash-max', taskId: 'H1', harness: 'DeepSeek Harness', model: 'DeepSeek-V4.1-Flash',
      effort: 'Max', durationSeconds: 1157, durationBasis: '用户墙钟时间', reviewStatus: 'REVISION_REQUIRED',
      firstPassAccepted: false, comparable: true, commitSha: '55569a0c4b19a893e547eb5d91d0bde060501255',
      note: '增加推理时间后，仍未补齐 dispatch、顺序、TOCTOU 与 hardlink 安全缺口。' },
    { id: 'H1-codex-sol-high', taskId: 'H1', harness: 'Codex', model: 'GPT-6.1 Sol',
      effort: 'High', durationSeconds: 1163, durationBasis: '用户墙钟时间', reviewStatus: 'ACCEPT',
      firstPassAccepted: true, comparable: true, commitSha: '4dbcfd406056325b0facad86278406961adf89cf',
      note: 'fresh H1 pilot 中唯一首轮通过验收的运行。' },
    { id: 'H1-cc-deepseek-high', taskId: 'H1', harness: 'Claude Code', model: 'DeepSeek v4 Flash 路由',
      effort: 'High', durationSeconds: 739, durationBasis: '用户墙钟时间', reviewStatus: 'REVISION_REQUIRED',
      firstPassAccepted: false, comparable: true, commitSha: '3c2ce166da3db3b3ce7ca3ef2f1fa98e903c30a9',
      note: '首个结果更快，但仍遗漏同类深层 authority / ordering / tree-integrity 不变量。' },
  ] satisfies CareerEvalRun[],
  conclusion: [
    '按“被验收结果耗时”路由，而不是按公开 benchmark 或首个响应速度路由。',
    '在验收标准清晰且确定性强的 Low / Medium 任务上，快速的 DeepSeek-based Harness 更有优势。',
    '在 H1 安全与状态一致性任务上，Codex High 是 fresh run 中唯一首轮 ACCEPT 的组合。',
    'Claude Code 提升了同一 DeepSeek 路由的 H1 首个结果速度，但没有消除深层正确性缺口。',
    '这是一个小样本工程 pilot，不是通用模型排行榜。',
  ],
} as const;
