import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const [dl, home] = await Promise.all([
    db.query('SELECT * FROM download_slugs ORDER BY id'),
    db.query('SELECT * FROM home_slugs ORDER BY id'),
  ]);
  return NextResponse.json({ download: dl.rows, home: home.rows });
}

export async function POST(request: NextRequest) {
  const { slug, type } = await request.json();
  const table = type === 'home' ? 'home_slugs' : 'download_slugs';
  try {
    const { rows } = await db.query(
      `INSERT INTO ${table} (slug, is_current) VALUES ($1, 0) RETURNING *`,
      [slug]
    );
    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ error: 'Slug already exists.' }, { status: 409 });
  }
}
