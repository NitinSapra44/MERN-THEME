import { getSiteSettings, getPageContent } from '@/lib/getSiteSettings';
import FaqAccordion from '@/components/FaqAccordion';
import TimerButton from '@/components/TimerButton';
import db from '@/lib/db';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { content } = await getPageContent(locale);
  return { title: content?.meta_title, description: content?.meta_description, keywords: content?.meta_keyword };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [{ content, faqs, features, screenshots }, { settings, css }] = await Promise.all([
    getPageContent(locale),
    getSiteSettings(),
  ]);

  // Total download count for social proof
  let totalDownloads = 0;
  try {
    const { rows } = await db.query('SELECT COALESCE(SUM(download_count),0) as total FROM apk_versions');
    totalDownloads = Number(rows[0]?.total ?? 0);
  } catch { /* optional */ }

  const prefix = locale === 'en' ? '' : `/${locale}`;

  // CSS values — all overridable from Admin › CSS & Design
  const btnBg   = css?.btn_bg_color   || '#6366f1';
  const btnText = css?.btn_text_color || '#ffffff';
  const btnPt   = css?.btn_padding_top    ?? 16;
  const btnPb   = css?.btn_padding_bottom ?? 16;
  const btnPl   = css?.btn_padding_left   ?? 36;
  const btnPr   = css?.btn_padding_right  ?? 36;
  const btnFs   = css?.btn_font_size ?? 17;
  const secColor  = css?.security_color || 'rgba(255,255,255,0.65)';
  const secSize   = css?.security_size  ?? 13;
  const iconColor = css?.icon_color || '#ffffff';
  const iconSize  = css?.icon_size  ?? 14;
  const textColor = css?.text_color  || '#374151';
  const fontSize  = css?.font_size   ?? 16;
  const h1Size    = css?.h1_size     ?? 62;
  const h1Color   = css?.h1_color    || '#ffffff';
  const homeHeadingSize  = css?.home_heading_size  ?? 36;
  const homeHeadingColor = css?.home_heading_color || '#111827';
  const homeDescSize     = css?.home_desc_size     ?? 16;
  const homeDescColor    = css?.home_desc_color    || '#4b5563';
  const featuredBg            = css?.featured_bg_color       || '#0b0b20';
  const featuredHeadingSize   = css?.featured_heading_size   ?? 32;
  const featuredHeadingColor  = css?.featured_heading_color  || '#f1f5f9';
  const featuredIconBg        = css?.featured_icon_bg_color  || 'rgba(99,102,241,0.15)';
  const featuredIconTextSize  = css?.featured_icon_text_size ?? 14;
  const bgPadding      = css?.bg_padding      ?? 28;
  const bgHeadingSize  = css?.bg_heading_size  ?? 18;
  const bgHeadingColor = css?.bg_heading_color || '#f1f5f9';
  const bgTextSize     = css?.bg_text_size     ?? 14;
  const bgTextColor    = css?.bg_text_color    || '#94a3b8';
  const h2GenSize = css?.h2_general_size ?? 22;

  const hasImage = !!content?.banner_image;

  return (
    <div style={{ background: '#07071a', color: '#f1f5f9', fontFamily: 'inherit' }}>

      {/* ════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════ */}
      <section className="hero-section" style={{ position: 'relative', overflow: 'hidden', minHeight: '92vh', display: 'flex', alignItems: 'center', padding: '80px 28px' }}>

        {/* Background layers */}
        <div className="hero-bg" style={{ position: 'absolute', inset: 0 }}>
          {/* Base gradient */}
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(99,102,241,0.28) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 100% 50%, rgba(139,92,246,0.18) 0%, transparent 55%), linear-gradient(180deg, #0a0820 0%, #07071a 60%, #050514 100%)' }} />
          {/* Dot grid */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(99,102,241,0.18) 1px, transparent 1px)', backgroundSize: '40px 40px', maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)', WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)' }} />
          {/* Animated orbs */}
          <div className="orb orb1" />
          <div className="orb orb2" />
          <div className="orb orb3" />
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: hasImage ? '1fr 1fr' : '1fr', gap: 64, alignItems: 'center', position: 'relative', zIndex: 1 }}>

          {/* ── Left: Text ── */}
          <div className={hasImage ? '' : 'hero-center'} style={{ textAlign: hasImage ? 'left' : 'center' }}>

            {/* Eyebrow badge */}
            <div className={hasImage ? '' : 'hero-center-flex'} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
              <div className="eyebrow-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.35)', backdropFilter: 'blur(10px)' }}>
                <span className="badge-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: '#6366f1', display: 'inline-block' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#a5b4fc', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {settings?.website_name || 'Official App'} — Free Download
                </span>
              </div>
            </div>

            {/* H1 */}
            <h1 className="hero-h1" style={{ fontSize: h1Size, margin: '0 0 22px', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', maxWidth: 640 }}>
              <span className="gradient-text">{content?.banner_title || settings?.website_name || 'Download Any Video, Instantly'}</span>
            </h1>

            {/* Subtitle */}
            <p style={{ fontSize: 19, color: 'rgba(255,255,255,0.58)', margin: '0 0 44px', lineHeight: 1.65, maxWidth: 520 }}>
              {content?.banner_subtitle}
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', justifyContent: hasImage ? 'flex-start' : 'center', marginBottom: 40 }}>
              {/* If banner_buttons JSON array has entries, render those; otherwise fall back to single button */}
              {(content?.banner_buttons_parsed?.length > 0
                ? content.banner_buttons_parsed
                : [{ text: content?.banner_button_text || 'Download Free', url: `${prefix}/${content?.download_slug || 'download'}`, timer_seconds: content?.banner_button_timer || 0 }]
              ).map((btn: { text: string; url: string; timer_seconds?: number }, i: number) => (
                <TimerButton
                  key={i}
                  href={btn.url || `${prefix}/download`}
                  text={btn.text || 'Download'}
                  timerSeconds={btn.timer_seconds || 0}
                  className={i === 0 ? 'btn-primary' : undefined}
                  style={i === 0
                    ? { display: 'inline-flex', alignItems: 'center', gap: 10, background: btnBg, color: btnText, padding: `${btnPt}px ${btnPr}px ${btnPb}px ${btnPl}px`, fontSize: btnFs, fontWeight: 800, borderRadius: 12, textDecoration: 'none', letterSpacing: '-0.01em' }
                    : { display: 'inline-flex', alignItems: 'center', gap: 7, padding: '15px 26px', borderRadius: 12, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.75)', fontSize: 16, fontWeight: 600, textDecoration: 'none', backdropFilter: 'blur(10px)' }
                  }
                />
              ))}
            </div>

            {/* Trust / stats row */}
            {totalDownloads > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, justifyContent: hasImage ? 'flex-start' : 'center' }}>
                <div style={{ display: 'flex' }}>
                  {['👤','👤','👤'].map((e, i) => (
                    <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: `hsl(${240 + i * 20}, 70%, 55%)`, border: '2px solid #07071a', marginLeft: i > 0 ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>{e}</div>
                  ))}
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                  <strong style={{ color: '#a5b4fc' }}>{totalDownloads.toLocaleString()}+</strong> downloads
                </span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>·</span>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>⭐ Free & Safe</span>
              </div>
            )}

            {/* Security badges */}
            {(content?.security_icon1 || content?.security_icon2 || content?.security_icon3) && (
              <div style={{ marginTop: 8 }}>
                {content?.security_info && <p style={{ fontSize: secSize, color: secColor, fontWeight: 600, margin: '0 0 10px' }}>{content.security_info}</p>}
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: hasImage ? 'flex-start' : 'center' }}>
                  {[1, 2, 3].map(n => {
                    const iconSrc = content?.[`security_icon${n}`];
                    const iconName = content?.[`security_icon${n}_name`];
                    if (!iconSrc && !iconName) return null;
                    return (
                      <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', background: 'rgba(255,255,255,0.06)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)' }}>
                        {iconSrc && <img src={iconSrc} alt={iconName || ''} style={{ height: iconSize * 2, width: iconSize * 2, objectFit: 'contain' }} />}
                        {iconName && <span style={{ fontSize: iconSize, color: iconColor, fontWeight: 600 }}>{iconName}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Mockup ── */}
          {hasImage && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <div className="mockup-glow" />
              <div className="mockup-ring" />
              <img className="mockup-img" src={content.banner_image} alt="App preview" style={{ maxHeight: 540, maxWidth: '100%', objectFit: 'contain', position: 'relative', zIndex: 2 }} />
              {/* Floating stat card */}
              <div className="float-card float-card-1" style={{ position: 'absolute', top: '12%', right: '-8%', zIndex: 3 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>Free Download</span>
              </div>
              <div className="float-card float-card-2" style={{ position: 'absolute', bottom: '18%', left: '-6%', zIndex: 3 }}>
                <span style={{ fontSize: 18 }}>⬇️</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9' }}>{totalDownloads > 0 ? `${totalDownloads.toLocaleString()}+` : 'Millions'}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>Downloads</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(transparent, #07071a)', pointerEvents: 'none', zIndex: 2 }} />
      </section>

      {/* ════════════════════════════════════════════
          INTRO
      ════════════════════════════════════════════ */}
      {(content?.intro_title || content?.intro_description) && (
        <section style={{ background: '#ffffff', padding: '80px 28px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            {content?.intro_title && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <div style={{ width: 4, height: 42, background: 'linear-gradient(180deg, #6366f1, #8b5cf6)', borderRadius: 2, flexShrink: 0 }} />
                <h2 style={{ margin: 0, fontSize: h2GenSize, color: '#0f172a', fontWeight: 800, letterSpacing: '-0.02em' }}>{content.intro_title}</h2>
              </div>
            )}
            {content?.intro_description && (
              <div className="rc" style={{ fontSize, color: textColor, lineHeight: 1.85 }} dangerouslySetInnerHTML={{ __html: content.intro_description }} />
            )}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          FEATURES
      ════════════════════════════════════════════ */}
      {features.length > 0 && (
        <section style={{ background: featuredBg, padding: '88px 28px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
            {content?.feature_title && (
              <div style={{ textAlign: 'center', marginBottom: 64 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#818cf8', display: 'block', marginBottom: 14 }}>Why Us</span>
                <h2 style={{ margin: 0, fontSize: featuredHeadingSize, color: featuredHeadingColor, fontWeight: 900, letterSpacing: '-0.025em' }}>{content.feature_title}</h2>
                <div style={{ width: 56, height: 3, background: 'linear-gradient(90deg, #6366f1, #a78bfa)', borderRadius: 2, margin: '20px auto 0' }} />
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {features.map((feat, i) => (
                <div key={i} className="feature-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 18, padding: bgPadding, textAlign: 'center', backdropFilter: 'blur(12px)' }}>
                  <div style={{ width: 64, height: 64, margin: '0 auto 20px', background: featuredIconBg, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(99,102,241,0.2)' }}>
                    {feat.icon
                      ? <img src={feat.icon} alt={feat.title} style={{ height: 34, width: 34, objectFit: 'contain' }} />
                      : <span style={{ fontSize: 28 }}>⚡</span>}
                  </div>
                  <h3 style={{ fontSize: bgHeadingSize, color: bgHeadingColor, margin: '0 0 10px', fontWeight: 700, letterSpacing: '-0.01em' }}>{feat.title}</h3>
                  {feat.description && <p style={{ fontSize: featuredIconTextSize, color: bgTextColor, margin: 0, lineHeight: 1.7 }}>{feat.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          SCREENSHOTS
      ════════════════════════════════════════════ */}
      {screenshots.length > 0 && (
        <section style={{ background: '#07071a', padding: '88px 28px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 60 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#818cf8', display: 'block', marginBottom: 14 }}>Gallery</span>
              <h2 style={{ margin: 0, fontSize: 32, color: '#f1f5f9', fontWeight: 900, letterSpacing: '-0.025em' }}>See It In Action</h2>
              <div style={{ width: 56, height: 3, background: 'linear-gradient(90deg, #6366f1, #a78bfa)', borderRadius: 2, margin: '20px auto 0' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {screenshots.map((ss, i) => (
                <div key={i} style={{ background: ss.bg_color || 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden' }}>
                  {ss.image && (
                    <div style={{ background: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', padding: '28px 24px 0' }}>
                      <img src={ss.image} alt={ss.heading} style={{ maxHeight: 280, maxWidth: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 28px rgba(0,0,0,0.6))' }} />
                    </div>
                  )}
                  <div style={{ padding: 24 }}>
                    {ss.heading && <h3 style={{ fontSize: bgHeadingSize, color: bgHeadingColor, margin: '0 0 8px', fontWeight: 700 }}>{ss.heading}</h3>}
                    {ss.description && <p style={{ fontSize: bgTextSize, color: bgTextColor, margin: 0, lineHeight: 1.65 }}>{ss.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          HOME INFO
      ════════════════════════════════════════════ */}
      {(content?.home_info_title || content?.home_info_description) && (
        <section style={{ background: '#f8f9ff', padding: '88px 28px' }}>
          <div style={{ maxWidth: 960, margin: '0 auto' }}>
            {content?.home_info_title && (
              <div style={{ textAlign: 'center', marginBottom: 44 }}>
                {settings?.article_main_image && <img src={settings.article_main_image} alt={content.home_info_title} style={{ height: 72, width: 'auto', objectFit: 'contain', marginBottom: 20 }} />}
                <h2 style={{ fontSize: homeHeadingSize, color: homeHeadingColor, margin: 0, fontWeight: 900, letterSpacing: '-0.025em' }}>{content.home_info_title}</h2>
                <div style={{ width: 56, height: 3, background: 'linear-gradient(90deg, #6366f1, #a78bfa)', borderRadius: 2, margin: '18px auto 0' }} />
              </div>
            )}
            {content?.home_info_description && (
              <div className="rcl" style={{ fontSize: homeDescSize, color: homeDescColor, lineHeight: 1.85 }} dangerouslySetInnerHTML={{ __html: content.home_info_description }} />
            )}
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          FAQs
      ════════════════════════════════════════════ */}
      <FaqAccordion faqs={faqs} css={css} title={content?.faqs_title} />

      {/* ════════════════════════════════════════════
          GLOBAL STYLES
      ════════════════════════════════════════════ */}
      <style>{`
        /* Animated orbs */
        .orb { position: absolute; border-radius: 50%; filter: blur(60px); pointer-events: none; }
        .orb1 { width: 520px; height: 520px; top: -15%; right: -5%; background: radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%); animation: orbFloat 8s ease-in-out infinite; }
        .orb2 { width: 400px; height: 400px; bottom: -10%; left: -8%; background: radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%); animation: orbFloat 10s ease-in-out infinite reverse; }
        .orb3 { width: 300px; height: 300px; top: 40%; left: 35%; background: radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%); animation: orbFloat 12s ease-in-out infinite 2s; }
        @keyframes orbFloat { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(24px,-18px) scale(1.04); } 66% { transform: translate(-16px,12px) scale(0.97); } }

        /* Gradient heading text */
        .gradient-text { background: linear-gradient(135deg, #ffffff 0%, #e0e7ff 40%, #c4b5fd 70%, #a78bfa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

        /* Primary button glow */
        .btn-primary { box-shadow: 0 0 40px rgba(99,102,241,0.5), 0 8px 24px rgba(0,0,0,0.4); transition: transform 0.15s, box-shadow 0.2s; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 0 60px rgba(99,102,241,0.7), 0 12px 32px rgba(0,0,0,0.5); }

        /* Badge pulse dot */
        .badge-dot { box-shadow: 0 0 0 3px rgba(99,102,241,0.25); animation: pulseDot 2s ease-in-out infinite; }
        @keyframes pulseDot { 0%,100% { box-shadow: 0 0 0 3px rgba(99,102,241,0.25); } 50% { box-shadow: 0 0 0 6px rgba(99,102,241,0.08); } }

        /* Mockup */
        .mockup-glow { position: absolute; width: 380px; height: 380px; border-radius: 50%; background: radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%); filter: blur(40px); z-index: 0; }
        .mockup-ring { position: absolute; width: 420px; height: 420px; border-radius: 50%; border: 1px solid rgba(99,102,241,0.15); z-index: 0; animation: ringPulse 3s ease-in-out infinite; }
        @keyframes ringPulse { 0%,100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.05); opacity: 1; } }
        .mockup-img { animation: imgFloat 5s ease-in-out infinite; filter: drop-shadow(0 24px 64px rgba(0,0,0,0.7)); }
        @keyframes imgFloat { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-14px); } }

        /* Floating cards */
        .float-card { display: flex; align-items: center; gap: 10px; padding: 10px 16px; background: rgba(15,15,40,0.85); backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
        .float-card-1 { animation: floatCard1 4s ease-in-out infinite; }
        .float-card-2 { animation: floatCard2 5s ease-in-out infinite; }
        @keyframes floatCard1 { 0%,100% { transform: translateY(0) rotate(-1deg); } 50% { transform: translateY(-8px) rotate(0deg); } }
        @keyframes floatCard2 { 0%,100% { transform: translateY(0) rotate(1deg); } 50% { transform: translateY(-10px) rotate(0deg); } }

        /* Feature cards hover */
        .feature-card { transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
        .feature-card:hover { border-color: rgba(99,102,241,0.45); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(99,102,241,0.2); }

        /* Center hero when no image */
        .hero-center { display: flex; flex-direction: column; align-items: center; }
        .hero-center-flex { justify-content: center; }

        /* Rich content */
        .rc h2 { font-size: ${h2GenSize}px; color: #0f172a; font-weight: 800; margin: 32px 0 14px; padding-left: 16px; border-left: 4px solid #6366f1; }
        .rc h3 { font-size: ${css?.h3_size ?? 18}px; color: ${css?.h3_color || '#1e293b'}; margin: 22px 0 10px; font-weight: 700; }
        .rc p { margin: 0 0 16px; } .rc ul,.rc ol { padding-left: 24px; margin: 10px 0 18px; } .rc li { margin-bottom: 8px; line-height: 1.75; } .rc a { color: #6366f1; }
        .rcl h2 { font-size: ${h2GenSize}px; color: ${homeHeadingColor}; font-weight: 800; margin: 32px 0 14px; padding: 12px 20px; background: rgba(99,102,241,0.07); border-left: 4px solid #6366f1; border-radius: 0 10px 10px 0; }
        .rcl h3 { font-size: ${css?.h3_size ?? 18}px; color: #1e293b; margin: 22px 0 10px; font-weight: 700; }
        .rcl p { margin: 0 0 16px; } .rcl ul,.rcl ol { padding-left: 24px; margin: 10px 0 18px; } .rcl li { margin-bottom: 8px; line-height: 1.75; } .rcl a { color: #6366f1; }

        /* Mobile */
        @media (max-width: 860px) {
          .hero-section { min-height: auto !important; padding: 64px 20px 56px !important; }
          .hero-h1 { font-size: 38px !important; }
          .float-card { display: none !important; }
        }
      `}</style>
    </div>
  );
}
