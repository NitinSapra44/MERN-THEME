'use client';

import { useState, useEffect, useCallback } from 'react';
import RichEditor from '@/components/admin/RichEditor';

const LOCALES: { code: string; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ur', label: 'Urdu' },
  { code: 'ar', label: 'Arabic' },
  { code: 'fr', label: 'French' },
  { code: 'es', label: 'Spanish' },
  { code: 'de', label: 'German' },
  { code: 'it', label: 'Italian' },
  { code: 'ru', label: 'Russian' },
  { code: 'vn', label: 'Vietnamese' },
  { code: 'bd', label: 'Bangladeshi' },
  { code: 'in', label: 'Hindi' },
  { code: 'id', label: 'Indonesian' },
  { code: 'jp', label: 'Japanese' },
  { code: 'my', label: 'Malay' },
  { code: 'br', label: 'Portuguese' },
  { code: 'te', label: 'Telugu' },
  { code: 'ta', label: 'Tamil' },
  { code: 'th', label: 'Thai' },
  { code: 'tr', label: 'Turkish' },
  { code: 'ph', label: 'Filipino' },
  { code: 'pa', label: 'Punjabi' },
];

type Tab = 'homepage' | 'downloads' | 'seo' | 'pages' | 'faqs' | 'features' | 'screenshots';

interface BannerButton { text: string; url: string; timer_seconds: number; }

interface HomepageData {
  banner_title?: string;
  banner_subtitle?: string;
  banner_button_text?: string;
  banner_button_url?: string;
  banner_image?: string;
  banner_buttons?: string;
  banner_button_timer?: number;
  download_buttons?: string;
  download_button_timer?: number;
  security_info?: string;
  security_icon1?: string; security_icon1_name?: string;
  security_icon2?: string; security_icon2_name?: string;
  security_icon3?: string; security_icon3_name?: string;
  intro_title?: string;
  intro_description?: string;
  feature_title?: string;
  faqs_title?: string;
  post_limit?: number;
  post_button_text?: string;
  post_button_bg_color?: string;
  post_button_text_color?: string;
  home_info_title?: string;
  home_info_description?: string;
  meta_title?: string; meta_description?: string; meta_keyword?: string;
  download_slug?: string; home_slug?: string;
  download_page_title?: string; download_page_description?: string;
  download_button_name?: string; download_button_url?: string;
  download_page_content?: string;
  old_version_title?: string; old_version_buttons?: string;
  download_meta_title?: string; download_meta_description?: string; download_meta_keyword?: string;
  about_title?: string; about_description?: string;
  about_meta_title?: string; about_meta_description?: string;
  contact_title?: string; contact_description?: string;
  contact_meta_title?: string; contact_meta_description?: string;
  privacy_title?: string; privacy_content?: string;
  dmca_title?: string; dmca_content?: string;
}

interface FaqItem { question: string; answer: string; }
interface FeatureItem { icon: string; title: string; description: string; }
interface ScreenshotItem { image: string; heading: string; description: string; bg_color: string; }

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px 10px', border: '1px solid #ddd',
  borderRadius: 6, fontSize: 14, boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 600, marginBottom: 4, fontSize: 14 };
const sectionStyle: React.CSSProperties = { marginBottom: 20 };
const btnStyle: React.CSSProperties = {
  padding: '9px 20px', background: '#4f46e5', color: '#fff',
  border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14,
};
const addBtnStyle: React.CSSProperties = { ...btnStyle, background: '#10b981', marginBottom: 12 };
const removeBtnStyle: React.CSSProperties = { ...btnStyle, background: '#ef4444', padding: '5px 12px', fontSize: 12 };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={sectionStyle}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function ImageUploadField({
  label, value, onChange, uploadType = 'icons',
}: { label: string; value: string; onChange: (url: string) => void; uploadType?: string; }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', uploadType);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    onChange(data.url);
    setUploading(false);
  }

  return (
    <div style={sectionStyle}>
      <label style={labelStyle}>{label}</label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {value && (
          <img src={value} alt="" style={{ height: 48, width: 48, objectFit: 'contain', border: '1px solid #ddd', borderRadius: 4 }} />
        )}
        <input type="file" accept="image/*" onChange={handleFile} style={{ fontSize: 13 }} />
        {uploading && <span style={{ fontSize: 12, color: '#888' }}>Uploading…</span>}
      </div>
      {value && (
        <input style={{ ...inputStyle, marginTop: 6 }} value={value} onChange={(e) => onChange(e.target.value)} placeholder="or paste URL" />
      )}
    </div>
  );
}

export default function LanguagesClient() {
  const [locale, setLocale] = useState('en');
  const [activeTab, setActiveTab] = useState<Tab>('homepage');
  const [data, setData] = useState<HomepageData>({});
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [screenshots, setScreenshots] = useState<ScreenshotItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async (loc: string) => {
    setLoading(true);
    const [pageRes, faqRes, featRes, ssRes] = await Promise.all([
      fetch(`/api/languages?locale=${loc}`),
      fetch(`/api/languages/faqs?homepage_id=1`),
      fetch(`/api/languages/features?homepage_id=1`),
      fetch(`/api/languages/screenshots?homepage_id=1`),
    ]);
    const [pageData, faqData, featData, ssData] = await Promise.all([
      pageRes.json(), faqRes.json(), featRes.json(), ssRes.json(),
    ]);
    setData(pageData);
    setFaqs(faqData);
    setFeatures(featData);
    setScreenshots(ssData);
    setLoading(false);
  }, []);

  useEffect(() => { loadData(locale); }, [locale, loadData]);

  function set(key: keyof HomepageData, value: string | number) {
    setData((d) => ({ ...d, [key]: value }));
  }

  async function save() {
    setSaving(true);
    await Promise.all([
      fetch(`/api/languages?locale=${locale}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }),
      fetch(`/api/languages/faqs?homepage_id=1`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(faqs) }),
      fetch(`/api/languages/features?homepage_id=1`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(features) }),
      fetch(`/api/languages/screenshots?homepage_id=1`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(screenshots) }),
    ]);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'homepage', label: 'Homepage' },
    { id: 'downloads', label: 'Downloads' },
    { id: 'seo', label: 'SEO' },
    { id: 'pages', label: 'Pages' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'features', label: 'Features' },
    { id: 'screenshots', label: 'Screenshots' },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Language Content Editor</h1>
        <button style={btnStyle} onClick={save} disabled={saving}>
          {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save All Changes'}
        </button>
      </div>

      {/* Language selector */}
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Select Language</label>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          style={{ ...inputStyle, maxWidth: 240 }}
        >
          {LOCALES.map((l) => (
            <option key={l.code} value={l.code}>{l.label} ({l.code})</option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #e5e7eb', marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 16px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
              background: activeTab === t.id ? '#4f46e5' : 'transparent',
              color: activeTab === t.id ? '#fff' : '#374151',
              borderRadius: '6px 6px 0 0',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: '#888', padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

          {/* HOMEPAGE TAB */}
          {activeTab === 'homepage' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Banner</h3>
              <Field label="Banner Title">
                <input style={inputStyle} value={data.banner_title ?? ''} onChange={(e) => set('banner_title', e.target.value)} />
              </Field>
              <Field label="Banner Subtitle">
                <input style={inputStyle} value={data.banner_subtitle ?? ''} onChange={(e) => set('banner_subtitle', e.target.value)} />
              </Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Button Text">
                  <input style={inputStyle} value={data.banner_button_text ?? ''} onChange={(e) => set('banner_button_text', e.target.value)} />
                </Field>
                <Field label="Button URL">
                  <input style={inputStyle} value={data.banner_button_url ?? ''} onChange={(e) => set('banner_button_url', e.target.value)} />
                </Field>
              </div>
              <ImageUploadField label="Banner Image" value={data.banner_image ?? ''} onChange={(url) => set('banner_image', url)} uploadType="banners" />

              <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
              <h3 style={{ marginTop: 0, marginBottom: 4 }}>Banner Buttons</h3>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6b7280' }}>Add/remove buttons shown on the homepage hero. If empty, the single Button Text/URL above is used.</p>
              {(() => {
                let btns: BannerButton[] = [];
                try { btns = JSON.parse(data.banner_buttons || '[]'); } catch {}
                const update = (newBtns: BannerButton[]) => set('banner_buttons', JSON.stringify(newBtns));
                return (
                  <div>
                    <button style={addBtnStyle} onClick={() => update([...btns, { text: 'Download Now', url: '/download', timer_seconds: 0 }])}>+ Add Button</button>
                    {btns.map((btn, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 10, alignItems: 'end', marginBottom: 10, padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}>
                        <Field label="Button Text"><input style={inputStyle} value={btn.text} onChange={(e) => { const b = [...btns]; b[i] = { ...b[i], text: e.target.value }; update(b); }} /></Field>
                        <Field label="Button URL"><input style={inputStyle} value={btn.url} onChange={(e) => { const b = [...btns]; b[i] = { ...b[i], url: e.target.value }; update(b); }} /></Field>
                        <Field label="Timer (sec)"><input type="number" min={0} style={{ ...inputStyle, width: 80 }} value={btn.timer_seconds} onChange={(e) => { const b = [...btns]; b[i] = { ...b[i], timer_seconds: parseInt(e.target.value) || 0 }; update(b); }} /></Field>
                        <div><button style={{ ...removeBtnStyle, marginBottom: 0 }} onClick={() => update(btns.filter((_, idx) => idx !== i))}>Remove</button></div>
                      </div>
                    ))}
                    {btns.length === 0 && <p style={{ color: '#9ca3af', fontSize: 13 }}>No extra buttons. Using the single button above.</p>}
                  </div>
                );
              })()}

              <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Security Icons</h3>
              <Field label="Security Info Text">
                <input style={inputStyle} value={data.security_info ?? ''} onChange={(e) => set('security_info', e.target.value)} />
              </Field>
              {([1, 2, 3] as const).map((n) => (
                <div key={n} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: 12, alignItems: 'end', marginBottom: 12, padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}>
                  <div>
                    <label style={{ ...labelStyle, marginBottom: 6 }}>Icon {n} Image</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {data[`security_icon${n}` as keyof HomepageData] && (
                        <img src={data[`security_icon${n}` as keyof HomepageData] as string} alt="" style={{ height: 40, width: 40, objectFit: 'contain', border: '1px solid #ddd', borderRadius: 4 }} />
                      )}
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const fd = new FormData(); fd.append('file', file); fd.append('type', 'icons');
                        const res = await fetch('/api/upload', { method: 'POST', body: fd });
                        const d = await res.json();
                        set(`security_icon${n}` as keyof HomepageData, d.url);
                      }} style={{ fontSize: 12 }} />
                    </div>
                  </div>
                  <Field label={`Icon ${n} Name`}>
                    <input style={inputStyle} value={data[`security_icon${n}_name` as keyof HomepageData] as string ?? ''} onChange={(e) => set(`security_icon${n}_name` as keyof HomepageData, e.target.value)} />
                  </Field>
                  <Field label="URL (paste)">
                    <input style={inputStyle} placeholder="or paste image URL" value={data[`security_icon${n}` as keyof HomepageData] as string ?? ''} onChange={(e) => set(`security_icon${n}` as keyof HomepageData, e.target.value)} />
                  </Field>
                </div>
              ))}

              <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Intro Section</h3>
              <Field label="Intro Title">
                <input style={inputStyle} value={data.intro_title ?? ''} onChange={(e) => set('intro_title', e.target.value)} />
              </Field>
              <Field label="Intro Description">
                <RichEditor value={data.intro_description ?? ''} onChange={(v) => set('intro_description', v)} />
              </Field>

              <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Section Titles &amp; Posts</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Feature Section Title">
                  <input style={inputStyle} value={data.feature_title ?? ''} onChange={(e) => set('feature_title', e.target.value)} />
                </Field>
                <Field label="FAQs Section Title">
                  <input style={inputStyle} value={data.faqs_title ?? ''} onChange={(e) => set('faqs_title', e.target.value)} />
                </Field>
                <Field label="Post Limit">
                  <input type="number" style={inputStyle} value={data.post_limit ?? 6} onChange={(e) => set('post_limit', parseInt(e.target.value))} />
                </Field>
                <Field label="Post Button Text">
                  <input style={inputStyle} value={data.post_button_text ?? ''} onChange={(e) => set('post_button_text', e.target.value)} />
                </Field>
                <Field label="Post Button BG Color">
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="color" value={data.post_button_bg_color ?? '#007bff'} onChange={(e) => set('post_button_bg_color', e.target.value)} />
                    <input style={inputStyle} value={data.post_button_bg_color ?? '#007bff'} onChange={(e) => set('post_button_bg_color', e.target.value)} />
                  </div>
                </Field>
                <Field label="Post Button Text Color">
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input type="color" value={data.post_button_text_color ?? '#ffffff'} onChange={(e) => set('post_button_text_color', e.target.value)} />
                    <input style={inputStyle} value={data.post_button_text_color ?? '#ffffff'} onChange={(e) => set('post_button_text_color', e.target.value)} />
                  </div>
                </Field>
              </div>

              <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Home Info Section</h3>
              <Field label="Home Info Title">
                <input style={inputStyle} value={data.home_info_title ?? ''} onChange={(e) => set('home_info_title', e.target.value)} />
              </Field>
              <Field label="Home Info Description">
                <RichEditor value={data.home_info_description ?? ''} onChange={(v) => set('home_info_description', v)} />
              </Field>
            </div>
          )}

          {/* DOWNLOADS TAB */}
          {activeTab === 'downloads' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Download Page</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Download Slug">
                  <input style={inputStyle} value={data.download_slug ?? ''} onChange={(e) => set('download_slug', e.target.value)} />
                </Field>
                <Field label="Home Slug">
                  <input style={inputStyle} value={data.home_slug ?? ''} onChange={(e) => set('home_slug', e.target.value)} />
                </Field>
                <Field label="Download Page Title">
                  <input style={inputStyle} value={data.download_page_title ?? ''} onChange={(e) => set('download_page_title', e.target.value)} />
                </Field>
                <Field label="Download Button Name">
                  <input style={inputStyle} value={data.download_button_name ?? ''} onChange={(e) => set('download_button_name', e.target.value)} />
                </Field>
                <Field label="Download Button URL">
                  <input style={inputStyle} value={data.download_button_url ?? ''} onChange={(e) => set('download_button_url', e.target.value)} />
                </Field>
                <Field label="Main Button Timer (sec)">
                  <input type="number" min={0} style={inputStyle} value={data.download_button_timer ?? 0} onChange={(e) => set('download_button_timer', parseInt(e.target.value) || 0)} placeholder="0 = no timer" />
                </Field>
              </div>

              <h3 style={{ marginTop: 0, marginBottom: 4 }}>Extra Download Buttons</h3>
              <p style={{ margin: '0 0 12px', fontSize: 13, color: '#6b7280' }}>Additional download buttons shown alongside the main one.</p>
              {(() => {
                let btns: BannerButton[] = [];
                try { btns = JSON.parse(data.download_buttons || '[]'); } catch {}
                const update = (newBtns: BannerButton[]) => set('download_buttons', JSON.stringify(newBtns));
                return (
                  <div style={{ marginBottom: 16 }}>
                    <button style={addBtnStyle} onClick={() => update([...btns, { text: 'Mirror Download', url: 'https://', timer_seconds: 0 }])}>+ Add Button</button>
                    {btns.map((btn, i) => (
                      <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 10, alignItems: 'end', marginBottom: 10, padding: 12, border: '1px solid #e5e7eb', borderRadius: 6 }}>
                        <Field label="Button Text"><input style={inputStyle} value={btn.text} onChange={(e) => { const b = [...btns]; b[i] = { ...b[i], text: e.target.value }; update(b); }} /></Field>
                        <Field label="Button URL"><input style={inputStyle} value={btn.url} onChange={(e) => { const b = [...btns]; b[i] = { ...b[i], url: e.target.value }; update(b); }} /></Field>
                        <Field label="Timer (sec)"><input type="number" min={0} style={{ ...inputStyle, width: 80 }} value={btn.timer_seconds} onChange={(e) => { const b = [...btns]; b[i] = { ...b[i], timer_seconds: parseInt(e.target.value) || 0 }; update(b); }} /></Field>
                        <div><button style={{ ...removeBtnStyle, marginBottom: 0 }} onClick={() => update(btns.filter((_, idx) => idx !== i))}>Remove</button></div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              <Field label="Download Page Description">
                <textarea style={{ ...inputStyle, minHeight: 80 }} value={data.download_page_description ?? ''} onChange={(e) => set('download_page_description', e.target.value)} />
              </Field>
              <Field label="Download Page Content">
                <RichEditor value={data.download_page_content ?? ''} onChange={(v) => set('download_page_content', v)} />
              </Field>

              <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Old Versions</h3>
              <Field label="Old Version Title">
                <input style={inputStyle} value={data.old_version_title ?? ''} onChange={(e) => set('old_version_title', e.target.value)} />
              </Field>
              <Field label="Old Version Buttons (JSON array)">
                <textarea style={{ ...inputStyle, minHeight: 100, fontFamily: 'monospace', fontSize: 12 }} value={data.old_version_buttons ?? ''} onChange={(e) => set('old_version_buttons', e.target.value)} placeholder={'[{"text":"v1.0","url":"https://..."},{"text":"v2.0","url":"https://..."}]'} />
              </Field>
            </div>
          )}

          {/* SEO TAB */}
          {activeTab === 'seo' && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Homepage SEO</h3>
              <Field label="Meta Title">
                <input style={inputStyle} value={data.meta_title ?? ''} onChange={(e) => set('meta_title', e.target.value)} />
              </Field>
              <Field label="Meta Description">
                <textarea style={{ ...inputStyle, minHeight: 80 }} value={data.meta_description ?? ''} onChange={(e) => set('meta_description', e.target.value)} />
              </Field>
              <Field label="Meta Keywords">
                <input style={inputStyle} value={data.meta_keyword ?? ''} onChange={(e) => set('meta_keyword', e.target.value)} />
              </Field>

              <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
              <h3 style={{ marginTop: 0, marginBottom: 16 }}>Download Page SEO</h3>
              <Field label="Meta Title">
                <input style={inputStyle} value={data.download_meta_title ?? ''} onChange={(e) => set('download_meta_title', e.target.value)} />
              </Field>
              <Field label="Meta Description">
                <textarea style={{ ...inputStyle, minHeight: 80 }} value={data.download_meta_description ?? ''} onChange={(e) => set('download_meta_description', e.target.value)} />
              </Field>
              <Field label="Meta Keywords">
                <input style={inputStyle} value={data.download_meta_keyword ?? ''} onChange={(e) => set('download_meta_keyword', e.target.value)} />
              </Field>
            </div>
          )}

          {/* PAGES TAB */}
          {activeTab === 'pages' && (
            <div>
              {[
                { prefix: 'about', label: 'About Page', hasContent: true },
                { prefix: 'contact', label: 'Contact Page', hasContent: true },
                { prefix: 'privacy', label: 'Privacy Policy', hasContent: false, rich: true },
                { prefix: 'dmca', label: 'DMCA Policy', hasContent: false, rich: true },
              ].map(({ prefix, label, hasContent, rich }) => (
                <div key={prefix}>
                  <h3 style={{ marginTop: 0, marginBottom: 16 }}>{label}</h3>
                  <Field label="Page Title">
                    <input style={inputStyle} value={(data as Record<string, string>)[`${prefix}_title`] ?? ''} onChange={(e) => set(`${prefix}_title` as keyof HomepageData, e.target.value)} />
                  </Field>
                  {hasContent && (
                    <>
                      <Field label="Page Description / Content">
                        <RichEditor value={(data as Record<string, string>)[`${prefix}_description`] ?? ''} onChange={(v) => set(`${prefix}_description` as keyof HomepageData, v)} />
                      </Field>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <Field label="Meta Title">
                          <input style={inputStyle} value={(data as Record<string, string>)[`${prefix}_meta_title`] ?? ''} onChange={(e) => set(`${prefix}_meta_title` as keyof HomepageData, e.target.value)} />
                        </Field>
                        <Field label="Meta Description">
                          <input style={inputStyle} value={(data as Record<string, string>)[`${prefix}_meta_description`] ?? ''} onChange={(e) => set(`${prefix}_meta_description` as keyof HomepageData, e.target.value)} />
                        </Field>
                      </div>
                    </>
                  )}
                  {rich && (
                    <Field label="Page Content">
                      <RichEditor value={(data as Record<string, string>)[`${prefix}_content`] ?? ''} onChange={(v) => set(`${prefix}_content` as keyof HomepageData, v)} />
                    </Field>
                  )}
                  <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                </div>
              ))}
            </div>
          )}

          {/* FAQS TAB */}
          {activeTab === 'faqs' && (
            <div>
              <button style={addBtnStyle} onClick={() => setFaqs((f) => [...f, { question: '', answer: '' }])}>
                + Add FAQ
              </button>
              {faqs.map((faq, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 12, position: 'relative' }}>
                  <button style={{ ...removeBtnStyle, position: 'absolute', top: 12, right: 12 }} onClick={() => setFaqs((f) => f.filter((_, idx) => idx !== i))}>
                    Remove
                  </button>
                  <Field label={`Question ${i + 1}`}>
                    <input style={inputStyle} value={faq.question} onChange={(e) => setFaqs((f) => f.map((x, idx) => idx === i ? { ...x, question: e.target.value } : x))} />
                  </Field>
                  <Field label="Answer">
                    <RichEditor value={faq.answer} onChange={(v) => setFaqs((f) => f.map((x, idx) => idx === i ? { ...x, answer: v } : x))} />
                  </Field>
                </div>
              ))}
              {faqs.length === 0 && <p style={{ color: '#888' }}>No FAQs yet. Click "Add FAQ" to create one.</p>}
            </div>
          )}

          {/* FEATURES TAB */}
          {activeTab === 'features' && (
            <div>
              <button style={addBtnStyle} onClick={() => setFeatures((f) => [...f, { icon: '', title: '', description: '' }])}>
                + Add Feature
              </button>
              {features.map((feat, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 12, position: 'relative' }}>
                  <button style={{ ...removeBtnStyle, position: 'absolute', top: 12, right: 12 }} onClick={() => setFeatures((f) => f.filter((_, idx) => idx !== i))}>
                    Remove
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'start' }}>
                    <div>
                      <label style={labelStyle}>Icon Image</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {feat.icon && <img src={feat.icon} alt="" style={{ height: 48, width: 48, objectFit: 'contain', border: '1px solid #ddd', borderRadius: 4 }} />}
                        <input type="file" accept="image/*" style={{ fontSize: 12 }} onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const fd = new FormData(); fd.append('file', file); fd.append('type', 'icons');
                          const res = await fetch('/api/upload', { method: 'POST', body: fd });
                          const d = await res.json();
                          setFeatures((f) => f.map((x, idx) => idx === i ? { ...x, icon: d.url } : x));
                        }} />
                        <input style={{ ...inputStyle, fontSize: 12 }} placeholder="or paste URL" value={feat.icon} onChange={(e) => setFeatures((f) => f.map((x, idx) => idx === i ? { ...x, icon: e.target.value } : x))} />
                      </div>
                    </div>
                    <div>
                      <Field label="Feature Title">
                        <input style={inputStyle} value={feat.title} onChange={(e) => setFeatures((f) => f.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} />
                      </Field>
                      <Field label="Description">
                        <textarea style={{ ...inputStyle, minHeight: 80 }} value={feat.description} onChange={(e) => setFeatures((f) => f.map((x, idx) => idx === i ? { ...x, description: e.target.value } : x))} />
                      </Field>
                    </div>
                  </div>
                </div>
              ))}
              {features.length === 0 && <p style={{ color: '#888' }}>No features yet. Click "Add Feature" to create one.</p>}
            </div>
          )}

          {/* SCREENSHOTS TAB */}
          {activeTab === 'screenshots' && (
            <div>
              <button style={addBtnStyle} onClick={() => setScreenshots((s) => [...s, { image: '', heading: '', description: '', bg_color: '#ffffff' }])}>
                + Add Screenshot
              </button>
              {screenshots.map((ss, i) => (
                <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 12, position: 'relative' }}>
                  <button style={{ ...removeBtnStyle, position: 'absolute', top: 12, right: 12 }} onClick={() => setScreenshots((s) => s.filter((_, idx) => idx !== i))}>
                    Remove
                  </button>
                  <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'start' }}>
                    <div>
                      <label style={labelStyle}>Screenshot Image</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {ss.image && <img src={ss.image} alt="" style={{ height: 80, width: 60, objectFit: 'cover', border: '1px solid #ddd', borderRadius: 4 }} />}
                        <input type="file" accept="image/*" style={{ fontSize: 12 }} onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const fd = new FormData(); fd.append('file', file); fd.append('type', 'screenshots');
                          const res = await fetch('/api/upload', { method: 'POST', body: fd });
                          const d = await res.json();
                          setScreenshots((s) => s.map((x, idx) => idx === i ? { ...x, image: d.url } : x));
                        }} />
                        <input style={{ ...inputStyle, fontSize: 12 }} placeholder="or paste URL" value={ss.image} onChange={(e) => setScreenshots((s) => s.map((x, idx) => idx === i ? { ...x, image: e.target.value } : x))} />
                      </div>
                    </div>
                    <div>
                      <Field label="Heading">
                        <input style={inputStyle} value={ss.heading} onChange={(e) => setScreenshots((s) => s.map((x, idx) => idx === i ? { ...x, heading: e.target.value } : x))} />
                      </Field>
                      <Field label="Description">
                        <textarea style={{ ...inputStyle, minHeight: 60 }} value={ss.description} onChange={(e) => setScreenshots((s) => s.map((x, idx) => idx === i ? { ...x, description: e.target.value } : x))} />
                      </Field>
                      <Field label="Background Color">
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <input type="color" value={ss.bg_color} onChange={(e) => setScreenshots((s) => s.map((x, idx) => idx === i ? { ...x, bg_color: e.target.value } : x))} />
                          <input style={inputStyle} value={ss.bg_color} onChange={(e) => setScreenshots((s) => s.map((x, idx) => idx === i ? { ...x, bg_color: e.target.value } : x))} />
                        </div>
                      </Field>
                    </div>
                  </div>
                </div>
              ))}
              {screenshots.length === 0 && <p style={{ color: '#888' }}>No screenshots yet. Click "Add Screenshot" to create one.</p>}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
