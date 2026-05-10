import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  const homepageId = request.nextUrl.searchParams.get('homepage_id') ?? '1';
  const { rows } = await db.query(
    'SELECT * FROM homepage_features WHERE homepage_id=$1 ORDER BY id',
    [homepageId]
  );
  return NextResponse.json(rows);
}

export async function PUT(request: NextRequest) {
  const homepageId = parseInt(request.nextUrl.searchParams.get('homepage_id') ?? '1');
  const features: { icon: string; title: string; description: string }[] = await request.json();

  await db.query('DELETE FROM homepage_features WHERE homepage_id=$1', [homepageId]);
  for (const feat of features) {
    await db.query(
      'INSERT INTO homepage_features (homepage_id, icon, title, description) VALUES ($1, $2, $3, $4)',
      [homepageId, feat.icon, feat.title, feat.description]
    );
  }
  return NextResponse.json({ success: true });
}
