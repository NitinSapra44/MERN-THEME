'use client';
import { useState } from 'react';

const TYPES = [
  { value: 'hero',       label: '🦸 Hero',         desc: 'Large heading + subtitle (dark banner)' },
  { value: 'rich_text',  label: '📄 Text Block',    desc: 'Rich HTML text content' },
  { value: 'image_text', label: '🖼️ Image + Text', desc: 'Side-by-side image and text' },
  { value: 'cta',        label: '🎯 CTA Button',    desc: 'Centered heading + button' },
  { value: 'info_boxes', label: '📦 Info Cards',    desc: 'Grid of icon/title/text cards' },
];

const inp: React.CSSProperties = { width: '100%', padding: '8px 12px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 7, color: '#e2e8f0', fontSize: 13, boxSizing: 'border-box', fontFamily: 'inherit' };
const lbl: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' };

function SectionEditor({ s, onSave, onDelete, onMove }: { s: any; onSave: (id: number, content: any) => void; onDelete: (id: number) => void; onMove: (id: number, dir: 'up' | 'down') => void }) {
  const [content, setContent] = useState<any>(s.content ?? {});
  const [open, setOpen] = useState(false);

  function setField(key: string, val: string) { setContent((p: any) => ({ ...p, [key]: val })); }

  const fields: Record<string, JSX.Element> = {
    hero: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div><label style={lbl}>Heading</label><input style={inp} value={content.heading ?? ''} onChange={(e) => setField('heading', e.target.value)} /></div>
        <div><label style={lbl}>Subtitle</label><input style={inp} value={content.subtitle ?? ''} onChange={(e) => setField('subtitle', e.target.value)} /></div>
      </div>
    ),
    rich_text: (
      <div>
        <label style={lbl}>HTML Content</label>
        <textarea style={{ ...inp, minHeight: 120, resize: 'vertical' }} value={content.html ?? ''} onChange={(e) => setField('html', e.target.value)} placeholder="<p>Your content here…</p>" />
      </div>
    ),
    image_text: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div><label style={lbl}>Image URL</label><input style={inp} value={content.image ?? ''} onChange={(e) => setField('image', e.target.value)} placeholder="https://… or /uploads/…" /></div>
        <div><label style={lbl}>Heading</label><input style={inp} value={content.heading ?? ''} onChange={(e) => setField('heading', e.target.value)} /></div>
        <div><label style={lbl}>Text (HTML)</label><textarea style={{ ...inp, minHeight: 80, resize: 'vertical' }} value={content.text ?? ''} onChange={(e) => setField('text', e.target.value)} /></div>
        <div><label style={lbl}>Image Position</label>
          <select style={inp} value={content.image_position ?? 'left'} onChange={(e) => setField('image_position', e.target.value)}>
            <option value="left">Image Left</option>
            <option value="right">Image Right</option>
          </select>
        </div>
      </div>
    ),
    cta: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div><label style={lbl}>Heading</label><input style={inp} value={content.heading ?? ''} onChange={(e) => setField('heading', e.target.value)} /></div>
        <div><label style={lbl}>Subtext</label><input style={inp} value={content.subtext ?? ''} onChange={(e) => setField('subtext', e.target.value)} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div><label style={lbl}>Button Text</label><input style={inp} value={content.button_text ?? ''} onChange={(e) => setField('button_text', e.target.value)} /></div>
          <div><label style={lbl}>Button URL</label><input style={inp} value={content.button_url ?? ''} onChange={(e) => setField('button_url', e.target.value)} /></div>
        </div>
      </div>
    ),
    info_boxes: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div><label style={lbl}>Section Heading</label><input style={inp} value={content.heading ?? ''} onChange={(e) => setField('heading', e.target.value)} /></div>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>Card {i + 1}</div>
            <input style={inp} value={content[`card${i}_title`] ?? ''} onChange={(e) => setField(`card${i}_title`, e.target.value)} placeholder="Title" />
            <input style={inp} value={content[`card${i}_text`] ?? ''} onChange={(e) => setField(`card${i}_text`, e.target.value)} placeholder="Description" />
          </div>
        ))}
      </div>
    ),
  };

  const typeLabel = TYPES.find((t) => t.value === s.section_type)?.label ?? s.section_type;

  return (
    <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', cursor: 'pointer', borderBottom: open ? '1px solid rgba(255,255,255,0.06)' : 'none' }} onClick={() => setOpen(!open)}>
        <span style={{ fontSize: 14, color: '#e2e8f0', flex: 1, fontWeight: 500 }}>{typeLabel}</span>
        <button onClick={(e) => { e.stopPropagation(); onMove(s.id, 'up'); }} style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#64748b', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>↑</button>
        <button onClick={(e) => { e.stopPropagation(); onMove(s.id, 'down'); }} style={{ padding: '3px 8px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#64748b', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>↓</button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(s.id); }} style={{ padding: '3px 8px', background: 'rgba(239,68,68,0.08)', border: 'none', color: '#f87171', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>✕</button>
        <span style={{ color: '#64748b', fontSize: 14 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ padding: '16px' }}>
          {fields[s.section_type] ?? <div style={{ color: '#64748b', fontSize: 13 }}>No editor for this type.</div>}
          <button onClick={() => onSave(s.id, content)} style={{ marginTop: 14, padding: '8px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
            Save Section
          </button>
        </div>
      )}
    </div>
  );
}

export default function PageBuilderClient({ pages, initialSections }: { pages: any[]; initialSections: Record<string, any[]> }) {
  const [activeTab, setActiveTab] = useState(pages[0].key);
  const [sections, setSections] = useState(initialSections);
  const [addType, setAddType] = useState('hero');
  const [msg, setMsg] = useState('');

  function flash(t: string) { setMsg(t); setTimeout(() => setMsg(''), 2000); }

  async function reload() {
    const res = await fetch(`/api/page-sections?page=${activeTab}`);
    const data = await res.json();
    setSections((prev) => ({ ...prev, [activeTab]: data }));
  }

  async function handleAdd() {
    const cur = sections[activeTab] ?? [];
    await fetch('/api/page-sections', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page_key: activeTab, section_type: addType, content: {}, sort_order: cur.length }) });
    await reload();
    flash('Section added!');
  }

  async function handleSave(id: number, content: any) {
    const s = (sections[activeTab] ?? []).find((x) => x.id === id);
    if (!s) return;
    await fetch(`/api/page-sections/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...s, content }) });
    flash('Saved!');
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this section?')) return;
    await fetch(`/api/page-sections/${id}`, { method: 'DELETE' });
    setSections((prev) => ({ ...prev, [activeTab]: (prev[activeTab] ?? []).filter((s) => s.id !== id) }));
    flash('Deleted.');
  }

  async function handleMove(id: number, dir: 'up' | 'down') {
    const cur = [...(sections[activeTab] ?? [])];
    const idx = cur.findIndex((s) => s.id === id);
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === cur.length - 1) return;
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    [cur[idx], cur[swap]] = [cur[swap], cur[idx]];
    const updated = cur.map((s, i) => ({ ...s, sort_order: i }));
    setSections((prev) => ({ ...prev, [activeTab]: updated }));
    await Promise.all(updated.map((s) => fetch(`/api/page-sections/${s.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(s) })));
  }

  const page = pages.find((p) => p.key === activeTab)!;
  const cur = sections[activeTab] ?? [];

  return (
    <div style={{ maxWidth: 860 }}>
      {msg && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>✓ {msg}</div>}

      <div style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.18)', borderRadius: 8, padding: '10px 14px', marginBottom: 20, fontSize: 12, color: '#a5b4fc' }}>
        ℹ️ Sections built here appear on the public page <strong>instead of</strong> the rich-text content from Static Pages. If no sections are added, the page falls back to the rich-text content.
      </div>

      {/* Page tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {pages.map((p) => (
          <button key={p.key} onClick={() => setActiveTab(p.key)} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: activeTab === p.key ? 600 : 400, cursor: 'pointer', background: activeTab === p.key ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)', color: activeTab === p.key ? '#fff' : '#94a3b8', border: activeTab === p.key ? 'none' : '1px solid rgba(255,255,255,0.08)' }}>
            {p.label} {(sections[p.key] ?? []).length > 0 ? `(${(sections[p.key] ?? []).length})` : ''}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <select value={addType} onChange={(e) => setAddType(e.target.value)} style={{ ...inp, maxWidth: 220 }}>
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label} — {t.desc}</option>)}
        </select>
        <button onClick={handleAdd} style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          + Add Section
        </button>
      </div>

      {cur.length === 0 ? (
        <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '48px 24px', textAlign: 'center', color: '#475569' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>📄</div>
          No sections yet for {page.label}. Add one above — the page falls back to rich-text content in Static Pages until you do.
        </div>
      ) : (
        cur.map((s) => (
          <SectionEditor key={s.id} s={s} onSave={handleSave} onDelete={handleDelete} onMove={handleMove} />
        ))
      )}
    </div>
  );
}
