'use client';
import { useState } from 'react';

interface NavItem {
  id: number;
  label: string;
  url: string;
  target: string;
  sort_order: number;
  is_active: number;
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

export default function NavMenuClient({ initialItems }: { initialItems: NavItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState({ label: '', url: '', target: '_self' });
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<NavItem>>({});
  const [msg, setMsg] = useState('');

  const refresh = () => fetch('/api/nav-menu').then(r => r.json()).then(setItems);
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  async function addItem() {
    if (!form.label || !form.url) { flash('Label and URL are required.'); return; }
    await fetch('/api/nav-menu', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setForm({ label: '', url: '', target: '_self' }); flash('Item added.'); refresh();
  }

  async function saveEdit(id: number) {
    await fetch(`/api/nav-menu/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editData) });
    setEditId(null); flash('Saved.'); refresh();
  }

  async function deleteItem(id: number) {
    if (!confirm('Remove this nav item?')) return;
    await fetch(`/api/nav-menu/${id}`, { method: 'DELETE' });
    refresh();
  }

  async function toggleActive(item: NavItem) {
    await fetch(`/api/nav-menu/${item.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ label: item.label, url: item.url, target: item.target, sort_order: item.sort_order, is_active: item.is_active ? 0 : 1 }),
    });
    refresh();
  }

  async function moveItem(id: number, direction: 'up' | 'down') {
    const idx = items.findIndex(i => i.id === id);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === items.length - 1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    const a = items[idx], b = items[swapIdx];
    await Promise.all([
      fetch(`/api/nav-menu/${a.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...a, sort_order: b.sort_order }) }),
      fetch(`/api/nav-menu/${b.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...b, sort_order: a.sort_order }) }),
    ]);
    refresh();
  }

  return (
    <div style={{ padding: 32, maxWidth: 860, margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 8px', color: '#f1f5f9', fontSize: 20, fontWeight: 700 }}>Navigation Menu Builder</h2>
      <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 13 }}>
        Manage the main site navigation. Items appear in the header. Use ↑↓ to reorder.
      </p>

      {msg && (
        <div style={{ padding: '10px 16px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#a5b4fc', fontSize: 13, marginBottom: 20 }}>{msg}</div>
      )}

      {/* Add form */}
      <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', color: '#f1f5f9', fontSize: 15, fontWeight: 600 }}>Add Menu Item</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Label</label>
            <input style={inputStyle} value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="e.g. Home" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>URL</label>
            <input style={inputStyle} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="e.g. / or https://..." />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Open in</label>
            <select style={inputStyle} value={form.target} onChange={e => setForm({ ...form, target: e.target.value })}>
              <option value="_self">Same tab</option>
              <option value="_blank">New tab</option>
            </select>
          </div>
        </div>
        <button onClick={addItem} style={{ ...btn('#6366f1'), marginTop: 14 }}>Add Item</button>
      </div>

      {/* Items list */}
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b', fontSize: 14 }}>No menu items yet.</div>
      ) : (
        <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Order', 'Label', 'URL', 'Target', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => moveItem(item.id, 'up')} disabled={idx === 0} style={{ background: 'none', border: 'none', color: idx === 0 ? '#1e293b' : '#64748b', cursor: idx === 0 ? 'default' : 'pointer', fontSize: 14, padding: 2 }}>↑</button>
                      <button onClick={() => moveItem(item.id, 'down')} disabled={idx === items.length - 1} style={{ background: 'none', border: 'none', color: idx === items.length - 1 ? '#1e293b' : '#64748b', cursor: idx === items.length - 1 ? 'default' : 'pointer', fontSize: 14, padding: 2 }}>↓</button>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {editId === item.id ? (
                      <input style={{ ...inputStyle, width: 130 }} value={String(editData.label ?? '')} onChange={e => setEditData({ ...editData, label: e.target.value })} />
                    ) : (
                      <span style={{ fontSize: 14, color: '#f1f5f9', fontWeight: 600 }}>{item.label}</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {editId === item.id ? (
                      <input style={{ ...inputStyle, width: 180 }} value={String(editData.url ?? '')} onChange={e => setEditData({ ...editData, url: e.target.value })} />
                    ) : (
                      <span style={{ fontSize: 12, color: '#64748b' }}>{item.url}</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {editId === item.id ? (
                      <select style={{ ...inputStyle, width: 120 }} value={String(editData.target ?? '_self')} onChange={e => setEditData({ ...editData, target: e.target.value })}>
                        <option value="_self">Same tab</option>
                        <option value="_blank">New tab</option>
                      </select>
                    ) : (
                      <span style={{ fontSize: 12, color: '#64748b' }}>{item.target}</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <button onClick={() => toggleActive(item)} style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                      background: item.is_active ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)',
                      color: item.is_active ? '#34d399' : '#64748b',
                    }}>{item.is_active ? 'Active' : 'Hidden'}</button>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    {editId === item.id ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => saveEdit(item.id)} style={btn('#10b981')}>Save</button>
                        <button onClick={() => setEditId(null)} style={{ ...btn('transparent'), color: '#64748b', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => { setEditId(item.id); setEditData({ label: item.label, url: item.url, target: item.target, sort_order: item.sort_order, is_active: item.is_active }); }} style={{ ...btn('rgba(99,102,241,0.15)'), color: '#a5b4fc' }}>Edit</button>
                        <button onClick={() => deleteItem(item.id)} style={{ ...btn('rgba(239,68,68,0.1)'), color: '#f87171' }}>Del</button>
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
