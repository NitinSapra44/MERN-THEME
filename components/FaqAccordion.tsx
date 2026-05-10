'use client';
import { useState } from 'react';

interface FaqItem { question: string; answer: string; }

export default function FaqAccordion({ faqs, css }: { faqs: FaqItem[]; css: Record<string, string | number> }) {
  const [open, setOpen] = useState<number | null>(0);

  const bgColor      = (css?.faq_bg_color      as string) || '#0d0d24';
  const headingSize  = (css?.faq_heading_size  as number) || 30;
  const headingBarBg = (css?.faq_heading_color as string) || '#6366f1';
  const boxBg        = (css?.faq_box_bg_color  as string) || 'rgba(255,255,255,0.04)';
  const titleSize    = (css?.faq_title_size    as number) || 16;
  const titleColor   = (css?.faq_title_color   as string) || '#f1f5f9';
  const descSize     = (css?.faq_desc_size     as number) || 14;
  const descColor    = (css?.faq_desc_color    as string) || '#94a3b8';

  if (!faqs.length) return null;

  return (
    <section style={{ background: bgColor, padding: '80px 24px' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6366f1', display: 'block', marginBottom: 12 }}>Got Questions?</span>
          <h2 style={{ margin: 0, fontSize: headingSize, color: '#f1f5f9', fontWeight: 800, letterSpacing: '-0.02em' }}>Frequently Asked Questions</h2>
          <div style={{ width: 48, height: 3, background: `linear-gradient(90deg, ${headingBarBg}, #8b5cf6)`, borderRadius: 2, margin: '18px auto 0' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: open === i ? 'rgba(99,102,241,0.08)' : boxBg, border: `1px solid ${open === i ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: titleSize, color: open === i ? '#a5b4fc' : titleColor, fontWeight: open === i ? 600 : 500, textAlign: 'left', gap: 12 }}
              >
                <span style={{ flex: 1 }}>{faq.question}</span>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: open === i ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s', transform: open === i ? 'rotate(180deg)' : 'none' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={open === i ? '#a5b4fc' : '#64748b'} strokeWidth="2.5"><polyline points="6 9 12 15 18 9" /></svg>
                </div>
              </button>
              {open === i && (
                <div style={{ padding: '0 22px 20px', fontSize: descSize, color: descColor, lineHeight: 1.75 }} dangerouslySetInnerHTML={{ __html: faq.answer }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
