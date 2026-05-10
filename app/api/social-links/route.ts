import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const { rows } = await db.query('SELECT * FROM social_media_links ORDER BY id');
  return NextResponse.json(rows);
}

export async function PUT(request: NextRequest) {
  const items = await request.json();
  // Replace all: delete then re-insert
  await db.query('DELETE FROM social_media_links');
  for (const item of items) {
    if (!item.platform && !item.url) continue;
    await db.query(
      'INSERT INTO social_media_links (platform, url, icon) VALUES ($1, $2, $3)',
      [item.platform, item.url, item.icon]
    );
  }
  return NextResponse.json({ success: true });
}
