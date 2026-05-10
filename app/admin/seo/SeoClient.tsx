'use client';
import { useState } from 'react';

const PAGES = [
  { key: 'download', label: '📥 Download Page', url: '/download' },
  { key: 'about', label: '👤 About Us', url: '/about' },
  { key: 'contact', label: '📞 Contact Us', url: '/contact' },
  { key: 'privacy', label: '🔒 Privacy Policy', url: '/privacy-policy' },
  { key: 'dmca', label: '⚠️ DMCA', url: '/dmca' },
  { key: 'blogs', label: '📝 Blog Listing', url: '/blogs' },
];

const inp: React.CSSProperties = { width: '100%', padding: '9px 12px', background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e2e8f0', fontSize: 13, boxSizing: 'border-box' };
const lbl: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 600, color: '#94a3b8', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' };
const hint: React.CSSProperties = { fontSize: 11, color: '#475569', marginTop: 4 };

export default function SeoClient({ seoMap }: { seoMap: Record<string, any> }) {
  const [activeTab, setActiveTab] = useState('download');
  const [forms, setForms] = useState<Record<string, any>>(
    Object.fromEntries(PAGES.map((p) => [p.key, seoMap[p.key] ?? { page_key: p.key }]))
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  function update(key: string, field: string, val: string) {
    setForms((prev) => ({ ...prev, [key]: { ...prev[key], [field]: val } }));
  }

  async function handleSave() {
    setSaving(true);
    const form = forms[activeTab];
    await fetch('/api/page-seo', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    setMsg('SEO settings saved!');
    setTimeout(() => setMsg(''), 2500);
  }

  const page = PAGES.find((p) => p.key === activeTab)!;
  const form = forms[activeTab] ?? {};
  const r2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 };

  return (
    <div style={{ maxWidth: 900 }}>
      {msg && (
        <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 14 }}>✓ {msg}</div>
      )}

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {PAGES.map((p) => (
          <button key={p.key} onClick={() => setActiveTab(p.key)} style={{
            padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: activeTab === p.key ? 600 : 400, cursor: 'pointer',
            background: activeTab === p.key ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
            color: activeTab === p.key ? '#fff' : '#94a3b8',
            border: activeTab === p.key ? 'none' : '1px solid rgba(255,255,255,0.08)',
          }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0' }}>{page.label}</span>
          <span style={{ fontSize: 12, color: '#475569' }}>→ public URL: {page.url}</span>
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
          Google / Search Engine
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Meta Title</label>
          <input style={inp} value={form.meta_title ?? ''} onChange={(e) => update(activeTab, 'meta_title', e.target.value)} placeholder="Page title shown in Google results" />
          <div style={{ ...hint, display: 'flex', justifyContent: 'space-between' }}>
            <span>Recommended: 50–60 characters</span>
            <span style={{ color: (form.meta_title?.length ?? 0) > 60 ? '#f87171' : '#475569' }}>{form.meta_title?.length ?? 0} chars</span>
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>Meta Description</label>
          <textarea style={{ ...inp, minHeight: 80, resize: 'vertical', fontFamily: 'inherit' }} value={form.meta_description ?? ''} onChange={(e) => update(activeTab, 'meta_description', e.target.value)} placeholder="Short description shown below the title in Google" />
          <div style={{ ...hint, display: 'flex', justifyContent: 'space-between' }}>
            <span>Recommended: 150–160 characters</span>
            <span style={{ color: (form.meta_description?.length ?? 0) > 160 ? '#f87171' : '#475569' }}>{form.meta_description?.length ?? 0} chars</span>
          </div>
        </div>
        <div style={r2}>
          <div>
            <label style={lbl}>Keywords</label>
            <input style={inp} value={form.meta_keywords ?? ''} onChange={(e) => update(activeTab, 'meta_keywords', e.target.value)} placeholder="keyword1, keyword2, keyword3" />
          </div>
          <div>
            <label style={lbl}>Robots</label>
            <select style={{ ...inp }} value={form.robots ?? 'index, follow'} onChange={(e) => update(activeTab, 'robots', e.target.value)}>
              <option value="index, follow">index, follow (default — show in Google)</option>
              <option value="noindex, follow">noindex, follow — hide from Google</option>
              <option value="noindex, nofollow">noindex, nofollow — block completely</option>
            </select>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '20px 0' }} />
        <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
          Open Graph (Social Share Preview)
        </div>
        <div style={r2}>
          <div>
            <label style={lbl}>OG Title</label>
            <input style={inp} value={form.og_title ?? ''} onChange={(e) => update(activeTab, 'og_title', e.target.value)} placeholder="Title when shared on Facebook/Twitter" />
          </div>
          <div>
            <label style={lbl}>OG Image URL</label>
            <input style={inp} value={form.og_image ?? ''} onChange={(e) => update(activeTab, 'og_image', e.target.value)} placeholder="https://yourdomain.com/og-image.png (1200×630)" />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={lbl}>OG Description</label>
          <input style={inp} value={form.og_description ?? ''} onChange={(e) => update(activeTab, 'og_description', e.target.value)} placeholder="Description shown in social share preview" />
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', margin: '20px 0' }} />
        <div style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
          Advanced
        </div>
        <div>
          <label style={lbl}>Canonical URL</label>
          <input style={inp} value={form.canonical_url ?? ''} onChange={(e) => update(activeTab, 'canonical_url', e.target.value)} placeholder="https://yourdomain.com/download (leave empty for default)" />
          <div style={hint}>Only set this if this page has duplicate content that should point to a primary URL.</div>
        </div>

        <div style={{ marginTop: 24 }}>
          <button onClick={handleSave} disabled={saving} style={{ padding: '11px 28px', background: saving ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 14, fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 15px rgba(99,102,241,0.3)' }}>
            {saving ? 'Saving…' : `💾 Save ${page.label} SEO`}
          </button>
        </div>
      </div>
    </div>
  );
}
