'use client';
import { useState } from 'react';

interface Props {
  settings: any;
  siteSettings: any;
}

const card: React.CSSProperties = {
  background: '#12121e',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 14,
  padding: '24px 28px',
  marginBottom: 18,
};

const sectionHead: React.CSSProperties = {
  fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: '#6366f1',
  marginBottom: 18, paddingBottom: 12,
  borderBottom: '1px solid rgba(255,255,255,0.06)',
};

const label: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 600,
  color: '#94a3b8', marginBottom: 7,
  textTransform: 'uppercase', letterSpacing: '0.05em',
};

const input: React.CSSProperties = {
  width: '100%', padding: '10px 14px',
  background: '#1a1a2e',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 9, color: '#e2e8f0',
  fontSize: 14, boxSizing: 'border-box',
};

const textarea: React.CSSProperties = {
  ...input, resize: 'vertical', fontFamily: 'monospace', fontSize: 12,
};

const ALL_LOCALES = [
  { code: 'en', label: 'English' }, { code: 'ur', label: 'Urdu' }, { code: 'ar', label: 'Arabic' },
  { code: 'fr', label: 'French' }, { code: 'es', label: 'Spanish' }, { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' }, { code: 'ru', label: 'Russian' }, { code: 'vn', label: 'Vietnamese' },
  { code: 'bd', label: 'Bangladeshi' }, { code: 'in', label: 'Hindi' }, { code: 'id', label: 'Indonesian' },
  { code: 'jp', label: 'Japanese' }, { code: 'my', label: 'Malay' }, { code: 'br', label: 'Portuguese' },
  { code: 'te', label: 'Telugu' }, { code: 'ta', label: 'Tamil' }, { code: 'th', label: 'Thai' },
  { code: 'tr', label: 'Turkish' }, { code: 'ph', label: 'Filipino' }, { code: 'pa', label: 'Punjabi' },
];

export default function AdminSettingsClient({ settings, siteSettings }: Props) {
  const initEnabled = (settings?.enabled_locales ?? 'en,ur,ar,fr,es,de,it,ru,vn,bd,in,id,jp,my,br,te,ta,th,tr,ph,pa')
    .split(',').map((s: string) => s.trim()).filter(Boolean);

  const [form, setForm] = useState({
    website_name:         settings?.website_name ?? '',
    banner_type:          settings?.banner_type ?? 'image',
    google_analytics:     siteSettings?.google_analytics ?? '',
    google_adsense:       siteSettings?.google_adsense ?? '',
    google_search_console:siteSettings?.google_search_console ?? '',
    header_bg_color:      siteSettings?.header_bg_color ?? '#0f0f1a',
    footer_bg_color:      siteSettings?.footer_bg_color ?? '#0a0a14',
    text_color:           siteSettings?.text_color ?? '#e2e8f0',
    show_blogs:           siteSettings?.show_blogs ?? 1,
  });
  const [enabledLocales, setEnabledLocales] = useState<string[]>(initEnabled);

  function toggleLocale(code: string) {
    if (code === 'en') return; // English always on
    setEnabledLocales((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  }
  const [logoFile, setLogoFile]       = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>(
    settings?.logo
      ? (settings.logo.startsWith('http') ? settings.logo : `/uploads/logos/${settings.logo}`)
      : ''
  );
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleLogo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let logoFilename = settings?.logo ?? '';
    if (logoFile) {
      const fd = new FormData();
      fd.append('file', logoFile);
      fd.append('type', 'logos');
      const res  = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      logoFilename = data.url ?? data.filename;
    }

    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, logo: logoFilename, enabled_locales: enabledLocales.join(',') }),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div style={{ maxWidth: 820 }}>
      {saved && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(16,185,129,0.1)',
          border: '1px solid rgba(16,185,129,0.25)',
          color: '#34d399', padding: '12px 18px',
          borderRadius: 10, marginBottom: 20,
          fontSize: 14, fontWeight: 500,
        }}>
          ✓ Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* General */}
        <div style={card}>
          <div style={sectionHead}>General</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            <div>
              <label style={label}>Website Name</label>
              <input name="website_name" value={form.website_name} onChange={handleChange} style={input} />
            </div>
            <div>
              <label style={label}>Banner Type</label>
              <select name="banner_type" value={form.banner_type} onChange={handleChange}
                style={{ ...input, appearance: 'none' }}>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="slider">Slider</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div style={card}>
          <div style={sectionHead}>Logo</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{
              width: 100, height: 60, borderRadius: 10,
              background: '#1a1a2e', border: '2px dashed rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, overflow: 'hidden',
            }}>
              {logoPreview
                ? <img src={logoPreview} alt="Logo" style={{ maxHeight: 52, maxWidth: 92, objectFit: 'contain' }} />
                : <span style={{ fontSize: 11, color: '#475569' }}>No logo</span>
              }
            </div>
            <div>
              <label style={label}>Upload new logo</label>
              <input type="file" accept="image/*" onChange={handleLogo}
                style={{ color: '#94a3b8', fontSize: 13 }} />
              <p style={{ margin: '6px 0 0', fontSize: 12, color: '#475569' }}>
                PNG, SVG, or WebP recommended. Appears in the navbar.
              </p>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div style={card}>
          <div style={sectionHead}>Site Colors</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {[
              { name: 'header_bg_color', label: 'Navbar Background' },
              { name: 'footer_bg_color', label: 'Footer Background' },
              { name: 'text_color',      label: 'Body Text Color'   },
            ].map((c) => (
              <div key={c.name}>
                <label style={label}>{c.label}</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <input
                    type="color"
                    name={c.name}
                    value={form[c.name as keyof typeof form] as string}
                    onChange={handleChange}
                    style={{ width: 44, height: 36, borderRadius: 7, border: 'none', cursor: 'pointer', padding: 2 }}
                  />
                  <input
                    name={c.name}
                    value={form[c.name as keyof typeof form] as string}
                    onChange={handleChange}
                    style={{ ...input, flex: 1, fontFamily: 'monospace', fontSize: 13 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Languages */}
        <div style={card}>
          <div style={sectionHead}>Active Languages</div>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: '#64748b' }}>
            Only checked languages appear in the site language switcher. English is always active.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
            {ALL_LOCALES.map(({ code, label }) => {
              const checked = enabledLocales.includes(code);
              const isEn = code === 'en';
              return (
                <label key={code} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: isEn ? 'default' : 'pointer', opacity: isEn ? 0.6 : 1 }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    disabled={isEn}
                    onChange={() => toggleLocale(code)}
                    style={{ accentColor: '#6366f1', width: 16, height: 16 }}
                  />
                  <span style={{ fontSize: 13, color: '#e2e8f0' }}>{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Google integrations */}
        <div style={card}>
          <div style={sectionHead}>Google Integrations</div>
          {[
            { name: 'google_analytics',      label: 'Google Analytics (paste full <script> tag)', rows: 4 },
            { name: 'google_adsense',         label: 'Google AdSense (paste full <script> tag)',   rows: 4 },
            { name: 'google_search_console',  label: 'Search Console meta tag',                    rows: 2 },
          ].map((f) => (
            <div key={f.name} style={{ marginBottom: 18 }}>
              <label style={label}>{f.label}</label>
              <textarea
                name={f.name}
                value={form[f.name as keyof typeof form] as string}
                onChange={handleChange}
                rows={f.rows}
                style={textarea}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '11px 28px',
            background: saving ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', border: 'none',
            borderRadius: 9, fontSize: 14, fontWeight: 600,
            cursor: saving ? 'not-allowed' : 'pointer',
            boxShadow: saving ? 'none' : '0 4px 15px rgba(99,102,241,0.35)',
          }}
        >
          {saving ? 'Saving…' : '💾  Save Settings'}
        </button>
      </form>
    </div>
  );
}
