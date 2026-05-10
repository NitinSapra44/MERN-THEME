'use client';
import { useState } from 'react';

const inp: React.CSSProperties = { width: '100%', padding: '11px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1f2937', background: '#fff', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' };

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  function set(field: string, val: string) { setForm((p) => ({ ...p, [field]: val })); }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('sending');
    const res = await fetch('/api/contact-submit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { setStatus('sent'); setForm({ name: '', email: '', subject: '', message: '' }); }
    else { setStatus('error'); }
  }

  if (status === 'sent') {
    return (
      <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 12, padding: '40px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#065f46', marginBottom: 8 }}>Message Sent!</div>
        <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>We&apos;ll get back to you as soon as possible.</div>
        <button onClick={() => setStatus('idle')} style={{ padding: '9px 20px', background: '#1f2937', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, cursor: 'pointer' }}>
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '28px' }}>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#111827', marginBottom: 20 }}>Send us a message</div>
      {status === 'error' && (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626' }}>
          Something went wrong. Please try again.
        </div>
      )}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Your Name *</label>
        <input required style={inp} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="John Doe" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Email Address *</label>
        <input required type="email" style={inp} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="john@example.com" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Subject</label>
        <input style={inp} value={form.subject} onChange={(e) => set('subject', e.target.value)} placeholder="What is this about?" />
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>Message *</label>
        <textarea required style={{ ...inp, minHeight: 120, resize: 'vertical' }} value={form.message} onChange={(e) => set('message', e.target.value)} placeholder="Write your message here…" />
      </div>
      <button type="submit" disabled={status === 'sending'} style={{ width: '100%', padding: '12px', background: status === 'sending' ? '#9ca3af' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: status === 'sending' ? 'not-allowed' : 'pointer' }}>
        {status === 'sending' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
