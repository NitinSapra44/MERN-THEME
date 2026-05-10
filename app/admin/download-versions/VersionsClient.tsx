'use client';
import { useState } from 'react';

const card: React.CSSProperties = { background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '24px 28px', marginBottom: 18 };
const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0', fontSize: 13, boxSizing: 'border-box' };
const lbl: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' };

const EMPTY = { version_name: '', file_size: '', min_android: 'Android 5.0+', changelog: '', download_url: '', is_latest: false, sort_order: 0 };

export default function VersionsClient({ initialVersions }: { initialVersions: any[] }) {
  const [versions, setVersions] = useState(initialVersions);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  function flash(text: string) { setMsg(text); setTimeout(() => setMsg(''), 2500); }

  function startEdit(v: any) {
    setEditId(v.id);
    setForm({ version_name: v.version_name, file_size: v.file_size || '', min_android: v.min_android || 'Android 5.0+', changelog: v.changelog || '', download_url: v.download_url, is_latest: v.is_latest === 1, sort_order: v.sort_order || 0 });
  }

  async function reload() {
    const res = await fetch('/api/apk-versions');
    setVersions(await res.json());
  }

  async function handleSave() {
    if (!form.version_name.trim() || !form.download_url.trim()) { flash('Version name and download URL are required.'); return; }
    setSaving(true);
    if (editId) {
      await fetch(`/api/apk-versions/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    } else {
      await fetch('/api/apk-versions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    }
    await reload();
    setForm(EMPTY);
    setEditId(null);
    setSaving(false);
    flash(editId ? 'Version updated!' : 'Version added!');
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this version?')) return;
    await fetch(`/api/apk-versions/${id}`, { method: 'DELETE' });
    setVersions((prev) => prev.filter((v) => v.id !== id));
    flash('Deleted.');
  }

  async function setLatest(id: number) {
    const ver = versions.find((v) => v.id === id);
    if (!ver) return;
    await fetch(`/api/apk-versions/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...ver, is_latest: true, is_latest_bool: true }) });
    await reload();
    flash('Latest version updated!');
  }

  const row2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 };

  return (
    <div style={{ maxWidth: 900 }}>
      {msg && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 14 }}>✓ {msg}</div>
      )}

      {/* Form */}
      <div style={card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 20 }}>
          {editId ? '✏️ Edit Version' : '+ Add New APK Version'}
        </div>
        <div style={row2}>
          <div>
            <label style={lbl}>Version Name *</label>
            <input style={inp} value={form.version_name} onChange={(e) => setForm((p) => ({ ...p, version_name: e.target.value }))} placeholder="e.g. 5.1.0" />
          </div>
          <div>
            <label style={lbl}>File Size</label>
            <input style={inp} value={form.file_size} onChange={(e) => setForm((p) => ({ ...p, file_size: e.target.value }))} placeholder="e.g. 18.5 MB" />
          </div>
        </div>
        <div style={row2}>
          <div>
            <label style={lbl}>Min Android Version</label>
            <input style={inp} value={form.min_android} onChange={(e) => setForm((p) => ({ ...p, min_android: e.target.value }))} placeholder="e.g. Android 5.0+" />
          </div>
          <div>
            <label style={lbl}>Display Order</label>
            <input type="number" style={inp} value={form.sort_order} onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))} />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Download URL *</label>
          <input style={inp} value={form.download_url} onChange={(e) => setForm((p) => ({ ...p, download_url: e.target.value }))} placeholder="https://example.com/app-v5.1.0.apk" />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Changelog (HTML supported)</label>
          <textarea
            style={{ ...inp, minHeight: 90, resize: 'vertical', fontFamily: 'inherit' }}
            value={form.changelog}
            onChange={(e) => setForm((p) => ({ ...p, changelog: e.target.value }))}
            placeholder="<ul><li>Bug fixes</li><li>Performance improvements</li></ul>"
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#94a3b8' }}>
            <input type="checkbox" checked={form.is_latest} onChange={(e) => setForm((p) => ({ ...p, is_latest: e.target.checked }))} style={{ width: 16, height: 16, accentColor: '#6366f1' }} />
            Mark as Latest Version (will be shown prominently on download page)
          </label>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Saving…' : editId ? 'Update Version' : 'Add Version'}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setForm(EMPTY); }} style={{ padding: '10px 18px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 9, fontSize: 13, cursor: 'pointer' }}>
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Versions list */}
      {versions.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', color: '#475569', padding: '40px 24px' }}>No APK versions yet. Add one above.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {versions.map((v) => (
            <div key={v.id} style={{ ...card, padding: '18px 24px', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>v{v.version_name}</span>
                  {v.is_latest === 1 && (
                    <span style={{ padding: '2px 10px', background: 'rgba(16,185,129,0.15)', color: '#34d399', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>LATEST</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#64748b', marginBottom: 6 }}>
                  {v.file_size && <span>📦 {v.file_size}</span>}
                  {v.min_android && <span>🤖 {v.min_android}</span>}
                  <span>⬇ {v.download_count || 0} downloads</span>
                </div>
                <div style={{ fontSize: 12, color: '#475569', fontFamily: 'monospace', wordBreak: 'break-all' }}>{v.download_url}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {v.is_latest !== 1 && (
                  <button onClick={() => setLatest(v.id)} style={{ padding: '7px 12px', background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}>
                    Set Latest
                  </button>
                )}
                <button onClick={() => startEdit(v)} style={{ padding: '7px 14px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(v.id)} style={{ padding: '7px 12px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 7, fontSize: 12, cursor: 'pointer' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
