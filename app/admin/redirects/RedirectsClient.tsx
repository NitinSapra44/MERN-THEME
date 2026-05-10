'use client';
import { useState } from 'react';

interface Redirect {
  id: number;
  from_path: string;
  to_path: string;
  redirect_type: number;
  is_active: number;
  created_at: string;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', background: '#0a0a14',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
  color: '#f1f5f9', fontSize: 13, boxSizing: 'border-box',
};
const btn = (color: string, textColor = '#fff'): React.CSSProperties => ({
  padding: '7px 14px', borderRadius: 8, border: 'none',
  background: color, color: textColor, cursor: 'pointer', fontSize: 13, fontWeight: 600,
});

export default function RedirectsClient({ initialRedirects }: { initialRedirects: Redirect[] }) {
  const [redirects, setRedirects] = useState(initialRedirects);
  const [form, setForm] = useState({ from_path: '', to_path: '', redirect_type: 301 });
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Redirect>>({});
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const refresh = () => fetch('/api/redirects').then(r => r.json()).then(setRedirects);
  const flash = (m: string, isError = false) => {
    if (isError) { setError(m); setTimeout(() => setError(''), 4000); }
    else { setMsg(m); setTimeout(() => setMsg(''), 3000); }
  };

  async function addRedirect() {
    if (!form.from_path || !form.to_path) { flash('Both From Path and To Path are required.', true); return; }
    const res = await fetch('/api/redirects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { setForm({ from_path: '', to_path: '', redirect_type: 301 }); flash('Redirect created.'); refresh(); }
    else { const d = await res.json(); flash(d.error || 'Error creating redirect.', true); }
  }

  async function saveEdit(id: number) {
    await fetch(`/api/redirects/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editData) });
    setEditId(null); flash('Updated.'); refresh();
  }

  async function deleteRedirect(id: number) {
    if (!confirm('Delete this redirect?')) return;
    await fetch(`/api/redirects/${id}`, { method: 'DELETE' });
    refresh();
  }

  async function toggleActive(r: Redirect) {
    await fetch(`/api/redirects/${r.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ from_path: r.from_path, to_path: r.to_path, redirect_type: r.redirect_type, is_active: r.is_active ? 0 : 1 }),
    });
    refresh();
  }

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 8px', color: '#f1f5f9', fontSize: 20, fontWeight: 700 }}>Redirects Manager</h2>
      <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 13 }}>
        Redirect old URLs to new ones. 301 = permanent (SEO-safe), 302 = temporary.
      </p>

      {msg && <div style={{ padding: '10px 16px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8, color: '#34d399', fontSize: 13, marginBottom: 16 }}>{msg}</div>}
      {error && <div style={{ padding: '10px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, color: '#f87171', fontSize: 13, marginBottom: 16 }}>{error}</div>}

      {/* Add form */}
      <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', color: '#f1f5f9', fontSize: 15, fontWeight: 600 }}>Add Redirect</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 140px', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>From Path (old URL)</label>
            <input style={inputStyle} value={form.from_path} onChange={e => setForm({ ...form, from_path: e.target.value })} placeholder="/old-download-link" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>To Path (new URL)</label>
            <input style={inputStyle} value={form.to_path} onChange={e => setForm({ ...form, to_path: e.target.value })} placeholder="/download or https://..." />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Type</label>
            <select style={inputStyle} value={form.redirect_type} onChange={e => setForm({ ...form, redirect_type: Number(e.target.value) })}>
              <option value={301}>301 — Permanent</option>
              <option value={302}>302 — Temporary</option>
            </select>
          </div>
        </div>
        <button onClick={addRedirect} style={{ ...btn('#6366f1'), marginTop: 14 }}>Add Redirect</button>
      </div>

      {/* Redirects table */}
      {redirects.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b', fontSize: 14 }}>No redirects yet.</div>
      ) : (
        <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['From', 'To', 'Type', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {redirects.map(r => (
                <tr key={r.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '11px 14px' }}>
                    {editId === r.id ? (
                      <input style={{ ...inputStyle, width: 180 }} value={String(editData.from_path ?? '')} onChange={e => setEditData({ ...editData, from_path: e.target.value })} />
                    ) : (
                      <span style={{ fontSize: 13, color: '#94a3b8', fontFamily: 'monospace' }}>{r.from_path}</span>
                    )}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    {editId === r.id ? (
                      <input style={{ ...inputStyle, width: 180 }} value={String(editData.to_path ?? '')} onChange={e => setEditData({ ...editData, to_path: e.target.value })} />
                    ) : (
                      <span style={{ fontSize: 13, color: '#64748b', fontFamily: 'monospace' }}>{r.to_path}</span>
                    )}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    {editId === r.id ? (
                      <select style={{ ...inputStyle, width: 120 }} value={Number(editData.redirect_type ?? 301)} onChange={e => setEditData({ ...editData, redirect_type: Number(e.target.value) })}>
                        <option value={301}>301</option>
                        <option value={302}>302</option>
                      </select>
                    ) : (
                      <span style={{ padding: '2px 8px', borderRadius: 6, fontSize: 12, fontWeight: 700, background: r.redirect_type === 301 ? 'rgba(99,102,241,0.12)' : 'rgba(245,158,11,0.12)', color: r.redirect_type === 301 ? '#a5b4fc' : '#fbbf24' }}>
                        {r.redirect_type}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    <button onClick={() => toggleActive(r)} style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                      background: r.is_active ? 'rgba(16,185,129,0.12)' : 'rgba(100,116,139,0.12)',
                      color: r.is_active ? '#34d399' : '#64748b',
                    }}>{r.is_active ? 'Active' : 'Paused'}</button>
                  </td>
                  <td style={{ padding: '11px 14px' }}>
                    {editId === r.id ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => saveEdit(r.id)} style={btn('#10b981')}>Save</button>
                        <button onClick={() => setEditId(null)} style={{ ...btn('transparent'), color: '#64748b', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => { setEditId(r.id); setEditData({ from_path: r.from_path, to_path: r.to_path, redirect_type: r.redirect_type, is_active: r.is_active }); }} style={{ ...btn('rgba(99,102,241,0.15)'), color: '#a5b4fc' }}>Edit</button>
                        <button onClick={() => deleteRedirect(r.id)} style={{ ...btn('rgba(239,68,68,0.1)'), color: '#f87171' }}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
