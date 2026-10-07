import { careerEval, type EvalReviewStatus } from '../../lib/career-eval';

function formatDuration(seconds: number | null) {
  if (seconds === null) return 'Not captured';
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return minutes === 0 ? `${rest}s` : `${minutes}m ${String(rest).padStart(2, '0')}s`;
}

function statusClass(status: EvalReviewStatus) {
  if (status === 'ACCEPT') return 'status-badge accept';
  if (status === 'REVISION_REQUIRED') return 'status-badge revision';
  return 'status-badge note';
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
        <h1>Career Eval</h1>
        <p>Real-repository task replay focused on time to an independently reviewed accepted result.</p>
      </div>
      <span className="badge">Frozen {careerEval.frozenAt}</span>
    </div>

    <div className="metric-grid">
      <div className="metric-card">
        <span>Primary metric</span>
        <strong>TTAR</strong>
        <small>Time to Accepted Result</small>
      </div>
      <div className="metric-card">
        <span>Fresh H1 first-pass</span>
        <strong>{acceptedH1.length}/{freshH1.length}</strong>
        <small>ACCEPT without a corrective implementation round</small>
      </div>
      <div className="metric-card">
        <span>Fastest accepted H1</span>
        <strong>{formatDuration(fastestAcceptedH1?.durationSeconds ?? null)}</strong>
        <small>{fastestAcceptedH1 ? `${fastestAcceptedH1.harness} · ${fastestAcceptedH1.model}` : 'No accepted run'}</small>
      </div>
      <div className="metric-card">
        <span>Fastest H1 first result</span>
        <strong>{formatDuration(fastestH1?.durationSeconds ?? null)}</strong>
        <small>{fastestH1 ? `${fastestH1.harness} · ${fastestH1.reviewStatus}` : 'No timed run'}</small>
      </div>
    </div>

    <section className="card eval-summary">
      <div>
        <span className="eyebrow">Engineering conclusion</span>
        <h2>First-result speed and accepted-result speed are different metrics.</h2>
      </div>
      <div className="insight-list">
        {careerEval.conclusion.map(item => <p key={item}>{item}</p>)}
      </div>
    </section>

    <section className="eval-section">
      <div className="section-heading">
        <div><span className="eyebrow">Task set</span><h2>Three real-history replay levels</h2></div>
        <p>Hidden historical fixes are review references, never input to the runner.</p>
      </div>
      <div className="task-grid">
        {careerEval.tasks.map(task => <article className="card task-card" key={task.id}>
          <div className="task-card-top">
            <span className="difficulty">{task.difficulty}</span>
            <code>{task.id}</code>
          </div>
          <h3>{task.name}</h3>
          <p>{task.focus}</p>
        </article>)}
      </div>
    </section>

    <section className="eval-section">
      <div className="section-heading">
        <div><span className="eyebrow">Run matrix</span><h2>What each harness actually delivered</h2></div>
        <p>Non-comparable runs remain visible but are excluded from strict routing conclusions.</p>
      </div>
      <div className="card table-scroll">
        <table>
          <thead><tr>
            <th>Task</th><th>Harness</th><th>Model</th><th>Effort</th><th>Duration</th><th>Review</th><th>Commit</th>
          </tr></thead>
          <tbody>
            {careerEval.runs.map(run => <tr key={run.id} className={run.comparable ? '' : 'muted-row'}>
              <td><strong>{run.taskId}</strong>{!run.comparable && <small className="cell-note">Non-comparable</small>}</td>
              <td>{run.harness}</td>
              <td>{run.model}</td>
              <td>{run.effort}</td>
              <td>{formatDuration(run.durationSeconds)}<small className="cell-note">{run.durationBasis}</small></td>
              <td><span className={statusClass(run.reviewStatus)}>{run.reviewStatus.replaceAll('_', ' ')}</span></td>
              <td><code>{run.commitSha.slice(0, 8)}</code>{run.note && <small className="cell-note">{run.note}</small>}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </section>

    <section className="card methodology-card">
      <span className="eyebrow">Methodology</span>
      <h2>Evidence before leaderboard claims</h2>
      <div className="methodology-grid">
        <div><strong>Fresh baseline</strong><p>Each comparable run starts from the same task-specific Git commit.</p></div>
        <div><strong>Hidden reference</strong><p>Historical implementations are withheld until review.</p></div>
        <div><strong>Acceptance review</strong><p>Passing tests are necessary, but missing safety invariants still produce REVISION REQUIRED.</p></div>
        <div><strong>Small sample</strong><p>The pilot informs routing decisions; it does not claim universal model superiority.</p></div>
      </div>
      <p className="source-note">Source snapshot: <code>{careerEval.source}</code></p>
    </section>
  </>;
}
