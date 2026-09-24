'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { api, Model, reasoningLevels } from '../../lib/api';

const empty = {
  provider: 'openai', modelId: '', displayName: '', enabled: true,
  supportsReasoning: true, reasoningLevels: ['low'], defaultReasoningLevel: 'low',
  description: '', sortOrder: 0,
};

type Draft = typeof empty;

export function ModelsClient() {
  const [models, setModels] = useState<Model[]>([]);
  const [draft, setDraft] = useState<Draft>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try { setModels(await api<Model[]>('/models')); setError(''); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not load models'); }
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
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not save model'); }
    finally { setSaving(false); }
  }

  async function toggle(model: Model) {
    try { await api(`/models/${model.id}`, { method: 'PATCH', body: JSON.stringify({ enabled: !model.enabled }) }); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not update model'); }
  }

  return <>
    <div className="page-header">
      <div><h1>Models</h1><p>Models available to NovaWing Runtime.</p></div>
      <button className="primary" onClick={() => { setEditingId(null); setDraft(empty); setShowForm(true); }}>Add model</button>
    </div>
    {error && <div className="error">{error}</div>}
    {showForm && <form className="card form-card" onSubmit={submit}>
      <h2>{editingId ? 'Edit model' : 'New model'}</h2>
      <div className="form-grid">
        <label>Provider<input required value={draft.provider} onChange={e => setDraft({ ...draft, provider: e.target.value })} /></label>
        <label>Model ID<input required value={draft.modelId} onChange={e => setDraft({ ...draft, modelId: e.target.value })} /></label>
        <label>Display name<input required value={draft.displayName} onChange={e => setDraft({ ...draft, displayName: e.target.value })} /></label>
        <label>Reasoning levels<input disabled={!draft.supportsReasoning} value={draft.reasoningLevels.join(', ')} onChange={e => setDraft({ ...draft, reasoningLevels: e.target.value.split(',').map(v => v.trim()).filter(v => reasoningLevels.includes(v as never)) as Draft['reasoningLevels'] })} /></label>
        <label>Default reasoning<select disabled={!draft.supportsReasoning} value={draft.defaultReasoningLevel} onChange={e => setDraft({ ...draft, defaultReasoningLevel: e.target.value })}>{draft.reasoningLevels.map(level => <option key={level}>{level}</option>)}</select></label>
        <label>Sort order<input type="number" min="0" value={draft.sortOrder} onChange={e => setDraft({ ...draft, sortOrder: Number(e.target.value) })} /></label>
        <label className="checkbox"><input type="checkbox" checked={draft.enabled} onChange={e => setDraft({ ...draft, enabled: e.target.checked })} />Enabled</label>
        <label className="checkbox"><input type="checkbox" checked={draft.supportsReasoning} onChange={e => setDraft({ ...draft, supportsReasoning: e.target.checked })} />Supports reasoning</label>
        <label>Description<textarea value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })} /></label>
      </div>
      <div className="form-actions"><button type="button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary" disabled={saving}>{saving ? 'Saving…' : 'Save model'}</button></div>
    </form>}
    <div className="card"><table><thead><tr><th>Provider</th><th>Model ID</th><th>Display name</th><th>Enabled</th><th>Reasoning</th><th>Default</th><th></th></tr></thead>
      <tbody>{models.map(model => <tr key={model.id}><td>{model.provider}</td><td><code>{model.modelId}</code></td><td>{model.displayName}</td><td><span className={`badge ${model.enabled ? '' : 'off'}`}>{model.enabled ? 'Enabled' : 'Disabled'}</span></td><td>{model.supportsReasoning ? model.reasoningLevels.join(', ') : 'No'}</td><td>{model.defaultReasoningLevel ?? '—'}</td><td><div className="row-actions"><button onClick={() => edit(model)}>Edit</button><button onClick={() => void toggle(model)}>{model.enabled ? 'Disable' : 'Enable'}</button></div></td></tr>)}</tbody>
    </table>{models.length === 0 && <div className="empty">No models configured.</div>}</div>
  </>;
}
