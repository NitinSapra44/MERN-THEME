import { getSiteSettings, getPageContent } from '@/lib/getSiteSettings';
import db from '@/lib/db';
import DownloadTracker from './DownloadTracker';
import TimerButton from '@/components/TimerButton';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { rows } = await db.query("SELECT * FROM page_seo WHERE page_key='download' LIMIT 1");
  const seo = rows[0];
  const { content } = await getPageContent(locale);
  return {
    title: seo?.meta_title || content?.download_meta_title,
    description: seo?.meta_description || content?.download_meta_description,
    keywords: seo?.meta_keywords || content?.download_meta_keyword,
    robots: seo?.robots || 'index, follow',
    openGraph: seo?.og_title ? { title: seo.og_title, description: seo.og_description, images: seo.og_image ? [seo.og_image] : [] } : undefined,
    alternates: seo?.canonical_url ? { canonical: seo.canonical_url } : undefined,
  };
}

export default async function DownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [{ content }, { css }, { rows: versions }] = await Promise.all([
    getPageContent(locale),
    getSiteSettings(),
    db.query('SELECT * FROM apk_versions ORDER BY sort_order ASC, id DESC'),
  ]);

  const latest      = versions.find(v => v.is_latest === 1) ?? versions[0];
  const oldVersions = versions.filter(v => v.id !== latest?.id);

  const btnBg  = css?.btn_bg_color   || '#6366f1';
  const btnText = css?.btn_text_color || '#ffffff';
  const btnPt  = css?.btn_padding_top    ?? 16;
  const btnPb  = css?.btn_padding_bottom ?? 16;
  const btnPl  = css?.btn_padding_left   ?? 36;
  const btnPr  = css?.btn_padding_right  ?? 36;
  const btnFs  = css?.btn_font_size ?? 18;
  const fontSize  = css?.font_size ?? 16;
  const textColor = css?.text_color || '#94a3b8';
  const h2GenSize = css?.h2_general_size ?? 22;
  const h3Size    = css?.h3_size ?? 18;
  const h3Color   = css?.h3_color || '#e2e8f0';

  const badge = (label: string, icon: string) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '16px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12 }}>
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ fontSize: 13, color: '#94a3b8' }}>{label}</span>
    </div>
  );

  return (
    <div style={{ background: '#07071a', minHeight: '80vh', color: '#f1f5f9' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0a0a22 0%, #0f0b30 60%, #0a0a22 100%)', padding: '80px 24px 72px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6366f1', display: 'block', marginBottom: 14 }}>Latest Release</span>
          <h1 style={{ fontSize: 46, color: '#f1f5f9', margin: '0 0 14px', fontWeight: 800, letterSpacing: '-0.025em' }}>
            {content?.download_page_title || 'Download the App'}
          </h1>
          {content?.download_page_description && (
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', margin: '0 auto 36px', maxWidth: 560, lineHeight: 1.65 }}>
              {content.download_page_description}
            </p>
          )}

          {/* Download buttons */}
          <div style={{ marginBottom: 32, display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center' }}>
            {/* Primary download tracker button */}
            {latest ? (
              <DownloadTracker version={latest} btnBg={btnBg} btnText={btnText} btnPt={btnPt} btnPb={btnPb} btnPl={btnPl} btnPr={btnPr} btnFs={btnFs} buttonName={content?.download_button_name || 'Download APK'} timerSeconds={content?.download_button_timer || 0} />
            ) : content?.download_button_url ? (
              <TimerButton href={content.download_button_url} text={content?.download_button_name || 'Download APK'} timerSeconds={content?.download_button_timer || 0} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: btnBg, color: btnText, padding: `${btnPt}px ${btnPr}px ${btnPb}px ${btnPl}px`, fontSize: btnFs, fontWeight: 700, borderRadius: 12, textDecoration: 'none', boxShadow: `0 0 40px rgba(99,102,241,0.4)` }} />
            ) : null}
            {/* Extra download buttons from JSON */}
            {(content?.download_buttons_parsed || []).map((btn: { text: string; url: string; timer_seconds?: number }, i: number) => (
              <TimerButton key={i} href={btn.url} text={btn.text} timerSeconds={btn.timer_seconds || 0}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#e2e8f0', padding: `${btnPt}px ${btnPr}px ${btnPb}px ${btnPl}px`, fontSize: btnFs, fontWeight: 600, borderRadius: 12, textDecoration: 'none' }}
              />
            ))}
          </div>

          {/* Version badges */}
          {latest && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              {badge(`v${latest.version_name}`, '🏷️')}
              {latest.file_size && badge(latest.file_size, '📦')}
              {latest.min_android && badge(latest.min_android, '🤖')}
              {latest.download_count > 0 && badge(`${Number(latest.download_count).toLocaleString()} downloads`, '⬇️')}
            </div>
          )}
        </div>
      </section>

      {/* ── CHANGELOG ── */}
      {latest?.changelog && (
        <section style={{ padding: '56px 24px 0' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 4, height: 36, background: 'linear-gradient(180deg, #6366f1, #8b5cf6)', borderRadius: 2, flexShrink: 0 }} />
              <h2 style={{ margin: 0, fontSize: h2GenSize, color: '#f1f5f9', fontWeight: 700 }}>What&apos;s New in v{latest.version_name}</h2>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 16, padding: '28px 32px' }}>
              <div className="dl-rich" style={{ fontSize, color: textColor, lineHeight: 1.85 }} dangerouslySetInnerHTML={{ __html: latest.changelog }} />
            </div>
          </div>
        </section>
      )}

      {/* ── PAGE CONTENT ── */}
      {content?.download_page_content && (
        <section style={{ padding: '48px 24px 0' }}>
          <div style={{ maxWidth: 860, margin: '0 auto', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '32px' }}>
            <div className="dl-rich" style={{ fontSize, color: textColor, lineHeight: 1.85 }} dangerouslySetInnerHTML={{ __html: content.download_page_content }} />
          </div>
        </section>
      )}

      {/* ── OLD VERSIONS ── */}
      {oldVersions.length > 0 && (
        <section style={{ padding: '48px 24px 72px' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <div style={{ width: 4, height: 36, background: 'linear-gradient(180deg, #6366f1, #8b5cf6)', borderRadius: 2, flexShrink: 0 }} />
              <h2 style={{ margin: 0, fontSize: h2GenSize, color: '#f1f5f9', fontWeight: 700 }}>{content?.old_version_title || 'Previous Versions'}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {oldVersions.map(v => (
                <div key={v.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 22px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 15 }}>v{v.version_name}</span>
                    {v.file_size && <span style={{ fontSize: 13, color: '#64748b' }}>{v.file_size}</span>}
                    {v.min_android && <span style={{ fontSize: 13, color: '#64748b' }}>{v.min_android}</span>}
                  </div>
                  <DownloadTracker version={v} btnBg="rgba(99,102,241,0.15)" btnText="#a5b4fc" btnPt={8} btnPb={8} btnPl={18} btnPr={18} btnFs={13} buttonName="Download" small />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .dl-rich * { color: inherit !important; }
        .dl-rich h2 { font-size: ${h2GenSize}px; color: #f1f5f9 !important; font-weight: 700; margin: 28px 0 14px; border-bottom: 1px solid rgba(99,102,241,0.2); padding-bottom: 10px; }
        .dl-rich h3 { font-size: ${h3Size}px; color: ${h3Color} !important; margin: 20px 0 10px; font-weight: 600; }
        .dl-rich p { margin: 0 0 16px; color: ${textColor} !important; }
        .dl-rich ul, .dl-rich ol { padding-left: 24px; margin: 10px 0 18px; }
        .dl-rich li { margin-bottom: 8px; line-height: 1.75; color: ${textColor} !important; }
        .dl-rich li::marker { color: #6366f1; }
        .dl-rich a { color: #818cf8 !important; }
        .dl-rich strong, .dl-rich b { color: #e2e8f0 !important; }
        .dl-rich span { color: inherit !important; }
      `}</style>
    </div>
  );
}
