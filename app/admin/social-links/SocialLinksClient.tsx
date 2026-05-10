'use client';
import { useState } from 'react';

interface SocialLink { id?: number; platform: string; url: string; icon: string; }

const input: React.CSSProperties = {
  padding: '9px 12px',
  background: '#1a1a2e',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, color: '#e2e8f0',
  fontSize: 13, flex: 1,
};

export default function SocialLinksClient({ links }: { links: SocialLink[] }) {
  const [items, setItems] = useState<SocialLink[]>(
    links.length > 0 ? links : [{ platform: '', url: '', icon: '' }]
  );
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  function addRow()    { setItems((p) => [...p, { platform: '', url: '', icon: '' }]); }
  function removeRow(i: number) { setItems((p) => p.filter((_, idx) => idx !== i)); }
  function updateRow(i: number, key: keyof SocialLink, val: string) {
    setItems((p) => p.map((item, idx) => idx === i ? { ...item, [key]: val } : item));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/social-links', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(items) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ maxWidth: 820 }}>
      {saved && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
          color: '#34d399', padding: '12px 18px', borderRadius: 10, marginBottom: 20,
          fontSize: 14, fontWeight: 500,
        }}>✓ Social links saved!</div>
      )}

      <form onSubmit={handleSave}>
        <div style={{
          background: '#12121e',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, overflow: 'hidden', marginBottom: 18,
        }}>
          {/* Header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 2fr 1.2fr 48px',
            gap: 10, padding: '12px 20px',
            background: 'rgba(255,255,255,0.03)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            {['Platform', 'URL', 'Icon URL / FA class', ''].map((h) => (
              <span key={h} style={{ fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {h}
              </span>
            ))}
          </div>

          {/* Rows */}
          <div style={{ padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.2fr 48px', gap: 10, alignItems: 'center' }}>
                <input
                  placeholder="e.g. Facebook"
                  value={item.platform}
                  onChange={(e) => updateRow(i, 'platform', e.target.value)}
                  style={input}
                />
                <input
                  placeholder="https://facebook.com/..."
                  value={item.url}
                  onChange={(e) => updateRow(i, 'url', e.target.value)}
                  style={input}
                />
                <input
                  placeholder="URL to icon image"
                  value={item.icon}
                  onChange={(e) => updateRow(i, 'icon', e.target.value)}
                  style={input}
                />
                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#f87171', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 14,
                  }}
                >✕</button>
              </div>
            ))}
          </div>

          {/* Add row */}
          <div style={{ padding: '10px 20px 16px' }}>
            <button
              type="button"
              onClick={addRow}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '8px 16px',
                background: 'rgba(99,102,241,0.1)',
                border: '1px solid rgba(99,102,241,0.25)',
                borderRadius: 8, color: '#818cf8',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              + Add Social Link
            </button>
          </div>
        </div>

        <p style={{ margin: '0 0 20px', fontSize: 12, color: '#475569' }}>
          Leave Icon URL blank to use auto-detected SVG icons for Facebook, Twitter, Instagram, YouTube, Telegram, and WhatsApp.
        </p>

        <button
          type="submit"
          disabled={saving}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '11px 28px',
            background: saving ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', border: 'none', borderRadius: 9,
            fontSize: 14, fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: saving ? 'none' : '0 4px 15px rgba(99,102,241,0.35)',
          }}
        >
          {saving ? 'Saving…' : '💾  Save Links'}
        </button>
      </form>
    </div>
  );
}
