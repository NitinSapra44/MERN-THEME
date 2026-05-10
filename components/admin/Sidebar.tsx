'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const groups = [
  {
    label: 'MAIN',
    items: [
      { label: 'Dashboard',    href: '/admin',         icon: '▦',  desc: 'Stats & overview' },
      { label: 'Languages',    href: '/admin/languages', icon: '🌐', desc: 'Homepage: Banner, Features, FAQs, Screenshots' },
      { label: 'Inbox',        href: '/admin/inbox',   icon: '📨',  desc: 'Contact form submissions' },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { label: 'All Blogs',         href: '/admin/blogs',              icon: '📋', desc: 'Manage all blog posts (drafts + published)' },
      { label: 'New Blog',          href: '/admin/blogs/new',          icon: '✏️', desc: 'Write & publish a new post' },
      { label: 'Categories',        href: '/admin/categories',         icon: '🏷️', desc: 'Blog categories for filtering' },
      { label: 'Media Library',     href: '/admin/media',              icon: '🖼️', desc: 'All uploaded images & files' },
      { label: 'APK Versions',      href: '/admin/download-versions',  icon: '📥', desc: 'Manage download versions & tracking' },
    ],
  },
  {
    label: 'STATIC PAGES',
    items: [
      { label: 'About Us',       href: '/admin/about',          icon: '👤', desc: '/about page content' },
      { label: 'Contact Us',     href: '/admin/contact',        icon: '📞', desc: '/contact page content' },
      { label: 'Privacy Policy', href: '/admin/privacy-policy', icon: '🔒', desc: '/privacy-policy page' },
      { label: 'DMCA',           href: '/admin/dmca',           icon: '⚠️', desc: '/dmca page content' },
    ],
  },
  {
    label: 'SITE CONFIG',
    items: [
      { label: 'Settings',     href: '/admin/settings',          icon: '⚙️', desc: 'Logo, site name, tagline, download link' },
      { label: 'CSS & Design', href: '/admin/css',               icon: '🎨', desc: 'Section colors, font sizes, padding' },
      { label: 'SEO Manager',    href: '/admin/seo',           icon: '🔍', desc: 'Meta tags, OG image, robots per page' },
      { label: 'Page Builder',   href: '/admin/page-builder',  icon: '🧱', desc: 'Section-based builder for static pages' },
      { label: 'Slug Manager',   href: '/admin/slugs',         icon: '🔗', desc: 'Control download & home page URLs' },
      { label: 'Social Links',   href: '/admin/social-links',  icon: '📱', desc: 'Footer social icons & floating FB button' },
      { label: 'Nav Menu',       href: '/admin/nav-menu',      icon: '☰',  desc: 'Edit main navigation links & order' },
      { label: 'Widget Zones',   href: '/admin/widgets',       icon: '📦', desc: 'Announcement bar, footer blurb, scripts' },
      { label: 'Redirects',      href: '/admin/redirects',     icon: '↪️', desc: 'Manage 301/302 URL redirects' },
    ],
  },
  {
    label: 'GROWTH',
    items: [
      { label: 'Analytics',          href: '/admin/analytics',          icon: '📊', desc: 'Page views, downloads, admin activity' },
      { label: 'A/B Tests',          href: '/admin/ab-tests',           icon: '⚗️', desc: 'Test download button variants' },
      { label: 'Locale Completeness',href: '/admin/locale-completeness',icon: '🌍', desc: 'Check translation fill rate per language' },
      { label: 'Admin Users',        href: '/admin/admin-users',        icon: '👥', desc: 'Manage admin accounts & roles' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{
      width: 248, minHeight: '100vh', background: '#0a0a14',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', flexDirection: 'column',
      position: 'sticky', top: 0, flexShrink: 0,
    }}>
      {/* Brand */}
      <Link href="/admin" style={{ textDecoration: 'none' }}>
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: 10, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18, color: '#fff', fontWeight: 800, flexShrink: 0,
          }}>A</div>
          <div>
            <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>Admin Panel</div>
            <div style={{ color: '#475569', fontSize: 11 }}>Content Management</div>
          </div>
        </div>
      </Link>

      {/* Nav groups */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {groups.map((group) => (
          <div key={group.label} style={{ marginBottom: 4 }}>
            <div style={{
              padding: '12px 20px 4px',
              fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
              color: '#334155', textTransform: 'uppercase',
            }}>
              {group.label}
            </div>
            {group.items.map((item) => {
              const active = item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                    padding: '8px 20px 8px 16px',
                    color: active ? '#e0e7ff' : '#94a3b8',
                    background: active ? 'rgba(99,102,241,0.12)' : 'transparent',
                    borderLeft: `3px solid ${active ? '#6366f1' : 'transparent'}`,
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 13, minWidth: 18, textAlign: 'center', marginTop: 1 }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: active ? 600 : 400, lineHeight: 1.35 }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: 11, color: active ? 'rgba(199,210,254,0.55)' : '#334155', lineHeight: 1.4, marginTop: 1 }}>
                      {item.desc}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* View site link */}
      <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Link href="/" target="_blank" style={{
          display: 'flex', alignItems: 'center', gap: 8,
          color: '#475569', fontSize: 13, textDecoration: 'none',
        }}>
          <span style={{ fontSize: 14 }}>↗</span> View Public Site
        </Link>
      </div>
    </aside>
  );
}
