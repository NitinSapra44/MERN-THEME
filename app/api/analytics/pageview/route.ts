import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  const { path } = await request.json();
  if (!path) return NextResponse.json({ ok: false });
  await db.query(
    `INSERT INTO page_views (path, views, last_viewed) VALUES ($1, 1, NOW())
     ON CONFLICT (path) DO UPDATE SET views = page_views.views + 1, last_viewed = NOW()`,
    [path]
  );
  return NextResponse.json({ ok: true });
}
