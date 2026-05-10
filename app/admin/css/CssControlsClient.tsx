'use client';
import { useState } from 'react';

// ─── Shared styles ────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: '#12121e',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 14, padding: '28px 28px', marginBottom: 18,
};
const label: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600,
  color: '#94a3b8', marginBottom: 6,
  textTransform: 'uppercase', letterSpacing: '0.05em',
};
const hint: React.CSSProperties = {
  fontSize: 11, color: '#64748b', marginTop: 4, lineHeight: 1.4,
};
const input: React.CSSProperties = {
  width: '100%', padding: '9px 12px',
  background: '#1a1a2e',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, color: '#e2e8f0',
  fontSize: 13, boxSizing: 'border-box',
};
const noteBox: React.CSSProperties = {
  background: 'rgba(245,158,11,0.08)',
  border: '1px solid rgba(245,158,11,0.2)',
  borderRadius: 8, padding: '10px 14px',
  fontSize: 12, color: '#fbbf24',
  marginBottom: 20, lineHeight: 1.5,
};
const infoBox: React.CSSProperties = {
  background: 'rgba(99,102,241,0.06)',
  border: '1px solid rgba(99,102,241,0.18)',
  borderRadius: 8, padding: '10px 14px',
  fontSize: 12, color: '#a5b4fc',
  marginBottom: 20, lineHeight: 1.5,
};
const row3: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 };
const row2: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 };
const row4: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 16 };

// ─── Section header ────────────────────────────────────────────────────────────
function SectionHeader({ num, title, where }: { num: number; title: string; where: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{
        minWidth: 34, height: 34, borderRadius: 9,
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0,
      }}>{num}</div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12, color: '#64748b' }}>{where}</div>
      </div>
    </div>
  );
}

export default function CssControlsClient({ data }: { data: any }) {
  const [form, setForm] = useState(data);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((prev: any) => ({ ...prev, [e.target.name]: val }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch('/api/css', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  // Color field: swatch + hex text input
  function ColorField({ name, lbl, hintText }: { name: string; lbl: string; hintText?: string }) {
    return (
      <div>
        <label style={label}>{lbl}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="color" name={name} value={form[name] ?? '#000000'} onChange={handleChange}
            style={{ width: 40, height: 34, borderRadius: 7, border: '2px solid rgba(255,255,255,0.12)', cursor: 'pointer', padding: 2, background: 'transparent', flexShrink: 0 }} />
          <input name={name} value={form[name] ?? ''} onChange={handleChange}
            style={{ ...input, flex: 1, fontFamily: 'monospace', fontSize: 12 }} />
        </div>
        {hintText && <div style={hint}>{hintText}</div>}
      </div>
    );
  }

  // Number field
  function NumField({ name, lbl, hintText, unit = 'px' }: { name: string; lbl: string; hintText?: string; unit?: string }) {
    return (
      <div>
        <label style={label}>{lbl}</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="number" name={name} value={form[name] ?? ''} onChange={handleChange}
            style={{ ...input }} />
          <span style={{ fontSize: 11, color: '#475569', flexShrink: 0 }}>{unit}</span>
        </div>
        {hintText && <div style={hint}>{hintText}</div>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 920 }}>
      {saved && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)',
          color: '#34d399', padding: '12px 18px', borderRadius: 10, marginBottom: 20,
          fontSize: 14, fontWeight: 500,
        }}>✓ CSS settings saved! Refresh the site to see changes.</div>
      )}

      {/* ── Page anatomy diagram ───────────────────────────────────── */}
      <div style={{ ...card, marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
          Page Layout Guide — what each section controls
        </div>
        <div style={{ fontSize: 12, color: '#64748b', marginBottom: 16 }}>
          The boxes below represent the public homepage top-to-bottom. Click any section number to jump to its settings.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, overflow: 'hidden' }}>
          {[
            { n: 1, label: 'Hero Banner', sub: 'App title, download button, security icons', bg: '#1e1e30', accent: '#6366f1' },
            { n: 2, label: 'Intro Section', sub: 'Short description below the hero (white background)', bg: '#1a2030', accent: '#3b82f6' },
            { n: 3, label: 'Features Grid', sub: 'App feature cards with icons', bg: '#1a2820', accent: '#10b981' },
            { n: 4, label: 'Screenshots Section', sub: 'Screenshot cards — shares card heading/text colors with Features', bg: '#201a20', accent: '#8b5cf6' },
            { n: 5, label: 'Home Info Section', sub: 'Main information block with heading and rich text', bg: '#1a2030', accent: '#3b82f6' },
            { n: 6, label: 'FAQ Section', sub: 'Accordion questions and answers', bg: '#201e1a', accent: '#f59e0b' },
          ].map((sec) => (
            <div key={sec.n} style={{
              background: sec.bg, padding: '10px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
              borderLeft: `3px solid ${sec.accent}`,
            }}>
              <div style={{
                minWidth: 24, height: 24, borderRadius: 6,
                background: sec.accent, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0,
              }}>{sec.n}</div>
              <div>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{sec.label}</span>
                <span style={{ fontSize: 11, color: '#64748b', marginLeft: 10 }}>{sec.sub}</span>
              </div>
            </div>
          ))}
          <div style={{
            background: '#1a1a2a', padding: '10px 16px',
            display: 'flex', alignItems: 'center', gap: 12,
            borderLeft: '3px solid #ec4899',
          }}>
            <div style={{
              minWidth: 24, height: 24, borderRadius: 6,
              background: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, fontWeight: 800, color: '#fff', flexShrink: 0,
            }}>B</div>
            <div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>Blog / Article Pages</span>
              <span style={{ fontSize: 11, color: '#64748b', marginLeft: 10 }}>Typography for /blogs/[slug] pages</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave}>

        {/* ══════════════════════════════════════════════════════
            SECTION 1 — HERO BANNER
        ══════════════════════════════════════════════════════ */}
        <div style={card}>
          <SectionHeader num={1} title="Hero Banner" where="The top dark section — app title, download button, security icons" />

          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            App Title (the big heading — e.g. "VidNova")
          </div>
          <div style={row2}>
            <NumField name="h1_size" lbl="App Title Font Size" hintText="Default: 42px — controls the big H1 app name in the hero" />
            <ColorField name="h1_color" lbl="App Title Color" hintText="Default: #ffffff (white)" />
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginBottom: 16, marginTop: 4 }} />

          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Download Button
          </div>
          <div style={row3}>
            <ColorField name="btn_bg_color" lbl="Button Background" hintText="Default: #fbbf24 (yellow)" />
            <ColorField name="btn_text_color" lbl="Button Text Color" hintText="Default: #000000 (black)" />
            <NumField name="btn_font_size" lbl="Button Font Size" hintText="Default: 18px" />
          </div>
          <div style={row4}>
            <NumField name="btn_padding_top" lbl="Padding Top" hintText="Default: 12" />
            <NumField name="btn_padding_right" lbl="Padding Right" hintText="Default: 28" />
            <NumField name="btn_padding_bottom" lbl="Padding Bottom" hintText="Default: 12" />
            <NumField name="btn_padding_left" lbl="Padding Left" hintText="Default: 28" />
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginBottom: 16, marginTop: 4 }} />

          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Security Info (icons below the button)
          </div>
          <div style={row2}>
            <ColorField name="security_color" lbl="Security Text Color" hintText="Color of the 'Trusted by millions…' text" />
            <NumField name="security_size" lbl="Security Text Size" hintText="Default: 14px" />
          </div>
          <div style={row2}>
            <ColorField name="icon_color" lbl="Icon Name Color" hintText="Color of the security icon labels (e.g. 'Virus Free')" />
            <NumField name="icon_size" lbl="Icon Name Size" hintText="Default: 14px — icon image will be 2× this size" />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 2 — INTRO SECTION
        ══════════════════════════════════════════════════════ */}
        <div style={card}>
          <SectionHeader num={2} title="Intro Section" where="White section right below the hero — intro title + description text" />
          <div style={row2}>
            <NumField name="font_size" lbl="Body Text Size" hintText="Default: 16px — also used on blog post body text" />
            <ColorField name="text_color" lbl="Body Text Color" hintText="Default: #000000 — also used on blog post body text" />
          </div>
          <div style={row2}>
            <NumField name="h2_general_size" lbl="H2 Heading Size" hintText="Default: 22px — size of H2 headings inside rich-text content areas (intro + home info + blogs)" />
            <div />
          </div>
          <div style={infoBox}>
            ℹ️ <strong>H2 headings in rich content always have a dark gradient bar background with white text</strong> — you can only control the font size here, not the background color.
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 3 — FEATURES GRID
        ══════════════════════════════════════════════════════ */}
        <div style={card}>
          <SectionHeader num={3} title="Features Grid" where="The app features cards section (grid of icon + title + description)" />
          <div style={row2}>
            <ColorField name="featured_bg_color" lbl="Section Background Color" hintText="Background of the entire features section (behind all cards)" />
            <NumField name="featured_heading_size" lbl="Section Heading Size" hintText="Default: 24px — size of the 'Key Features' bar heading" />
          </div>
          <div style={row2}>
            <ColorField name="featured_icon_bg_color" lbl="Icon Box Background" hintText="Background of the square icon container inside each feature card" />
            <NumField name="featured_icon_text_size" lbl="Feature Card Text Size" hintText="Default: 14px — description text; title will be 2px larger" />
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginBottom: 16, marginTop: 4 }} />
          <div style={noteBox}>
            ⚠️ <strong>Shared with Screenshots section:</strong> The card heading color, card heading size, card text color, card text size, and card padding below all apply to BOTH the Features cards AND the Screenshots cards.
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Card Typography (Features + Screenshots)
          </div>
          <div style={row3}>
            <NumField name="bg_heading_size" lbl="Card Heading Size" hintText="Default: 20px" />
            <ColorField name="bg_heading_color" lbl="Card Heading Color" hintText="Default: #ffffff — text color for card titles on both sections" />
            <NumField name="bg_padding" lbl="Card Padding" hintText="Default: 24px — inner spacing for all cards" />
          </div>
          <div style={row2}>
            <NumField name="bg_text_size" lbl="Card Body Text Size" hintText="Default: 14px" />
            <ColorField name="bg_text_color" lbl="Card Body Text Color" hintText="Default: #cccccc — description text in feature + screenshot cards" />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 4 — SCREENSHOTS (no extra controls — shared with 3)
        ══════════════════════════════════════════════════════ */}
        <div style={{ ...card, background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.04)' }}>
          <SectionHeader num={4} title="Screenshots Section" where="Dark section with screenshot cards" />
          <div style={noteBox}>
            ⚠️ The Screenshots section has no separate color controls — it shares the <strong>Card Typography</strong> settings from Section 3 (Features Grid) above. To change screenshot card heading/text colors, scroll up to the Features section.
          </div>
          <div style={infoBox}>
            ℹ️ Individual screenshot background colors are set per-card inside <strong>Admin → Languages → Features & Screenshots tab</strong>, using the "Card Background Color" field on each screenshot row.
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 5 — HOME INFO SECTION
        ══════════════════════════════════════════════════════ */}
        <div style={card}>
          <SectionHeader num={5} title="Home Info Section" where="White section with a main heading + large rich-text body" />
          <div style={row2}>
            <NumField name="home_heading_size" lbl="Section Heading Size" hintText="Default: 28px — the large heading above the info block" />
            <ColorField name="home_heading_color" lbl="Section Heading Color" hintText="Default: #000000 (black on white bg)" />
          </div>
          <div style={row2}>
            <NumField name="home_desc_size" lbl="Body Text Size" hintText="Default: 16px" />
            <ColorField name="home_desc_color" lbl="Body Text Color" hintText="Default: #555555" />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION 6 — FAQ SECTION
        ══════════════════════════════════════════════════════ */}
        <div style={card}>
          <SectionHeader num={6} title="FAQ Section" where="Accordion at the bottom of the homepage" />
          <div style={row3}>
            <ColorField name="faq_bg_color" lbl="Section Background" hintText="Background of the entire FAQ section" />
            <ColorField name="faq_heading_color" lbl="FAQ Bar Background" hintText="Background color of the 'FAQ's' heading bar — text is always white" />
            <NumField name="faq_heading_size" lbl="FAQ Heading Size" hintText="Default: 24px — text size inside the FAQ bar" />
          </div>
          <div style={noteBox}>
            ⚠️ <strong>FAQ heading bar color</strong> is the BACKGROUND of the bar, not the text color. The text inside the bar is always white regardless.
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Question / Answer Items
          </div>
          <div style={row2}>
            <ColorField name="faq_box_bg_color" lbl="Item Box Background" hintText="Background of each accordion question box" />
            <div />
          </div>
          <div style={row3}>
            <NumField name="faq_title_size" lbl="Question Text Size" hintText="Default: 16px" />
            <ColorField name="faq_title_color" lbl="Question Text Color" hintText="Default: #000000" />
            <div />
          </div>
          <div style={row3}>
            <NumField name="faq_desc_size" lbl="Answer Text Size" hintText="Default: 14px" />
            <ColorField name="faq_desc_color" lbl="Answer Text Color" hintText="Default: #555555" />
            <div />
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            SECTION B — BLOG / ARTICLE TYPOGRAPHY
        ══════════════════════════════════════════════════════ */}
        <div style={{ ...card, borderColor: 'rgba(236,72,153,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{
              minWidth: 34, height: 34, borderRadius: 9,
              background: 'linear-gradient(135deg, #ec4899, #db2777)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0,
            }}>B</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#e2e8f0', marginBottom: 3 }}>Blog & Article Typography</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Controls text styles on /blogs/[slug] article pages</div>
            </div>
          </div>
          <div style={infoBox}>
            ℹ️ <strong>Body text size and color</strong> for blogs is shared with the Intro Section settings (font_size + text_color from Section 2 above). Changes there will also affect blog body text.
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            H3 Headings in Blog Content
          </div>
          <div style={row2}>
            <NumField name="h3_size" lbl="H3 Heading Size" hintText="Default: 18px — sub-headings in blog articles" />
            <ColorField name="h3_color" lbl="H3 Heading Color" hintText="Default: #222222" />
          </div>
          <div style={infoBox}>
            ℹ️ <strong>H2 headings in blogs</strong> use the H2 size from Section 2 (h2_general_size). They always have a dark gradient bar with white text.
          </div>
        </div>

        <button
          type="submit" disabled={saving}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 32px',
            background: saving ? 'rgba(99,102,241,0.4)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', border: 'none', borderRadius: 10,
            fontSize: 14, fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: saving ? 'none' : '0 4px 18px rgba(99,102,241,0.4)',
          }}
        >
          {saving ? 'Saving…' : '💾  Save All CSS Settings'}
        </button>
      </form>
    </div>
  );
}
