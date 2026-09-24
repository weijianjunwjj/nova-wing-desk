'use client';

import { useEffect, useState } from 'react';

const PROFILE_IDS = ['economy', 'balanced', 'quality'] as const;
const ROLE_IDS = ['executor', 'retry', 'reviewer', 'escalation'] as const;
const REASONING_EFFORTS = ['low', 'medium', 'high'] as const;
type ProfileId = (typeof PROFILE_IDS)[number];
type RoleId = (typeof ROLE_IDS)[number];
type ReasoningEffort = (typeof REASONING_EFFORTS)[number];
type ModelTarget = { model: string; reasoningEffort: ReasoningEffort };
type ModelProfile = Record<RoleId, ModelTarget>;
type RoutingDocument = {
  selectedProfile: ProfileId;
  profiles: Record<ProfileId, ModelProfile>;
  revision: number;
  updatedAt: string | null;
};

const PROFILE_NAMES: Record<ProfileId, string> = {
  economy: '省额度', balanced: '均衡', quality: '质量优先',
};
const ROLE_NAMES: Record<RoleId, { title: string; description: string }> = {
  executor: { title: 'Executor', description: '常规执行任务' },
  retry: { title: 'Retry', description: '复杂任务与重新尝试' },
  reviewer: { title: 'Reviewer', description: '方案与结果把关' },
  escalation: { title: 'Escalation', description: '疑难问题升级' },
};

function errorMessage(value: unknown): string {
  if (typeof value === 'object' && value !== null && 'message' in value) {
    const message = value.message;
    if (typeof message === 'string') return message;
  }
  return '请求失败，请稍后再试。';
}

export default function HomePage() {
  const [document, setDocument] = useState<RoutingDocument | null>(null);
  const [editingProfile, setEditingProfile] = useState<ProfileId>('balanced');
  const [status, setStatus] = useState('正在连接本机配置服务…');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  async function load() {
    setBusy(true);
    try {
      const response = await fetch('/api/model-routing', { cache: 'no-store' });
      const result = await response.json();
      if (!response.ok) throw new Error(errorMessage(result));
      setDocument(result as RoutingDocument);
      setEditingProfile((result as RoutingDocument).selectedProfile);
      setDirty(false);
      setStatus(`已读取 · revision ${(result as RoutingDocument).revision}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '读取失败');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { void load(); }, []);

  function changeTarget(role: RoleId, key: keyof ModelTarget, value: string) {
    setDocument((current) => {
      if (!current) return current;
      return {
        ...current,
        profiles: {
          ...current.profiles,
          [editingProfile]: {
            ...current.profiles[editingProfile],
            [role]: { ...current.profiles[editingProfile][role], [key]: value },
          },
        },
      };
    });
    setDirty(true);
  }

  async function save() {
    if (!document) return;
    setBusy(true);
    try {
      const response = await fetch('/api/model-routing', {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          expectedRevision: document.revision,
          selectedProfile: document.selectedProfile,
          profiles: document.profiles,
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) throw new Error('配置已在别处更新。请重新读取后再修改。');
        throw new Error(errorMessage(result));
      }
      setDocument(result as RoutingDocument);
      setDirty(false);
      setStatus(`已保存到 Desk · revision ${(result as RoutingDocument).revision}；NovaWing 尚未接入`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : '保存失败');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">✦</span><span>NovaWing <b>Desk</b></span></div>
        <div className="side-label">配置领域</div>
        <div className="side-item active">模型策略 <span>01</span></div>
        <p className="side-foot">本机配置中心<br />v0.1 · 单用户</p>
      </aside>
      <main className="content">
        <div className="eyebrow">CONFIGURATION / MODEL ROUTING</div>
        <div className="title-row"><div><h1>模型策略</h1><p className="subtitle">按任务角色配置模型与推理档位，随时调整。</p></div><span className="pill">配置草案</span></div>
        <div className="notice"><b>接入状态：尚未生效</b><span>这里的保存仅写入 Desk 数据库。NovaWing 当前不会读取这些设置；GPT-6 Luna / Sol 也尚未加入其模型选项表。</span></div>
        <section className="panel">
          <div className="panel-head"><div><h2>Model Profiles</h2><p>选择要编辑的方案，再决定默认选用哪一份。</p></div><div className="revision">revision {document?.revision ?? '—'}</div></div>
          <div className="profile-tabs" role="tablist" aria-label="编辑配置方案">
            {PROFILE_IDS.map((id) => <button key={id} type="button" role="tab" aria-selected={editingProfile === id} className={editingProfile === id ? 'tab active' : 'tab'} onClick={() => setEditingProfile(id)}>{PROFILE_NAMES[id]}</button>)}
          </div>
          <div className="selection"><label htmlFor="selected-profile">默认选用方案</label><select id="selected-profile" disabled={!document || busy} value={document?.selectedProfile ?? 'balanced'} onChange={(event) => { setDocument((current) => current && { ...current, selectedProfile: event.target.value as ProfileId }); setDirty(true); }}>{PROFILE_IDS.map((id) => <option key={id} value={id}>{PROFILE_NAMES[id]}</option>)}</select><span>为未来的 NovaWing 接入预留，当前不影响任务。</span></div>
          <div className="routing-list">
            {ROLE_IDS.map((role) => <div className="routing-row" key={role}>
              <div className="role"><strong>{ROLE_NAMES[role].title}</strong><small>{ROLE_NAMES[role].description}</small></div>
              <label className="field"><span>模型 ID</span><input disabled={!document || busy} aria-label={`${ROLE_NAMES[role].title} 模型 ID`} spellCheck={false} value={document?.profiles[editingProfile][role].model ?? ''} onChange={(event) => changeTarget(role, 'model', event.target.value)} /></label>
              <label className="field effort"><span>推理档位</span><select disabled={!document || busy} aria-label={`${ROLE_NAMES[role].title} 推理档位`} value={document?.profiles[editingProfile][role].reasoningEffort ?? 'low'} onChange={(event) => changeTarget(role, 'reasoningEffort', event.target.value)}>{REASONING_EFFORTS.map((effort) => <option key={effort} value={effort}>{effort}</option>)}</select></label>
            </div>)}
          </div>
          <div className="actions"><span role="status" aria-live="polite">{status}{dirty ? ' · 有未保存修改' : ''}</span><button type="button" className="secondary" disabled={busy} onClick={() => { if (!dirty || window.confirm('丢弃未保存修改并重新读取？')) void load(); }}>重新读取</button><button type="button" className="primary" disabled={!document || busy || !dirty} onClick={() => void save()}>{busy ? '处理中…' : '保存配置'}</button></div>
        </section>
        <p className="footer-note">保存不会热更新正在运行的 Work Session。接入时由 NovaWing 校验模型支持情况与配置 revision。</p>
      </main>
    </div>
  );
}
