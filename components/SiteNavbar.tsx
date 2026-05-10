import Link from 'next/link';
import { getSiteSettings } from '@/lib/getSiteSettings';
import LanguageSwitcher from './LanguageSwitcher';
import { locales } from '@/lib/i18n/routing';
import ActiveNavLink from './ActiveNavLink';
import db from '@/lib/db';

export default async function SiteNavbar({ locale }: { locale: string }) {
  const { settings, site } = await getSiteSettings();
  const prefix = locale === 'en' ? '' : `/${locale}`;

  let navLinks: Array<{ href: string; label: string; target?: string }> = [];
  try {
    const { rows } = await db.query('SELECT label, url, target FROM nav_menu WHERE is_active=1 ORDER BY sort_order');
    if (rows.length > 0) navLinks = rows.map(r => ({ href: r.url, label: r.label, target: r.target }));
  } catch { /* fallback */ }

  if (navLinks.length === 0) {
    navLinks = [
      { href: `${prefix}/`,         label: 'Home'     },
      { href: `${prefix}/download`, label: 'Download' },
      { href: `${prefix}/blogs`,    label: 'Blogs'    },
      { href: `${prefix}/about`,    label: 'About'    },
    ];
  }

  return (
    <>
      <nav className="site-nav">
        {/* Top gradient line */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, transparent 0%, #6366f1 30%, #a78bfa 60%, #06b6d4 100%)', position: 'absolute', top: 0, left: 0, right: 0 }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', height: 70 }}>

          {/* ── Logo ── */}
          <Link href={`${prefix}/`} className="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginRight: 40, flexShrink: 0 }}>
            {settings?.logo ? (
              <img src={`/uploads/logos/${settings.logo}`} alt={settings?.website_name ?? 'Site'} style={{ height: 36, width: 'auto' }} />
            ) : (
              <>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 900, color: '#fff', flexShrink: 0, boxShadow: '0 0 18px rgba(99,102,241,0.5)' }}>
                  {(settings?.website_name ?? 'A')[0].toUpperCase()}
                </div>
                <span style={{ color: '#fff', fontSize: 19, fontWeight: 800, letterSpacing: '-0.03em' }}>
                  {settings?.website_name ?? 'AppNova'}
                </span>
              </>
            )}
          </Link>

          {/* ── Nav links ── */}
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {navLinks.map(link =>
              link.target === '_blank'
                ? <Link key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" style={{ padding: '8px 14px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: 14, fontWeight: 500, borderRadius: 8 }}>{link.label}</Link>
                : <ActiveNavLink key={link.href} href={link.href} label={link.label} />
            )}
          </div>

          {/* ── Right side ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <LanguageSwitcher currentLocale={locale} availableLocales={[...locales]} />
            <Link href={`${prefix}/download`} className="nav-download-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', borderRadius: 10, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', textDecoration: 'none', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download
            </Link>
          </div>
        </div>
      </nav>

      <style>{`
        .site-nav {
          position: sticky; top: 0; z-index: 100;
          background: rgba(6, 6, 22, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .nav-logo span { background: linear-gradient(90deg, #fff 60%, #a78bfa 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .nav-download-btn { box-shadow: 0 0 24px rgba(99,102,241,0.45), 0 4px 12px rgba(0,0,0,0.3); transition: box-shadow 0.2s, transform 0.15s; }
        .nav-download-btn:hover { box-shadow: 0 0 40px rgba(99,102,241,0.7), 0 4px 16px rgba(0,0,0,0.4); transform: translateY(-1px); }
        @media (max-width: 768px) { .nav-links { display: none !important; } }
      `}</style>
    </>
  );
}
