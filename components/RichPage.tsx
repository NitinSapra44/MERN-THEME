import { getSiteSettings } from '@/lib/getSiteSettings';

interface Props { title: string; content: string; }

export default async function RichPage({ title, content }: Props) {
  const { css } = await getSiteSettings();
  const fontSize  = css?.font_size   ?? 16;
  const textColor = css?.text_color  || '#374151';
  const h2GenSize = css?.h2_general_size ?? 22;
  const h3Size    = css?.h3_size ?? 18;
  const h3Color   = css?.h3_color || '#1f2937';

  return (
    <div style={{ background: '#07071a', minHeight: '80vh' }}>
      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0a0a22 0%, #0f0b30 60%, #0a0a22 100%)', padding: '72px 24px 64px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6366f1', display: 'block', marginBottom: 16 }}>Information</span>
          <h1 style={{ fontSize: 42, color: '#f1f5f9', margin: 0, fontWeight: 800, letterSpacing: '-0.025em' }}>{title}</h1>
          <div style={{ width: 48, height: 3, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 2, margin: '20px auto 0' }} />
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '64px 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '48px 52px' }}>
          <div
            className="rich-page-content"
            style={{ fontSize, color: textColor, lineHeight: 1.85 }}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </section>

      <style>{`
        .rich-page-content { color: #94a3b8; }
        .rich-page-content h2 { font-size: ${h2GenSize}px; color: #f1f5f9; font-weight: 700; margin: 36px 0 16px; padding-bottom: 12px; border-bottom: 1px solid rgba(99,102,241,0.25); }
        .rich-page-content h3 { font-size: ${h3Size}px; color: ${h3Color === '#222' ? '#e2e8f0' : h3Color}; margin: 24px 0 10px; font-weight: 600; }
        .rich-page-content p { margin: 0 0 18px; line-height: 1.85; }
        .rich-page-content ul, .rich-page-content ol { padding-left: 24px; margin: 10px 0 20px; }
        .rich-page-content li { margin-bottom: 8px; line-height: 1.75; }
        .rich-page-content a { color: #818cf8; text-decoration: underline; }
        .rich-page-content strong { color: #e2e8f0; font-weight: 600; }
        @media (max-width: 640px) { .rich-page-content { padding: 32px 24px !important; } }
      `}</style>
    </div>
  );
}
