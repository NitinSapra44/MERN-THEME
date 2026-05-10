'use client';
import { useState } from 'react';

interface Widget {
  id: number;
  widget_key: string;
  content: string;
  is_enabled: number;
}

const WIDGET_INFO: Record<string, { label: string; desc: string; placeholder: string }> = {
  announcement_bar: {
    label: 'Announcement Bar',
    desc: 'A slim banner displayed at the very top of every page. Great for promotions, alerts, or important notices.',
    placeholder: '🎉 New version available! Download VidNova 2.5 now.',
  },
  custom_head_scripts: {
    label: 'Custom Head Scripts',
    desc: 'HTML injected into the <head> of every page. Use for analytics codes, Google Tag Manager, custom meta tags, etc.',
    placeholder: '<!-- Google Analytics -->\n<script>...</script>',
  },
  footer_custom_blurb: {
    label: 'Footer Custom Blurb',
    desc: 'A text block displayed in the website footer. Good for brief descriptions, affiliate disclosures, or copyright notes.',
    placeholder: 'VidNova is not affiliated with any third-party platform.',
  },
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', background: '#0a0a14',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
  color: '#f1f5f9', fontSize: 13, boxSizing: 'border-box',
};
const btn = (color: string, textColor = '#fff'): React.CSSProperties => ({
  padding: '8px 18px', borderRadius: 8, border: 'none',
  background: color, color: textColor, cursor: 'pointer', fontSize: 13, fontWeight: 600,
});

export default function WidgetsClient({ initialWidgets }: { initialWidgets: Widget[] }) {
  const [widgets, setWidgets] = useState<Record<string, Widget>>(() => {
    const map: Record<string, Widget> = {};
    initialWidgets.forEach(w => { map[w.widget_key] = w; });
    return map;
  });
  const [contents, setContents] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    initialWidgets.forEach(w => { map[w.widget_key] = w.content ?? ''; });
    return map;
  });
  const [msg, setMsg] = useState('');

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  async function save(key: string, enabled: number) {
    const res = await fetch('/api/widgets', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ widget_key: key, content: contents[key] ?? '', is_enabled: enabled }),
    });
    if (res.ok) {
      setWidgets(prev => ({ ...prev, [key]: { ...(prev[key] ?? { id: 0, widget_key: key, content: '', is_enabled: 0 }), content: contents[key] ?? '', is_enabled: enabled } }));
      flash('Widget saved.');
    }
  }

  async function toggleEnabled(key: string) {
    const current = widgets[key]?.is_enabled ?? 0;
    await save(key, current ? 0 : 1);
  }

  return (
    <div style={{ padding: 32, maxWidth: 820, margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 8px', color: '#f1f5f9', fontSize: 20, fontWeight: 700 }}>Widget Zones</h2>
      <p style={{ margin: '0 0 28px', color: '#64748b', fontSize: 13 }}>
        Enable or disable site-wide content zones. Each widget can be toggled independently.
      </p>

      {msg && (
        <div style={{ padding: '10px 16px', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 8, color: '#34d399', fontSize: 13, marginBottom: 20 }}>{msg}</div>
      )}

      {Object.keys(WIDGET_INFO).map((key) => {
        const info = WIDGET_INFO[key];
        const w = widgets[key];
        const enabled = w?.is_enabled ?? 0;
        return (
          <div key={key} style={{
            background: '#0f0f1a', border: `1px solid ${enabled ? 'rgba(99,102,241,0.35)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 12, padding: 24, marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{info.label}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{info.desc}</div>
              </div>
              <button
                onClick={() => toggleEnabled(key)}
                style={{
                  padding: '6px 16px', borderRadius: 20, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 12,
                  background: enabled ? 'rgba(99,102,241,0.15)' : 'rgba(100,116,139,0.15)',
                  color: enabled ? '#a5b4fc' : '#64748b',
                }}
              >
                {enabled ? 'Enabled' : 'Disabled'}
              </button>
            </div>
            <textarea
              style={{ ...inputStyle, height: key === 'custom_head_scripts' ? 120 : 72, resize: 'vertical', fontFamily: key === 'custom_head_scripts' ? 'monospace' : 'inherit' }}
              value={contents[key] ?? ''}
              onChange={e => setContents(prev => ({ ...prev, [key]: e.target.value }))}
              placeholder={info.placeholder}
            />
            <button onClick={() => save(key, enabled)} style={{ ...btn('#6366f1'), marginTop: 10 }}>Save Widget</button>
          </div>
        );
      })}
    </div>
  );
}
