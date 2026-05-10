import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  const homepageId = request.nextUrl.searchParams.get('homepage_id') ?? '1';
  const { rows } = await db.query(
    'SELECT * FROM homepage_screenshots WHERE homepage_id=$1 ORDER BY id',
    [homepageId]
  );
  return NextResponse.json(rows);
}

export async function PUT(request: NextRequest) {
  const homepageId = parseInt(request.nextUrl.searchParams.get('homepage_id') ?? '1');
  const screenshots: { image: string; heading: string; description: string; bg_color: string }[] = await request.json();

  await db.query('DELETE FROM homepage_screenshots WHERE homepage_id=$1', [homepageId]);
  for (const s of screenshots) {
    await db.query(
      'INSERT INTO homepage_screenshots (homepage_id, image, heading, description, bg_color) VALUES ($1, $2, $3, $4, $5)',
      [homepageId, s.image, s.heading, s.description, s.bg_color ?? '#ffffff']
    );
  }
  return NextResponse.json({ success: true });
}
