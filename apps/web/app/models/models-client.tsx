'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { api, Model, reasoningLevels } from '../../lib/api';

const empty = {
  provider: 'openai', modelId: '', displayName: '', enabled: true,
  supportsReasoning: true, reasoningLevels: ['low'], defaultReasoningLevel: 'low',
  description: '', sortOrder: 0,
};

type Draft = typeof empty;

const reasoningLabel: Record<string, string> = {
  low: '低', medium: '中', high: '高', xhigh: '超高', max: '最大', ultra: '极限',
};

function displayReasoning(level: string) {
  return reasoningLabel[level] ?? level;
}

export function ModelsClient() {
  const [models, setModels] = useState<Model[]>([]);
  const [draft, setDraft] = useState<Draft>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try { setModels(await api<Model[]>('/models')); setError(''); }
    catch (cause) { setError(cause instanceof Error ? `加载模型失败：${cause.message}` : '加载模型失败'); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  function edit(model: Model) {
    setEditingId(model.id);
    setDraft({
      provider: model.provider, modelId: model.modelId, displayName: model.displayName,
      enabled: model.enabled, supportsReasoning: model.supportsReasoning,
      reasoningLevels: model.reasoningLevels,
      defaultReasoningLevel: model.defaultReasoningLevel ?? 'low',
      description: model.description ?? '', sortOrder: model.sortOrder,
    });
    setShowForm(true);
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError('');
    const payload = {
      ...draft,
      reasoningLevels: draft.supportsReasoning ? draft.reasoningLevels : [],
      defaultReasoningLevel: draft.supportsReasoning ? draft.defaultReasoningLevel : null,
      description: draft.description || null,
      sortOrder: Number(draft.sortOrder),
    };
    try {
      await api(editingId ? `/models/${editingId}` : '/models', {
        method: editingId ? 'PATCH' : 'POST', body: JSON.stringify(payload),
      });
      setShowForm(false); setEditingId(null); setDraft(empty); await load();
    } catch (cause) { setError(cause instanceof Error ? `保存模型失败：${cause.message}` : '保存模型失败'); }
    finally { setSaving(false); }
  }

  async function toggle(model: Model) {
    try { await api(`/models/${model.id}`, { method: 'PATCH', body: JSON.stringify({ enabled: !model.enabled }) }); await load(); }
    catch (cause) { setError(cause instanceof Error ? `更新模型失败：${cause.message}` : '更新模型失败'); }
  }

  return <>
    <div className="page-header">
      <div><h1>模型</h1><p>管理 NovaWing Runtime 可使用的模型与推理能力。</p></div>
      <button className="primary" onClick={() => { setEditingId(null); setDraft(empty); setShowForm(true); }}>添加模型</button>
    </div>
    {error && <div className="error">{error}</div>}
    {showForm && <form className="card form-card" onSubmit={submit}>
      <h2>{editingId ? '编辑模型' : '新建模型'}</h2>
      <div className="form-grid">
        <label>服务提供商<input required value={draft.provider} onChange={e => setDraft({ ...draft, provider: e.target.value })} /></label>
        <label>模型 ID<input required value={draft.modelId} onChange={e => setDraft({ ...draft, modelId: e.target.value })} /></label>
        <label>显示名称<input required value={draft.displayName} onChange={e => setDraft({ ...draft, displayName: e.target.value })} /></label>
        <label>可用推理档位<input disabled={!draft.supportsReasoning} value={draft.reasoningLevels.join(', ')} onChange={e => setDraft({ ...draft, reasoningLevels: e.target.value.split(',').map(v => v.trim()).filter(v => reasoningLevels.includes(v as never)) as Draft['reasoningLevels'] })} /></label>
        <label>默认推理档位<select disabled={!draft.supportsReasoning} value={draft.defaultReasoningLevel} onChange={e => setDraft({ ...draft, defaultReasoningLevel: e.target.value })}>{draft.reasoningLevels.map(level => <option key={level} value={level}>{displayReasoning(level)}</option>)}</select></label>
        <label>排序值<input type="number" min="0" value={draft.sortOrder} onChange={e => setDraft({ ...draft, sortOrder: Number(e.target.value) })} /></label>
        <label className="checkbox"><input type="checkbox" checked={draft.enabled} onChange={e => setDraft({ ...draft, enabled: e.target.checked })} />启用</label>
        <label className="checkbox"><input type="checkbox" checked={draft.supportsReasoning} onChange={e => setDraft({ ...draft, supportsReasoning: e.target.checked })} />支持推理档位</label>
        <label>说明<textarea value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} /></label>
      </div>
      <div className="form-actions"><button type="button" onClick={() => setShowForm(false)}>取消</button><button className="primary" disabled={saving}>{saving ? '保存中…' : '保存模型'}</button></div>
    </form>}
    <div className="card"><table><thead><tr><th>服务商</th><th>模型 ID</th><th>显示名称</th><th>状态</th><th>推理档位</th><th>默认档位</th><th>操作</th></tr></thead>
      <tbody>{models.map(model => <tr key={model.id}><td>{model.provider}</td><td><code>{model.modelId}</code></td><td>{model.displayName}</td><td><span className={`badge ${model.enabled ? '' : 'off'}`}>{model.enabled ? '已启用' : '已停用'}</span></td><td>{model.supportsReasoning ? model.reasoningLevels.map(displayReasoning).join('、') : '不支持'}</td><td>{model.defaultReasoningLevel ? displayReasoning(model.defaultReasoningLevel) : '—'}</td><td><div className="row-actions"><button onClick={() => edit(model)}>编辑</button><button onClick={() => void toggle(model)}>{model.enabled ? '停用' : '启用'}</button></div></td></tr>)}</tbody>
    </table>{models.length === 0 && <div className="empty">尚未配置模型。</div>}</div>
  </>;
}
