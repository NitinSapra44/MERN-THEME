import db from '@/lib/db';
import Link from 'next/link';
import { getPageContent, getSiteSettings } from '@/lib/getSiteSettings';

export async function generateMetadata() {
  const { rows } = await db.query("SELECT * FROM page_seo WHERE page_key='blogs' LIMIT 1");
  const seo = rows[0];
  return { title: seo?.meta_title || 'Blog', description: seo?.meta_description, robots: seo?.robots || 'index, follow' };
}

export default async function BlogsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [{ rows: blogs }, { rows: cats }, { content }, { css }] = await Promise.all([
    db.query(`SELECT b.id, b.title, b.slug, b.short_description, b.image, b.created_at, b.tags,
      c.name as category_name, c.slug as category_slug
      FROM blogs b LEFT JOIN blog_categories c ON b.category_id = c.id
      WHERE b.is_published=1 AND (b.scheduled_at IS NULL OR b.scheduled_at <= NOW())
      ORDER BY b.created_at DESC`),
    db.query('SELECT * FROM blog_categories ORDER BY name'),
    getPageContent(locale),
    getSiteSettings(),
  ]);

  const prefix = locale === 'en' ? '' : `/${locale}`;
  const postLimit = content?.post_limit ?? 100;
  const postBtnBg   = content?.post_button_bg_color   || css?.btn_bg_color   || '#6366f1';
  const postBtnText = content?.post_button_text_color || css?.btn_text_color || '#ffffff';
  const displayed = blogs.slice(0, postLimit);

  return (
    <div style={{ background: '#07071a', minHeight: '80vh', color: '#f1f5f9' }}>
      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #0a0a22 0%, #0f0b30 60%, #0a0a22 100%)', padding: '72px 24px 60px', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#6366f1', display: 'block', marginBottom: 12 }}>Knowledge Base</span>
          <h1 style={{ fontSize: 44, color: '#f1f5f9', margin: '0 0 8px', fontWeight: 800, letterSpacing: '-0.025em' }}>Blog & Guides</h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', margin: '0 0 28px' }}>Tips, tutorials and the latest updates</p>
          <div style={{ width: 48, height: 3, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)', borderRadius: 2, margin: '0 auto 28px' }} />
          {cats.length > 0 && (
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href={`${prefix}/blogs`} style={{ padding: '7px 18px', borderRadius: 100, fontSize: 13, fontWeight: 600, background: 'rgba(99,102,241,0.2)', color: '#a5b4fc', textDecoration: 'none', border: '1px solid rgba(99,102,241,0.35)' }}>All</Link>
              {cats.map(c => (
                <Link key={c.slug} href={`${prefix}/blogs/category/${c.slug}`} style={{ padding: '7px 18px', borderRadius: 100, fontSize: 13, fontWeight: 500, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>{c.name}</Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Grid */}
      <section style={{ padding: '56px 24px 80px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          {displayed.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#475569' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
              <p style={{ fontSize: 18, fontWeight: 600 }}>No posts yet</p>
              <p style={{ fontSize: 14, marginTop: 8 }}>Check back soon for new articles.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
              {displayed.map(blog => (
                <article key={blog.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  {blog.image ? (
                    <div style={{ height: 200, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={blog.image.startsWith('/') ? blog.image : `/uploads/blogs/${blog.image}`} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ height: 120, background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40, flexShrink: 0 }}>📄</div>
                  )}
                  <div style={{ padding: '22px 22px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      {blog.category_name && (
                        <Link href={`${prefix}/blogs/category/${blog.category_slug}`} style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#818cf8', textDecoration: 'none', background: 'rgba(99,102,241,0.12)', padding: '3px 10px', borderRadius: 20 }}>
                          {blog.category_name}
                        </Link>
                      )}
                      <span style={{ fontSize: 12, color: '#475569', marginLeft: 'auto' }}>
                        {new Date(blog.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <h2 style={{ fontSize: 18, margin: '0 0 10px', lineHeight: 1.4, flex: 0 }}>
                      <Link href={`${prefix}/${blog.slug}`} style={{ color: '#f1f5f9', textDecoration: 'none', fontWeight: 700 }}>{blog.title}</Link>
                    </h2>
                    {blog.short_description && (
                      <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 16px', lineHeight: 1.65, flex: 1 }}>{blog.short_description}</p>
                    )}
                    {blog.tags && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
                        {blog.tags.split(',').filter(Boolean).map((t: string) => (
                          <span key={t} style={{ fontSize: 11, padding: '3px 9px', background: 'rgba(255,255,255,0.05)', color: '#64748b', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)' }}>{t.trim()}</span>
                        ))}
                      </div>
                    )}
                    <Link href={`${prefix}/${blog.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: postBtnBg, color: postBtnText, padding: '9px 20px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 700, alignSelf: 'flex-start' }}>
                      {content?.post_button_text || 'Read More'}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
