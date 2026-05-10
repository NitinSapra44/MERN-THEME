import db from '@/lib/db';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import DeleteBlogButton from './DeleteBlogButton';

async function deleteBlog(id: number) {
  'use server';
  const db2 = (await import('@/lib/db')).default;
  await db2.query('DELETE FROM blogs WHERE id=$1', [id]);
  revalidatePath('/admin/blogs');
}

export default async function AdminBlogsPage() {
  const { rows: blogs } = await db.query(
    `SELECT b.id, b.title, b.slug, b.created_at, b.is_published, b.scheduled_at, c.name as category_name
     FROM blogs b LEFT JOIN blog_categories c ON b.category_id = c.id
     ORDER BY b.created_at DESC`
  );

  return (
    <div style={{ maxWidth: 1100 }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <p style={{ margin: 0, color: '#475569', fontSize: 13 }}>
          {blogs.length} post{blogs.length !== 1 ? 's' : ''} total
        </p>
        <Link
          href="/admin/blogs/new"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 7,
            padding: '9px 20px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: '#fff', borderRadius: 9,
            textDecoration: 'none', fontSize: 13.5, fontWeight: 600,
            boxShadow: '0 4px 15px rgba(99,102,241,0.35)',
          }}
        >
          ✏️ New Blog Post
        </Link>
      </div>

      {/* Table card */}
      <div style={{
        background: '#12121e',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14, overflow: 'hidden',
      }}>
        {blogs.length === 0 ? (
          <div style={{ padding: '64px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📝</div>
            <div style={{ color: '#475569', fontSize: 15, marginBottom: 8 }}>No blog posts yet.</div>
            <Link href="/admin/blogs/new" style={{ color: '#6366f1', fontWeight: 600, fontSize: 14 }}>
              Create your first post →
            </Link>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Title', 'Category', 'Status', 'Published', 'Actions'].map((h) => (
                  <th key={h} style={{
                    padding: '13px 20px', textAlign: 'left',
                    fontSize: 11, fontWeight: 700, color: '#475569',
                    textTransform: 'uppercase', letterSpacing: '0.08em',
                    background: 'rgba(255,255,255,0.02)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog, i) => (
                <tr
                  key={blog.id}
                  style={{ borderBottom: i < blogs.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                >
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ fontWeight: 600, color: '#e2e8f0', fontSize: 14 }}>{blog.title}</div>
                    <code style={{ fontSize: 11, color: '#818cf8', fontFamily: 'monospace' }}>/{blog.slug}</code>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {blog.category_name ? (
                      <span style={{ fontSize: 12, padding: '3px 9px', background: 'rgba(99,102,241,0.1)', color: '#818cf8', borderRadius: 20 }}>{blog.category_name}</span>
                    ) : <span style={{ fontSize: 12, color: '#334155' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    {blog.is_published === 1 && !blog.scheduled_at ? (
                      <span style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(16,185,129,0.12)', color: '#34d399', borderRadius: 20, fontWeight: 700 }}>Published</span>
                    ) : blog.scheduled_at && new Date(blog.scheduled_at) > new Date() ? (
                      <span style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(245,158,11,0.12)', color: '#fbbf24', borderRadius: 20, fontWeight: 700 }}>Scheduled</span>
                    ) : (
                      <span style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(239,68,68,0.1)', color: '#f87171', borderRadius: 20, fontWeight: 700 }}>Draft</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{ fontSize: 12, color: '#475569', background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: 6 }}>
                      {new Date(blog.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </td>
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link
                        href={`/admin/blogs/${blog.id}`}
                        style={{
                          padding: '6px 14px',
                          background: 'rgba(99,102,241,0.12)',
                          border: '1px solid rgba(99,102,241,0.25)',
                          color: '#818cf8', borderRadius: 7,
                          textDecoration: 'none', fontSize: 13, fontWeight: 500,
                        }}
                      >
                        Edit
                      </Link>
                      <DeleteBlogButton id={blog.id} deleteAction={deleteBlog} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
