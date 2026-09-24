'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, Model, Preset, ReasoningLevel } from '../../lib/api';

export function PresetsClient() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    try {
      const [nextPresets, nextModels] = await Promise.all([api<Preset[]>('/presets'), api<Model[]>('/models')]);
      setPresets(nextPresets); setModels(nextModels); setError('');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not load presets'); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function update(preset: Preset, changes: object) {
    try { await api(`/presets/${preset.key}`, { method: 'PATCH', body: JSON.stringify(changes) }); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Could not update preset'); }
  }

  return <>
    <div className="page-header"><div><h1>Presets</h1><p>Default model policy for each kind of NovaWing work.</p></div></div>
    {error && <div className="error">{error}</div>}
    <div className="card"><table><thead><tr><th>Preset key</th><th>Name</th><th>Model</th><th>Reasoning level</th><th>Enabled</th></tr></thead>
      <tbody>{presets.map(preset => {
        const selected = models.find(model => model.id === preset.modelId);
        const levels = selected?.reasoningLevels ?? [];
        return <tr key={preset.key}>
          <td><code>{preset.key}</code></td><td>{preset.name}</td>
          <td><select value={preset.modelId} onChange={e => void update(preset, { modelId: e.target.value, reasoningLevel: models.find(m => m.id === e.target.value)?.defaultReasoningLevel ?? null })}>{models.map(model => <option key={model.id} value={model.id} disabled={!model.enabled}>{model.displayName} ({model.modelId}){model.enabled ? '' : ' — disabled'}</option>)}</select></td>
          <td><select value={preset.reasoningLevel ?? ''} onChange={e => void update(preset, { reasoningLevel: (e.target.value || null) as ReasoningLevel | null })}><option value="">None</option>{levels.map(level => <option key={level}>{level}</option>)}</select></td>
          <td><label className="checkbox" style={{ margin: 0 }}><input type="checkbox" checked={preset.enabled} onChange={e => void update(preset, { enabled: e.target.checked })} />{preset.enabled ? 'Enabled' : 'Disabled'}</label></td>
        </tr>;
      })}</tbody></table>{presets.length === 0 && <div className="empty">No presets configured.</div>}</div>
  </>;
}
