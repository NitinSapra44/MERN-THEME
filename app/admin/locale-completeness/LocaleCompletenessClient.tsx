'use client';
import { useEffect, useState } from 'react';

interface LocaleResult {
  locale: string;
  label: string;
  pct: number;
  filled: number;
  total: number;
  missing: string[];
}

const barColor = (pct: number) => {
  if (pct >= 90) return '#10b981';
  if (pct >= 60) return '#f59e0b';
  return '#ef4444';
};

export default function LocaleCompletenessClient() {
  const [data, setData] = useState<LocaleResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/locale-completeness').then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return <div style={{ padding: 40, color: '#64748b', textAlign: 'center' }}>Checking all 21 locales...</div>;

  const sorted = [...data].sort((a, b) => a.pct - b.pct);
  const avg = Math.round(data.reduce((s, d) => s + d.pct, 0) / data.length);
  const complete = data.filter(d => d.pct === 100).length;

  return (
    <div style={{ padding: 32, maxWidth: 860, margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 8px', color: '#f1f5f9', fontSize: 20, fontWeight: 700 }}>Locale Completeness</h2>
      <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: 13 }}>
        Shows how many of the 20 tracked content fields are filled per language. Click a row to see missing fields.
      </p>

      {/* Summary chips */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Average completion', val: `${avg}%`, color: barColor(avg) },
          { label: 'Fully complete', val: `${complete} / ${data.length}`, color: '#10b981' },
          { label: 'Needs work', val: `${data.filter(d => d.pct < 60).length} locales`, color: '#ef4444' },
        ].map(c => (
          <div key={c.label} style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '14px 20px', flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: c.color }}>{c.val}</div>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* Locale rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map(item => (
          <div key={item.locale} style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden' }}>
            <div
              onClick={() => setExpanded(expanded === item.locale ? null : item.locale)}
              style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', cursor: 'pointer' }}
            >
              {/* Flag/locale code */}
              <div style={{ width: 36, textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#475569', fontFamily: 'monospace', flexShrink: 0 }}>{item.locale.toUpperCase()}</div>

              {/* Name */}
              <div style={{ width: 110, fontSize: 14, fontWeight: 600, color: '#f1f5f9', flexShrink: 0 }}>{item.label}</div>

              {/* Progress bar */}
              <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ width: `${item.pct}%`, height: '100%', background: barColor(item.pct), borderRadius: 4, transition: 'width 0.4s ease' }} />
              </div>

              {/* Pct label */}
              <div style={{ width: 48, textAlign: 'right', fontSize: 13, fontWeight: 700, color: barColor(item.pct), flexShrink: 0 }}>{item.pct}%</div>

              {/* Count */}
              <div style={{ width: 64, textAlign: 'right', fontSize: 12, color: '#475569', flexShrink: 0 }}>{item.filled}/{item.total}</div>

              {/* Chevron */}
              <div style={{ fontSize: 12, color: '#334155', transition: 'transform 0.2s', transform: expanded === item.locale ? 'rotate(180deg)' : 'none' }}>▼</div>
            </div>

            {expanded === item.locale && (
              <div style={{ padding: '0 18px 16px 70px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                {item.missing.length === 0 ? (
                  <p style={{ color: '#34d399', fontSize: 13, margin: '12px 0 0' }}>All fields are filled.</p>
                ) : (
                  <>
                    <p style={{ color: '#64748b', fontSize: 12, margin: '12px 0 8px' }}>Missing fields ({item.missing.length}):</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {item.missing.map(f => (
                        <span key={f} style={{
                          padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600, fontFamily: 'monospace',
                          background: 'rgba(239,68,68,0.1)', color: '#f87171',
                          border: '1px solid rgba(239,68,68,0.2)',
                        }}>{f}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
