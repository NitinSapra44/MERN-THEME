import db from '@/lib/db';
import Link from 'next/link';

const card: React.CSSProperties = {
  background: '#12121e',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 14,
};

export default async function AdminDashboard() {
  const [blogs, faqs, features, settings] = await Promise.all([
    db.query('SELECT COUNT(*) as cnt FROM blogs'),
    db.query('SELECT COUNT(*) as cnt FROM homepage_faqs'),
    db.query('SELECT COUNT(*) as cnt FROM homepage_features'),
    db.query('SELECT website_name FROM homepage_settings LIMIT 1'),
  ]);

  const recentBlogs = await db.query(
    'SELECT id, title, slug, created_at FROM blogs ORDER BY created_at DESC LIMIT 5'
  );

  const siteName = settings.rows[0]?.website_name ?? 'AppNova';

  const stats = [
    { label: 'Blog Posts',  value: blogs.rows[0].cnt,    color: '#6366f1', glow: 'rgba(99,102,241,0.3)',  icon: '📝' },
    { label: 'FAQs',        value: faqs.rows[0].cnt,     color: '#10b981', glow: 'rgba(16,185,129,0.3)',  icon: '❓' },
    { label: 'Features',    value: features.rows[0].cnt, color: '#f59e0b', glow: 'rgba(245,158,11,0.3)',  icon: '⭐' },
    { label: 'Languages',   value: 21,                   color: '#3b82f6', glow: 'rgba(59,130,246,0.3)',  icon: '🌐' },
  ];

  const contentMap = [
    {
      section: 'Languages', href: '/admin/languages', color: '#6366f1',
      icon: '🌐',
      controls: ['Hero banner — title, subtitle, CTA button', 'Features grid cards', 'Screenshots gallery', 'Home info rich text', 'FAQ accordion items'],
    },
    {
      section: 'Settings', href: '/admin/settings', color: '#f59e0b',
      icon: '⚙️',
      controls: ['Site logo & name', 'Meta title / description', 'Download button link', 'Google Analytics & AdSense'],
    },
    {
      section: 'CSS & Design', href: '/admin/css', color: '#3b82f6',
      icon: '🎨',
      controls: ['Banner colors & fonts', 'Features section styles', 'FAQ section colors', 'Blog content typography'],
    },
    {
      section: 'Social Links', href: '/admin/social-links', color: '#8b5cf6',
      icon: '📱',
      controls: ['Footer social icon row', 'Floating Facebook button'],
    },
    {
      section: 'Blogs', href: '/admin/blogs', color: '#10b981',
      icon: '📋',
      controls: ['/blogs listing page', 'Individual /blogs/[slug] pages', 'SEO meta per post'],
    },
    {
      section: 'Static Pages', href: '/admin/about', color: '#ec4899',
      icon: '📄',
      controls: ['/about', '/contact', '/privacy-policy', '/dmca'],
    },
  ];

  const quickActions = [
    { href: '/admin/languages',    label: 'Edit Homepage Content', icon: '🌐', color: '#6366f1' },
    { href: '/admin/blogs/new',    label: 'Write New Blog Post',   icon: '✏️', color: '#10b981' },
    { href: '/admin/settings',     label: 'Update Site Settings',  icon: '⚙️', color: '#f59e0b' },
    { href: '/admin/css',          label: 'Customize Design',      icon: '🎨', color: '#3b82f6' },
    { href: '/admin/social-links', label: 'Manage Social Links',   icon: '📱', color: '#8b5cf6' },
  ];

  return (
    <div style={{ maxWidth: 1200 }}>
      {/* Welcome banner */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)',
        borderRadius: 16, padding: '32px 36px', marginBottom: 28,
        border: '1px solid rgba(99,102,241,0.3)',
        boxShadow: '0 0 60px rgba(99,102,241,0.15)',
      }}>
        {/* Decorative glows */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(139,92,246,0.2)', filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: -20, left: 100,
          width: 150, height: 150, borderRadius: '50%',
          background: 'rgba(99,102,241,0.15)', filter: 'blur(50px)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                Welcome back, Admin 👋
              </h2>
              <p style={{ margin: 0, color: 'rgba(199,210,254,0.8)', fontSize: 14 }}>
                Managing <strong style={{ color: '#c7d2fe' }}>{siteName}</strong> — all your site content is editable from this panel.
              </p>
            </div>
            <Link href="/admin/blogs/new" style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '9px 18px', background: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 9,
              color: '#fff', textDecoration: 'none', fontSize: 13.5, fontWeight: 600,
              backdropFilter: 'blur(4px)',
            }}>
              ✏️ New Post
            </Link>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
        {stats.map((s) => (
          <div key={s.label} style={{
            ...card,
            padding: '22px 24px',
            borderTop: `3px solid ${s.color}`,
            boxShadow: `0 4px 20px ${s.glow}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#f1f5f9', lineHeight: 1, letterSpacing: '-0.03em' }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
              </div>
              <div style={{
                width: 46, height: 46, borderRadius: 12,
                background: `${s.color}18`,
                border: `1px solid ${s.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
              }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Map */}
      <div style={{ ...card, padding: '24px 28px', marginBottom: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 700, color: '#f1f5f9' }}>
            What controls what?
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: '#475569' }}>
            Each admin section maps to a section on the public site — click any card to jump there.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {contentMap.map((c) => (
            <Link key={c.section} href={c.href} style={{ textDecoration: 'none' }}>
              <div style={{
                borderRadius: 10, padding: '14px 16px',
                background: '#0f0f1c',
                border: `1px solid ${c.color}22`,
                borderLeft: `3px solid ${c.color}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 15 }}>{c.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.color }}>{c.section}</span>
                </div>
                <ul style={{ margin: 0, padding: '0 0 0 12px' }}>
                  {c.controls.map((item) => (
                    <li key={item} style={{ fontSize: 11.5, color: '#64748b', marginBottom: 3, lineHeight: 1.45 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick actions + Recent blogs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
        {/* Quick actions */}
        <div style={{ ...card, padding: '22px 24px' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {quickActions.map((a) => (
              <Link key={a.href} href={a.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 9, textDecoration: 'none',
                background: '#0f0f1c',
                border: '1px solid rgba(255,255,255,0.06)',
                color: '#cbd5e1', fontSize: 13.5, fontWeight: 500,
              }}>
                <span style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: `${a.color}18`, border: `1px solid ${a.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, flexShrink: 0,
                }}>{a.icon}</span>
                {a.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent blogs */}
        <div style={{ ...card, padding: '22px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Recent Blog Posts
            </h3>
            <Link href="/admin/blogs" style={{ fontSize: 12, color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>
              View all →
            </Link>
          </div>
          {recentBlogs.rows.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#475569', fontSize: 14 }}>
              No posts yet.{' '}
              <Link href="/admin/blogs/new" style={{ color: '#6366f1' }}>Create one →</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentBlogs.rows.map((blog, i) => (
                <Link key={blog.id} href={`/admin/blogs/${blog.id}`} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '11px 12px', borderRadius: 9, textDecoration: 'none',
                  borderBottom: i < recentBlogs.rows.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: 'rgba(99,102,241,0.12)',
                      border: '1px solid rgba(99,102,241,0.2)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, flexShrink: 0,
                    }}>📝</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 500, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {blog.title}
                      </div>
                      <div style={{ fontSize: 11, color: '#334155', marginTop: 1 }}>
                        /blogs/{blog.slug}
                      </div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11.5, color: '#475569', flexShrink: 0, marginLeft: 12,
                    background: 'rgba(255,255,255,0.04)', padding: '3px 8px', borderRadius: 5,
                  }}>
                    {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
