import db from '@/lib/db';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPageContent, getSiteSettings } from '@/lib/getSiteSettings';

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const [{ rows: catRows }, { content }, { css }] = await Promise.all([
    db.query('SELECT * FROM blog_categories WHERE slug=$1 LIMIT 1', [slug]),
    getPageContent(locale),
    getSiteSettings(),
  ]);

  const category = catRows[0];
  if (!category) notFound();

  const { rows: blogs } = await db.query(
    `SELECT b.id, b.title, b.slug, b.short_description, b.image, b.created_at, b.tags
     FROM blogs b
     WHERE b.category_id=$1 AND b.is_published=1 AND (b.scheduled_at IS NULL OR b.scheduled_at <= NOW())
     ORDER BY b.created_at DESC`,
    [category.id]
  );

  const prefix = locale === 'en' ? '' : `/${locale}`;
  const postBtnBg = content?.post_button_bg_color || css?.btn_bg_color || '#4f46e5';
  const postBtnText = content?.post_button_text_color || css?.btn_text_color || '#ffffff';

  return (
    <div style={{ background: '#f8f9fa', minHeight: '60vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #3d3d3d 0%, #1a1a1a 100%)', padding: '48px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
          <Link href={`${prefix}/blogs`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>Blogs</Link> / Category
        </div>
        <h1 style={{ fontSize: 34, color: '#fff', margin: '0 0 8px', fontWeight: 800 }}>{category.name}</h1>
        {category.description && <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', margin: 0 }}>{category.description}</p>}
        <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{blogs.length} post{blogs.length !== 1 ? 's' : ''}</div>
      </section>

      <section style={{ padding: '48px 20px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {blogs.map((blog) => (
            <article key={blog.id} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e5e7eb' }}>
              {blog.image && <img src={blog.image.startsWith('/') ? blog.image : `/uploads/blogs/${blog.image}`} alt={blog.title} style={{ width: '100%', height: 180, objectFit: 'cover' }} />}
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontSize: 18, margin: '0 0 10px', lineHeight: 1.4 }}>
                  <Link href={`${prefix}/${blog.slug}`} style={{ color: '#1a1a1a', textDecoration: 'none' }}>{blog.title}</Link>
                </h2>
                {blog.short_description && <p style={{ fontSize: 14, color: '#666', margin: '0 0 16px', lineHeight: 1.6 }}>{blog.short_description}</p>}
                <Link href={`${prefix}/${blog.slug}`} style={{ display: 'inline-block', background: postBtnBg, color: postBtnText, padding: '8px 18px', borderRadius: 6, textDecoration: 'none', fontSize: 13, fontWeight: 600 }}>
                  {content?.post_button_text || 'Read More'}
                </Link>
              </div>
            </article>
          ))}
          {blogs.length === 0 && <p style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888' }}>No posts in this category yet.</p>}
        </div>
      </section>
    </div>
  );
}
