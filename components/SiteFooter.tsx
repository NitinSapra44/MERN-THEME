import Link from 'next/link';
import { getSiteSettings } from '@/lib/getSiteSettings';

const SOCIAL_ICONS: Record<string, string> = {
  facebook:  'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  twitter:   'M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43.36a9 9 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.11 0c-2.5 0-4.52 2.02-4.52 4.52 0 .35.04.7.11 1.03A12.82 12.82 0 0 1 2.3.89a4.52 4.52 0 0 0 1.4 6.03 4.48 4.48 0 0 1-2.05-.57v.06c0 2.19 1.56 4.02 3.63 4.44a4.54 4.54 0 0 1-2.04.08 4.53 4.53 0 0 0 4.23 3.14A9.07 9.07 0 0 1 2 19.54a12.8 12.8 0 0 0 6.93 2.03c8.32 0 12.87-6.9 12.87-12.87l-.01-.59A9.22 9.22 0 0 0 24 5.56 9.1 9.1 0 0 1 23 3z',
  instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2z',
  youtube:   'M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  telegram:  'M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z',
  whatsapp:  'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z',
};

function SocialIcon({ platform, url }: { platform: string; url: string }) {
  const path = SOCIAL_ICONS[platform.toLowerCase()];
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" title={platform} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', textDecoration: 'none' }}>
      {path
        ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>
        : <span style={{ fontSize: 11, fontWeight: 700 }}>{platform[0].toUpperCase()}</span>}
    </a>
  );
}

function logoSrc(logo: string) {
  return logo.startsWith('http') ? logo : `/uploads/logos/${logo}`;
}

export default async function SiteFooter({ locale }: { locale: string }) {
  const { settings, site, links } = await getSiteSettings();
  const footerBg = site?.footer_bg_color || '#060615';
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const year = new Date().getFullYear();
  const fbLink = links.find(l => l.platform?.toLowerCase() === 'facebook');

  const cols = [
    { head: 'Navigate', links: [{ href: `${prefix}/`, label: 'Home' }, { href: `${prefix}/download`, label: 'Download' }, { href: `${prefix}/blogs`, label: 'Blogs' }] },
    { head: 'Company', links: [{ href: `${prefix}/about`, label: 'About Us' }, { href: `${prefix}/contact`, label: 'Contact' }, { href: `${prefix}/privacy-policy`, label: 'Privacy Policy' }, { href: `${prefix}/dmca`, label: 'DMCA' }] },
  ];

  return (
    <>
      {fbLink && (
        <a href={fbLink.url} target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', left: 0, top: '50%', transform: 'translateY(-50%)', background: 'linear-gradient(180deg, #1877f2, #1560c9)', color: '#fff', padding: '14px 8px', borderRadius: '0 10px 10px 0', textDecoration: 'none', fontSize: 12, fontWeight: 700, zIndex: 200, writingMode: 'vertical-rl', letterSpacing: 1.5, boxShadow: '2px 0 12px rgba(24,119,242,0.4)' }}>
          Facebook
        </a>
      )}

      <footer style={{ background: footerBg, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Gradient line */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, #6366f1 30%, #8b5cf6 70%, transparent)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 24px 48px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 56 }}>
            {/* Brand col */}
            <div>
              {settings?.logo ? (
                <img src={logoSrc(settings.logo)} alt={settings?.website_name ?? 'Site'} style={{ height: 38, width: 'auto', marginBottom: 18 }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#fff' }}>
                    {(settings?.website_name ?? 'A')[0].toUpperCase()}
                  </div>
                  <span style={{ color: '#f1f5f9', fontSize: 18, fontWeight: 800, letterSpacing: '-0.025em' }}>{settings?.website_name ?? 'AppNova'}</span>
                </div>
              )}
              {settings?.tagline && (
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.7, marginBottom: 22, maxWidth: 300 }}>{settings.tagline}</p>
              )}
              {links.length > 0 && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {links.map((link, i) =>
                    link.icon
                      ? <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ opacity: 0.75 }}><img src={link.icon} alt={link.platform} style={{ height: 30, width: 30, borderRadius: 8 }} /></a>
                      : <SocialIcon key={i} platform={link.platform} url={link.url} />
                  )}
                </div>
              )}
            </div>

            {/* Link cols */}
            {cols.map(col => (
              <div key={col.head}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#6366f1', marginBottom: 20 }}>{col.head}</div>
                {col.links.map(l => (
                  <Link key={l.href} href={l.href} style={{ display: 'block', color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 14, marginBottom: 12, transition: 'color 0.15s' }}>{l.label}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '18px 24px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.28)' }}>
              © {year} {settings?.website_name ?? 'AppNova'}. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 20 }}>
              {[{ href: `${prefix}/privacy-policy`, l: 'Privacy' }, { href: `${prefix}/dmca`, l: 'DMCA' }].map(i => (
                <Link key={i.href} href={i.href} style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textDecoration: 'none' }}>{i.l}</Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
