'use client';
import { useState } from 'react';

const card: React.CSSProperties = { background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '24px 28px', marginBottom: 18 };
const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0', fontSize: 13, boxSizing: 'border-box' };

function SlugTable({ type, initialSlugs }: { type: 'download' | 'home'; initialSlugs: any[] }) {
  const [slugs, setSlugs] = useState(initialSlugs);
  const [newSlug, setNewSlug] = useState('');
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState('');

  function flash(t: string) { setMsg(t); setTimeout(() => setMsg(''), 2500); }

  async function reload() {
    const res = await fetch('/api/slugs');
    const data = await res.json();
    setSlugs(type === 'download' ? data.download : data.home);
  }

  async function handleAdd() {
    const slug = newSlug.trim().replace(/^\//, '');
    if (!slug) return;
    setAdding(true);
    const table = type === 'download' ? 'download_slugs' : 'home_slugs';
    try {
      const res = await fetch('/api/slugs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, type }),
      });
      if (!res.ok) { flash('Slug already exists or invalid.'); } else { await reload(); setNewSlug(''); flash('Slug added!'); }
    } catch { flash('Error adding slug.'); }
    setAdding(false);
  }

  async function setCurrent(id: number) {
    await fetch(`/api/slugs/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type }) });
    await reload();
    flash('Current slug updated!');
  }

  async function handleDelete(id: number) {
    const slug = slugs.find((s) => s.id === id);
    if (slug?.is_current === 1) { flash("Can't delete the current active slug."); return; }
    if (!confirm(`Delete slug "${slug?.slug}"?`)) return;
    await fetch(`/api/slugs/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type }) });
    setSlugs((prev) => prev.filter((s) => s.id !== id));
    flash('Deleted.');
  }

  const current = slugs.find((s) => s.is_current === 1);

  return (
    <div style={card}>
      {msg && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', padding: '10px 14px', borderRadius: 8, marginBottom: 14, fontSize: 13 }}>✓ {msg}</div>}
      <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 6 }}>
        {type === 'download' ? '📥 Download Page Slugs' : '🏠 Home Page Slugs'}
      </div>
      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 18 }}>
        {type === 'download'
          ? 'Control what URL the download page lives at. Old slugs automatically redirect to the current one.'
          : 'Control what extra URLs point to the homepage. Old slugs redirect to the current one.'}
      </div>

      {current && (
        <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: 8, padding: '10px 16px', marginBottom: 16, fontSize: 13 }}>
          <span style={{ color: '#64748b' }}>Current active URL: </span>
          <span style={{ color: '#34d399', fontWeight: 700, fontFamily: 'monospace' }}>/{current.slug}</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
        {slugs.map((s) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, border: s.is_current === 1 ? '1px solid rgba(16,185,129,0.25)' : '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ flex: 1, fontFamily: 'monospace', fontSize: 13, color: s.is_current === 1 ? '#34d399' : '#94a3b8' }}>/{s.slug}</span>
            {s.is_current === 1
              ? <span style={{ padding: '3px 10px', background: 'rgba(16,185,129,0.15)', color: '#34d399', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>ACTIVE</span>
              : <span style={{ padding: '3px 10px', background: 'rgba(255,255,255,0.05)', color: '#475569', borderRadius: 20, fontSize: 11 }}>redirects → /{current?.slug}</span>
            }
            {s.is_current !== 1 && (
              <button onClick={() => setCurrent(s.id)} style={{ padding: '5px 12px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>Set Active</button>
            )}
            {s.is_current !== 1 && (
              <button onClick={() => handleDelete(s.id)} style={{ padding: '5px 10px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.12)', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>✕</button>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <input style={{ ...inp, flex: 1 }} value={newSlug} onChange={(e) => setNewSlug(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} placeholder={type === 'download' ? 'e.g. download-vidnova' : 'e.g. vidnova-apk'} />
        <button onClick={handleAdd} disabled={adding} style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: adding ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
          + Add Slug
        </button>
      </div>
    </div>
  );
}

export default function SlugManagerClient({ downloadSlugs, homeSlugs }: { downloadSlugs: any[]; homeSlugs: any[] }) {
  return (
    <div style={{ maxWidth: 720 }}>
      <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#fbbf24' }}>
        ⚠️ <strong>How slugs work:</strong> Only one slug is "active" at a time. All other slugs in the list automatically redirect (301) to the active one — this preserves your SEO when you change your URL.
      </div>
      <SlugTable type="download" initialSlugs={downloadSlugs} />
      <SlugTable type="home" initialSlugs={homeSlugs} />
    </div>
  );
}
