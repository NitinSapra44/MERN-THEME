'use client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

const pageInfo: Record<string, { title: string; desc: string }> = {
  '/admin':                     { title: 'Dashboard',            desc: 'Overview of your site' },
  '/admin/languages':           { title: 'Language Content',     desc: 'Edit homepage content per language' },
  '/admin/blogs':               { title: 'Blog Posts',           desc: 'Manage all published articles' },
  '/admin/blogs/new':           { title: 'New Blog Post',        desc: 'Write and publish a new article' },
  '/admin/settings':            { title: 'Site Settings',        desc: 'Logo, name, integrations' },
  '/admin/css':                 { title: 'CSS & Design',         desc: 'Colors, fonts, layout styles' },
  '/admin/social-links':        { title: 'Social Links',         desc: 'Footer social media & floating buttons' },
  '/admin/about':               { title: 'About Us',             desc: 'Edit the /about page' },
  '/admin/contact':             { title: 'Contact Us',           desc: 'Edit the /contact page' },
  '/admin/privacy-policy':      { title: 'Privacy Policy',       desc: 'Edit the /privacy-policy page' },
  '/admin/dmca':                { title: 'DMCA',                 desc: 'Edit the /dmca page' },
  '/admin/download-versions':   { title: 'APK Versions',         desc: 'Manage download versions & track downloads' },
  '/admin/seo':                 { title: 'SEO Manager',          desc: 'Meta tags, Open Graph, robots per page' },
  '/admin/slugs':               { title: 'Slug Manager',         desc: 'Control download & home page URLs' },
  '/admin/inbox':               { title: 'Contact Inbox',        desc: 'Messages from the contact form' },
  '/admin/media':               { title: 'Media Library',         desc: 'All uploaded images and files' },
  '/admin/categories':          { title: 'Blog Categories',       desc: 'Manage categories for blog posts' },
  '/admin/page-builder':        { title: 'Page Builder',          desc: 'Section-based builder for static pages' },
  '/admin/analytics':           { title: 'Analytics',             desc: 'Page views, downloads & admin activity' },
  '/admin/ab-tests':            { title: 'A/B Tests',             desc: 'Test different download button variants' },
  '/admin/locale-completeness': { title: 'Locale Completeness',   desc: 'Check translation fill rate per language' },
  '/admin/admin-users':         { title: 'Admin Users',           desc: 'Manage admin accounts and roles' },
  '/admin/nav-menu':            { title: 'Navigation Menu',       desc: 'Manage the main site navigation links' },
  '/admin/widgets':             { title: 'Widget Zones',          desc: 'Announcement bar, footer blurb, head scripts' },
  '/admin/redirects':           { title: 'Redirects Manager',     desc: 'Manage 301/302 URL redirects' },
};

export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const page = Object.entries(pageInfo).find(([path]) =>
    pathname === path || (path !== '/admin' && pathname.startsWith(path))
  )?.[1] ?? { title: 'Admin', desc: '' };

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <header style={{
      padding: '0 32px', height: 68,
      background: '#0f0f1a',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexShrink: 0,
      boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
    }}>
      {/* Left: title + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 3, height: 28, borderRadius: 2,
          background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
          flexShrink: 0,
        }} />
        <div>
          <h1 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3 }}>
            {page.title}
          </h1>
          {page.desc && (
            <p style={{ margin: 0, fontSize: 12, color: '#475569', lineHeight: 1 }}>{page.desc}</p>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link
          href="/"
          target="_blank"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 8,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: '#94a3b8', textDecoration: 'none', fontSize: 13, fontWeight: 500,
          }}
        >
          <span style={{ fontSize: 12 }}>↗</span> View Site
        </Link>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0,
        }}>A</div>
        <button
          onClick={handleLogout}
          style={{
            padding: '7px 14px',
            background: 'rgba(239,68,68,0.1)',
            color: '#f87171',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8, cursor: 'pointer',
            fontSize: 13, fontWeight: 500,
          }}
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
