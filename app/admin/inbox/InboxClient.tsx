'use client';
import { useState } from 'react';

export default function InboxClient({ initialMessages, unread }: { initialMessages: any[]; unread: number }) {
  const [messages, setMessages] = useState(initialMessages);
  const [selected, setSelected] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const displayed = filter === 'unread' ? messages.filter((m) => m.is_read !== 1) : messages;

  async function markRead(id: number) {
    await fetch(`/api/contact-submissions/${id}`, { method: 'PUT' });
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: 1 } : m));
    if (selected?.id === id) setSelected((p: any) => ({ ...p, is_read: 1 }));
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this message?')) return;
    await fetch(`/api/contact-submissions/${id}`, { method: 'DELETE' });
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  function openMessage(m: any) {
    setSelected(m);
    if (m.is_read !== 1) markRead(m.id);
  }

  function fmt(dt: string) {
    return new Date(dt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  const unreadCount = messages.filter((m) => m.is_read !== 1).length;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 20, maxWidth: 1100, height: 'calc(100vh - 160px)' }}>
      {/* List */}
      <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>Messages</span>
            {unreadCount > 0 && (
              <span style={{ padding: '2px 8px', background: 'rgba(99,102,241,0.2)', color: '#818cf8', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{unreadCount} unread</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'unread'] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 12, cursor: 'pointer', border: 'none', background: filter === f ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', color: filter === f ? '#818cf8' : '#64748b', fontWeight: filter === f ? 600 : 400 }}>
                {f === 'all' ? `All (${messages.length})` : `Unread (${unreadCount})`}
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {displayed.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#475569', fontSize: 13 }}>
              {filter === 'unread' ? 'No unread messages.' : 'No messages yet.'}
            </div>
          ) : displayed.map((m) => (
            <div
              key={m.id}
              onClick={() => openMessage(m)}
              style={{
                padding: '14px 18px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)',
                background: selected?.id === m.id ? 'rgba(99,102,241,0.1)' : m.is_read !== 1 ? 'rgba(255,255,255,0.02)' : 'transparent',
                borderLeft: selected?.id === m.id ? '3px solid #6366f1' : m.is_read !== 1 ? '3px solid rgba(99,102,241,0.4)' : '3px solid transparent',
                transition: 'background 0.15s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <span style={{ fontSize: 13.5, fontWeight: m.is_read !== 1 ? 700 : 500, color: '#e2e8f0' }}>{m.name}</span>
                {m.is_read !== 1 && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', flexShrink: 0, marginTop: 4 }} />}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>{m.email}</div>
              {m.subject && <div style={{ fontSize: 12, color: '#818cf8', marginBottom: 4, fontWeight: 600 }}>{m.subject}</div>}
              <div style={{ fontSize: 12, color: '#475569', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{m.message}</div>
              <div style={{ fontSize: 11, color: '#334155', marginTop: 6 }}>{fmt(m.created_at)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail */}
      {selected ? (
        <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '28px', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>{selected.name}</div>
              <a href={`mailto:${selected.email}`} style={{ fontSize: 13, color: '#818cf8', textDecoration: 'none' }}>{selected.email}</a>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject || '')}`} style={{ padding: '8px 16px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, fontSize: 13, textDecoration: 'none', fontWeight: 600 }}>
                Reply via Email
              </a>
              <button onClick={() => handleDelete(selected.id)} style={{ padding: '8px 14px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>
                Delete
              </button>
            </div>
          </div>
          {selected.subject && (
            <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 8, padding: '10px 16px', marginBottom: 20, fontSize: 14, color: '#a5b4fc', fontWeight: 600 }}>
              Subject: {selected.subject}
            </div>
          )}
          <div style={{ fontSize: 15, color: '#cbd5e1', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selected.message}</div>
          <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 8, fontSize: 12, color: '#475569' }}>
            Received: {fmt(selected.created_at)} {selected.ip_address && `· IP: ${selected.ip_address}`}
          </div>
        </div>
      ) : (
        <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: 14 }}>
          Select a message to read
        </div>
      )}
    </div>
  );
}
