'use client';
import { useState } from 'react';

interface AbTest {
  id: number;
  name: string;
  variant_a_text: string;
  variant_a_color: string;
  variant_b_text: string;
  variant_b_color: string;
  clicks_a: number;
  impressions_a: number;
  clicks_b: number;
  impressions_b: number;
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

const ctr = (clicks: number, impressions: number) =>
  impressions > 0 ? `${((clicks / impressions) * 100).toFixed(1)}%` : '–';

export default function AbTestsClient({ initialTests }: { initialTests: AbTest[] }) {
  const [tests, setTests] = useState(initialTests);
  const [form, setForm] = useState({ name: '', variant_a_text: '', variant_a_color: '#6366f1', variant_b_text: '', variant_b_color: '#10b981' });
  const [msg, setMsg] = useState('');

  const refresh = () => fetch('/api/ab-tests').then(r => r.json()).then(setTests);
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  async function addTest() {
    if (!form.name || !form.variant_a_text || !form.variant_b_text) { flash('Fill in all fields.'); return; }
    await fetch('/api/ab-tests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    flash('Test created.'); setForm({ name: '', variant_a_text: '', variant_a_color: '#6366f1', variant_b_text: '', variant_b_color: '#10b981' }); refresh();
  }

  async function activate(id: number) {
    await fetch(`/api/ab-tests/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: 1 }) });
    flash('Test activated — only one test runs at a time.'); refresh();
  }

  async function deactivate(id: number) {
    await fetch(`/api/ab-tests/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: 0 }) });
    flash('Test deactivated.'); refresh();
  }

  async function deleteTest(id: number) {
    if (!confirm('Delete this A/B test?')) return;
    await fetch(`/api/ab-tests/${id}`, { method: 'DELETE' });
    refresh();
  }

  return (
    <div style={{ padding: 32, maxWidth: 1000, margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 8px', color: '#f1f5f9', fontSize: 20, fontWeight: 700 }}>A/B Test Manager</h2>
      <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 13 }}>
        Test different download button texts. Only one test can be active at a time. Variants are shown randomly to visitors.
      </p>

      {msg && (
        <div style={{ padding: '10px 16px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#a5b4fc', fontSize: 13, marginBottom: 20 }}>{msg}</div>
      )}

      {/* Create form */}
      <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', color: '#f1f5f9', fontSize: 15, fontWeight: 600 }}>Create New Test</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Test Name (internal reference)</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Download Button — June 2025" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto', gap: 12, alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Variant A — Button Text</label>
              <input style={inputStyle} value={form.variant_a_text} onChange={e => setForm({ ...form, variant_a_text: e.target.value })} placeholder="Download Now" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Color</label>
              <input type="color" value={form.variant_a_color} onChange={e => setForm({ ...form, variant_a_color: e.target.value })} style={{ width: 48, height: 40, border: 'none', background: 'transparent', cursor: 'pointer' }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Variant B — Button Text</label>
              <input style={inputStyle} value={form.variant_b_text} onChange={e => setForm({ ...form, variant_b_text: e.target.value })} placeholder="Free Download" />
            </div>
            <div>
              <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Color</label>
              <input type="color" value={form.variant_b_color} onChange={e => setForm({ ...form, variant_b_color: e.target.value })} style={{ width: 48, height: 40, border: 'none', background: 'transparent', cursor: 'pointer' }} />
            </div>
          </div>
        </div>
        <button onClick={addTest} style={{ ...btn('#6366f1'), marginTop: 16 }}>Create Test</button>
      </div>

      {/* Tests list */}
      {tests.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b', fontSize: 14 }}>No A/B tests yet.</div>
      ) : tests.map(t => {
        const winnerA = t.impressions_a > 0 && t.impressions_b > 0 && (t.clicks_a / t.impressions_a) > (t.clicks_b / t.impressions_b);
        const winnerB = t.impressions_a > 0 && t.impressions_b > 0 && (t.clicks_b / t.impressions_b) > (t.clicks_a / t.impressions_a);
        return (
          <div key={t.id} style={{
            background: '#0f0f1a', border: `1px solid ${t.is_active ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 12, padding: 24, marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>{t.name}</span>
                {t.is_active === 1 && (
                  <span style={{ marginLeft: 10, padding: '2px 10px', background: 'rgba(16,185,129,0.15)', color: '#34d399', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>ACTIVE</span>
                )}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {t.is_active ? (
                  <button onClick={() => deactivate(t.id)} style={btn('rgba(245,158,11,0.12)', '#fbbf24')}>Pause</button>
                ) : (
                  <button onClick={() => activate(t.id)} style={btn('rgba(16,185,129,0.12)', '#34d399')}>Activate</button>
                )}
                <button onClick={() => deleteTest(t.id)} style={btn('rgba(239,68,68,0.1)', '#f87171')}>Delete</button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { label: 'Variant A', text: t.variant_a_text, color: t.variant_a_color, clicks: t.clicks_a, impr: t.impressions_a, winner: winnerA },
                { label: 'Variant B', text: t.variant_b_text, color: t.variant_b_color, clicks: t.clicks_b, impr: t.impressions_b, winner: winnerB },
              ].map(v => (
                <div key={v.label} style={{
                  background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 16,
                  border: v.winner ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.06)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <span style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>{v.label}</span>
                    <span style={{
                      padding: '6px 16px', borderRadius: 6, fontSize: 13, fontWeight: 700,
                      background: v.color, color: '#fff',
                    }}>{v.text}</span>
                    {v.winner && <span style={{ fontSize: 11, color: '#34d399', fontWeight: 700 }}>Winner</span>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                    {[
                      { l: 'Impressions', val: v.impr },
                      { l: 'Clicks', val: v.clicks },
                      { l: 'CTR', val: ctr(v.clicks, v.impr) },
                    ].map(s => (
                      <div key={s.l} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9' }}>{s.val}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{s.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
