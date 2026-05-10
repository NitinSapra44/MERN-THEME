'use client';
import { useState } from 'react';

const card: React.CSSProperties = { background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '24px 28px', marginBottom: 18 };
const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0', fontSize: 13, boxSizing: 'border-box' };
const lbl: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' };

export default function CategoriesClient({ initialCategories }: { initialCategories: any[] }) {
  const [cats, setCats] = useState(initialCategories);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  function flash(t: string) { setMsg(t); setTimeout(() => setMsg(''), 2500); }

  async function reload() {
    const res = await fetch('/api/categories');
    setCats(await res.json());
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    if (editId) {
      await fetch(`/api/categories/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, description: desc }) });
      flash('Category updated!');
    } else {
      await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, description: desc }) });
      flash('Category added!');
    }
    await reload();
    setName(''); setDesc(''); setEditId(null);
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this category? Posts in this category will become uncategorized.')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    setCats((prev) => prev.filter((c) => c.id !== id));
    flash('Deleted.');
  }

  return (
    <div style={{ maxWidth: 720 }}>
      {msg && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>✓ {msg}</div>}

      <div style={card}>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 16 }}>{editId ? 'Edit Category' : '+ Add Category'}</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div>
            <label style={lbl}>Category Name *</label>
            <input style={inp} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. How-To Guides" onKeyDown={(e) => e.key === 'Enter' && handleSave()} />
          </div>
          <div>
            <label style={lbl}>Description</label>
            <input style={inp} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Short description (optional)" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleSave} disabled={saving} style={{ padding: '9px 22px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer' }}>
            {saving ? 'Saving…' : editId ? 'Update' : 'Add Category'}
          </button>
          {editId && (
            <button onClick={() => { setEditId(null); setName(''); setDesc(''); }} style={{ padding: '9px 16px', background: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>Cancel</button>
          )}
        </div>
      </div>

      {cats.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', color: '#475569', padding: '40px' }}>No categories yet.</div>
      ) : (
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>All Categories ({cats.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {cats.map((c) => (
              <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>{c.name}</div>
                  {c.description && <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{c.description}</div>}
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>
                    <code style={{ fontFamily: 'monospace', color: '#818cf8' }}>/{c.slug}</code>
                    <span style={{ marginLeft: 12 }}>{c.post_count || 0} posts</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setEditId(c.id); setName(c.name); setDesc(c.description || ''); }} style={{ padding: '6px 14px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(c.id)} style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
