'use client';

import { useCallback, useEffect, useState } from 'react';
import { api, Model, Preset, ReasoningLevel } from '../../lib/api';

const presetLabels: Record<string, string> = {
  default: '默认任务',
  planning: '规划',
  implementation: '实现',
  review: '评审',
  economy: '经济模式',
};

const reasoningLabel: Record<string, string> = {
  low: '低', medium: '中', high: '高', xhigh: '超高', max: '最大', ultra: '极限',
};

export function PresetsClient() {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    try {
      const [nextPresets, nextModels] = await Promise.all([api<Preset[]>('/presets'), api<Model[]>('/models')]);
      setPresets(nextPresets); setModels(nextModels); setError('');
    } catch (cause) { setError(cause instanceof Error ? `加载任务预设失败：${cause.message}` : '加载任务预设失败'); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function update(preset: Preset, changes: object) {
    try { await api(`/presets/${preset.key}`, { method: 'PATCH', body: JSON.stringify(changes) }); await load(); }
    catch (cause) { setError(cause instanceof Error ? `更新任务预设失败：${cause.message}` : '更新任务预设失败'); }
  }

  return <>
    <div className="page-header"><div><h1>任务预设</h1><p>为不同类型的 NovaWing 工作配置默认模型与推理档位。</p></div></div>
    {error && <div className="error">{error}</div>}
    <div className="card"><table><thead><tr><th>预设键</th><th>名称</th><th>模型</th><th>推理档位</th><th>状态</th></tr></thead>
      <tbody>{presets.map(preset => {
        const selected = models.find(model => model.id === preset.modelId);
        const levels = selected?.reasoningLevels ?? [];
        return <tr key={preset.key}>
          <td><code>{preset.key}</code></td><td>{presetLabels[preset.key] ?? preset.name}</td>
          <td><select value={preset.modelId} onChange={e => void update(preset, { modelId: e.target.value, reasoningLevel: models.find(m => m.id === e.target.value)?.defaultReasoningLevel ?? null })}>{models.map(model => <option key={model.id} value={model.id} disabled={!model.enabled}>{model.displayName} ({model.modelId}){model.enabled ? '' : ' — 已停用'}</option>)}</select></td>
          <td><select value={preset.reasoningLevel ?? ''} onChange={e => void update(preset, { reasoningLevel: (e.target.value || null) as ReasoningLevel | null })}><option value="">无</option>{levels.map(level => <option key={level} value={level}>{reasoningLabel[level] ?? level}</option>)}</select></td>
          <td><label className="checkbox" style={{ margin: 0 }}><input type="checkbox" checked={preset.enabled} onChange={e => void update(preset, { enabled: e.target.checked })} />{preset.enabled ? '已启用' : '已停用'}</label></td>
        </tr>;
      })}</tbody></table>{presets.length === 0 && <div className="empty">尚未配置任务预设。</div>}</div>
  </>;
}
