import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const [views, totalBlogs, downloads, topPages, recentActivity] = await Promise.all([
    db.query('SELECT COALESCE(SUM(views), 0) as total FROM page_views'),
    db.query('SELECT COUNT(*) as cnt FROM blogs WHERE is_published=1'),
    db.query('SELECT COALESCE(SUM(download_count), 0) as total FROM apk_versions'),
    db.query('SELECT path, views FROM page_views ORDER BY views DESC LIMIT 10'),
    db.query('SELECT * FROM admin_activity_log ORDER BY created_at DESC LIMIT 20'),
  ]);

  return NextResponse.json({
    totalViews: Number(views.rows[0]?.total ?? 0),
    totalBlogs: Number(totalBlogs.rows[0]?.cnt ?? 0),
    totalDownloads: Number(downloads.rows[0]?.total ?? 0),
    topPages: topPages.rows,
    recentActivity: recentActivity.rows,
  });
}
