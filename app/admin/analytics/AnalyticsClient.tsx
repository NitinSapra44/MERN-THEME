'use client';
import { useEffect, useState } from 'react';

interface AnalyticsData {
  total_views: number;
  total_blogs: number;
  total_downloads: number;
  top_pages: Array<{ path: string; views: number }>;
  recent_activity: Array<{ admin_username: string; action: string; created_at: string }>;
}

const card = (label: string, value: string | number, icon: string, color: string) => (
  <div key={label} style={{
    background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 12, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16,
  }}>
    <div style={{
      width: 48, height: 48, borderRadius: 12, background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9' }}>{value.toLocaleString()}</div>
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>{label}</div>
    </div>
  </div>
);

export default function AnalyticsClient() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(d => { setData(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ padding: 40, color: '#64748b', textAlign: 'center' }}>Loading analytics...</div>
  );
  if (!data) return null;

  return (
    <div style={{ padding: 32, maxWidth: 1100, margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 24px', color: '#f1f5f9', fontSize: 20, fontWeight: 700 }}>Site Analytics</h2>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {card('Total Page Views', data.total_views ?? 0, '👁', 'rgba(99,102,241,0.15)')}
        {card('Published Blog Posts', data.total_blogs ?? 0, '📝', 'rgba(16,185,129,0.15)')}
        {card('Total Downloads', data.total_downloads ?? 0, '📥', 'rgba(245,158,11,0.15)')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Top pages */}
        <div style={{
          background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: 24,
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#f1f5f9', fontSize: 15, fontWeight: 600 }}>Top 10 Pages</h3>
          {(data.top_pages ?? []).length === 0 ? (
            <p style={{ color: '#64748b', margin: 0, fontSize: 13 }}>No page views tracked yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', fontSize: 11, color: '#475569', fontWeight: 600, paddingBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Path</th>
                  <th style={{ textAlign: 'right', fontSize: 11, color: '#475569', fontWeight: 600, paddingBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Views</th>
                </tr>
              </thead>
              <tbody>
                {data.top_pages.map((p, i) => (
                  <tr key={p.path} style={{ borderTop: i > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                    <td style={{ padding: '8px 0', fontSize: 13, color: '#94a3b8', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.path}
                    </td>
                    <td style={{ padding: '8px 0', fontSize: 13, color: '#f1f5f9', textAlign: 'right', fontWeight: 600 }}>
                      {Number(p.views).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent activity */}
        <div style={{
          background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 12, padding: 24,
        }}>
          <h3 style={{ margin: '0 0 16px', color: '#f1f5f9', fontSize: 15, fontWeight: 600 }}>Recent Admin Activity</h3>
          {(data.recent_activity ?? []).length === 0 ? (
            <p style={{ color: '#64748b', margin: 0, fontSize: 13 }}>No activity logged yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {data.recent_activity.map((a, i) => (
                <div key={i} style={{
                  padding: '10px 14px', background: 'rgba(255,255,255,0.03)',
                  borderRadius: 8, borderLeft: '3px solid rgba(99,102,241,0.4)',
                }}>
                  <div style={{ fontSize: 13, color: '#e2e8f0' }}>{a.action}</div>
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 3 }}>
                    by {a.admin_username} · {new Date(a.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
