import { careerEval, type EvalReviewStatus } from '../../lib/career-eval';

function formatDuration(seconds: number | null) {
  if (seconds === null) return '未记录';
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes === 0
    ? String(rest) + ' 秒'
    : String(minutes) + ' 分 ' + String(rest).padStart(2, '0') + ' 秒';
}

function statusClass(status: EvalReviewStatus) {
  if (status === 'ACCEPT') return 'status-badge accept';
  if (status === 'REVISION_REQUIRED') return 'status-badge revision';
  return 'status-badge note';
}

function statusLabel(status: EvalReviewStatus) {
  if (status === 'ACCEPT') return '通过';
  if (status === 'REVISION_REQUIRED') return '需要修订';
  return '通过（规格说明）';
}

function effortLabel(effort: string) {
  if (effort === 'High') return '高';
  if (effort === 'Max') return '最大';
  return effort;
}

function difficultyLabel(difficulty: string) {
  if (difficulty === 'LOW') return '低';
  if (difficulty === 'MEDIUM') return '中';
  if (difficulty === 'HIGH') return '高';
  return difficulty;
}

export default function EvalPage() {
  const freshH1 = careerEval.runs.filter(run => run.taskId === 'H1' && run.comparable);
  const acceptedH1 = freshH1.filter(run => run.reviewStatus === 'ACCEPT');
  const fastestH1 = [...freshH1]
    .filter(run => run.durationSeconds !== null)
    .sort((a, b) => (a.durationSeconds ?? Infinity) - (b.durationSeconds ?? Infinity))[0];
  const fastestAcceptedH1 = [...acceptedH1]
    .filter(run => run.durationSeconds !== null)
    .sort((a, b) => (a.durationSeconds ?? Infinity) - (b.durationSeconds ?? Infinity))[0];

  return <>
    <div className="page-header">
      <div>
        <h1>NovaWing 工程评测</h1>
        <p>真实仓库任务重放：关注从任务提交到独立 Review 通过的实际耗时与证据质量。</p>
      </div>
      <span className="badge">冻结于 {careerEval.frozenAt}</span>
    </div>

    <div className="metric-grid">
      <div className="metric-card">
        <span>核心指标</span>
        <strong>TTAR</strong>
        <small>Time to Accepted Result / 被验收结果耗时</small>
      </div>
      <div className="metric-card">
        <span>H1 首轮通过</span>
        <strong>{acceptedH1.length}/{freshH1.length}</strong>
        <small>无需纠偏实现轮次即可直接通过</small>
      </div>
      <div className="metric-card">
        <span>最快被验收 H1</span>
        <strong>{formatDuration(fastestAcceptedH1?.durationSeconds ?? null)}</strong>
        <small>{fastestAcceptedH1 ? fastestAcceptedH1.harness + ' · ' + fastestAcceptedH1.model : '暂无通过运行'}</small>
      </div>
      <div className="metric-card">
        <span>最快 H1 首个结果</span>
        <strong>{formatDuration(fastestH1?.durationSeconds ?? null)}</strong>
        <small>{fastestH1 ? fastestH1.harness + ' · ' + statusLabel(fastestH1.reviewStatus) : '暂无计时运行'}</small>
      </div>
    </div>

    <section className="card eval-summary">
      <div>
        <span className="eyebrow">工程结论</span>
        <h2>“首个结果快”和“最快拿到可验收结果”不是同一个指标。</h2>
      </div>
      <div className="insight-list">
        {careerEval.conclusion.map(item => <p key={item}>{item}</p>)}
      </div>
    </section>

    <section className="eval-section">
      <div className="section-heading">
        <div><span className="eyebrow">任务集</span><h2>三档真实历史任务重放</h2></div>
        <p>历史实现只作为 Review 的隐藏参考，不会提供给执行 Harness。</p>
      </div>
      <div className="task-grid">
        {careerEval.tasks.map(task => <article className="card task-card" key={task.id}>
          <div className="task-card-top">
            <span className="difficulty">{difficultyLabel(task.difficulty)}</span>
            <code>{task.id}</code>
          </div>
          <h3>{task.name}</h3>
          <p>{task.focus}</p>
        </article>)}
      </div>
    </section>

    <section className="eval-section">
      <div className="section-heading">
        <div><span className="eyebrow">运行矩阵</span><h2>各 Harness 实际交付结果</h2></div>
        <p>不可严格比较的运行仍保留展示，但不会用于严格路由结论。</p>
      </div>
      <div className="card table-scroll">
        <table>
          <thead><tr>
            <th>任务</th><th>Harness</th><th>模型</th><th>推理档位</th><th>耗时</th><th>Review</th><th>Commit / 说明</th>
          </tr></thead>
          <tbody>
            {careerEval.runs.map(run => <tr key={run.id} className={run.comparable ? '' : 'muted-row'}>
              <td><strong>{run.taskId}</strong>{!run.comparable && <small className="cell-note">不可严格比较</small>}</td>
              <td>{run.harness}</td>
              <td>{run.model}</td>
              <td>{effortLabel(run.effort)}</td>
              <td>{formatDuration(run.durationSeconds)}<small className="cell-note">{run.durationBasis}</small></td>
              <td><span className={statusClass(run.reviewStatus)}>{statusLabel(run.reviewStatus)}</span></td>
              <td><code>{run.commitSha.slice(0, 8)}</code>{run.note && <small className="cell-note">{run.note}</small>}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </section>

    <section className="card methodology-card">
      <span className="eyebrow">方法</span>
      <h2>先看证据，再谈排行榜</h2>
      <div className="methodology-grid">
        <div><strong>Fresh baseline</strong><p>每个可比较运行都从同一个任务专属 Git baseline 开始。</p></div>
        <div><strong>隐藏参考</strong><p>历史实现直到 Review 阶段才可见，执行时完全隐藏。</p></div>
        <div><strong>独立验收</strong><p>测试通过只是必要条件；缺失安全不变量仍会判定为“需要修订”。</p></div>
        <div><strong>小样本</strong><p>该 pilot 用于辅助路由决策，不宣称某模型具有普遍优势。</p></div>
      </div>
      <p className="source-note">数据快照：<code>{careerEval.source}</code></p>
    </section>
  </>;
}
