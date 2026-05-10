import db from '@/lib/db';
import { notFound } from 'next/navigation';
import { getSiteSettings } from '@/lib/getSiteSettings';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { rows } = await db.query('SELECT meta_title, meta_description FROM blogs WHERE slug=$1 LIMIT 1', [slug]);
  const blog = rows[0];
  if (!blog) return {};
  return { title: blog.meta_title, description: blog.meta_description };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ rows }, { css }] = await Promise.all([
    db.query(`SELECT b.*, c.name as category_name, c.slug as category_slug
      FROM blogs b LEFT JOIN blog_categories c ON b.category_id = c.id
      WHERE b.slug=$1 AND b.is_published=1 LIMIT 1`, [slug]),
    getSiteSettings(),
  ]);
  const blog = rows[0];
  if (!blog) notFound();

  const { rows: related } = await db.query(
    `SELECT id, title, slug, image, short_description FROM blogs
     WHERE is_published=1 AND slug != $1 AND (category_id = $2 OR $2 IS NULL)
     ORDER BY created_at DESC LIMIT 3`,
    [slug, blog.category_id || null]
  );

  const fontSize = css?.font_size ?? 16;
  const textColor = css?.text_color || '#333333';
  const h2GenSize = css?.h2_general_size ?? 22;
  const h3Size = css?.h3_size ?? 18;
  const h3Color = css?.h3_color || '#222';

  const imageUrl = blog.image
    ? (blog.image.startsWith('/') ? blog.image : `/uploads/blogs/${blog.image}`)
    : null;

  return (
    <div style={{ background: '#fff', minHeight: '60vh' }}>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #3d3d3d 0%, #1a1a1a 100%)',
        padding: '48px 20px', textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 32, color: '#fff', margin: 0, fontWeight: 800, maxWidth: 800, marginLeft: 'auto', marginRight: 'auto' }}>
          {blog.title}
        </h1>
      </section>

      {/* Featured image */}
      {imageUrl && (
        <div style={{ maxWidth: 900, margin: '32px auto 0', padding: '0 20px' }}>
          <img
            src={imageUrl}
            alt={blog.title}
            style={{ width: '100%', maxHeight: 420, objectFit: 'cover', borderRadius: 10 }}
          />
        </div>
      )}

      {/* Content */}
      <section style={{ padding: '40px 20px 60px' }}>
        <article
          className="rich-content"
          style={{ maxWidth: 900, margin: '0 auto', fontSize, color: textColor, lineHeight: 1.8 }}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section style={{ padding: '0 20px 60px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%)', borderRadius: 8, padding: '14px 24px', marginBottom: 24 }}>
              <h2 style={{ margin: 0, fontSize: 20, color: '#fff', fontWeight: 700 }}>Related Posts</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
              {related.map((r) => (
                <a key={r.id} href={`/${r.slug}`} style={{ background: '#fff', borderRadius: 10, overflow: 'hidden', border: '1px solid #e5e7eb', textDecoration: 'none', display: 'block', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                  {r.image && <img src={r.image.startsWith('/') ? r.image : `/uploads/blogs/${r.image}`} alt={r.title} style={{ width: '100%', height: 140, objectFit: 'cover' }} />}
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.4 }}>{r.title}</div>
                    {r.short_description && <div style={{ fontSize: 12, color: '#666', marginTop: 6, lineHeight: 1.5 }}>{r.short_description.slice(0, 80)}{r.short_description.length > 80 ? '…' : ''}</div>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <style>{`
        .rich-content h2 {
          background: linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%);
          color: #fff !important;
          padding: 12px 20px;
          border-radius: 6px;
          font-size: ${h2GenSize}px;
          margin: 28px 0 16px;
        }
        .rich-content h3 { font-size: ${h3Size}px; color: ${h3Color}; margin: 20px 0 10px; }
        .rich-content ul, .rich-content ol { padding-left: 24px; margin: 12px 0; }
        .rich-content li { margin-bottom: 6px; line-height: 1.7; }
        .rich-content img { max-width: 100%; border-radius: 8px; }
        .rich-content a { color: #4f46e5; }
      `}</style>
    </div>
  );
}
