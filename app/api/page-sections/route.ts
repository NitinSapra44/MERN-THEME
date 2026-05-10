import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageKey = searchParams.get('page');
  if (!pageKey) return NextResponse.json({ error: 'page param required' }, { status: 400 });
  const { rows } = await db.query('SELECT * FROM page_sections WHERE page_key=$1 ORDER BY sort_order ASC, id ASC', [pageKey]);
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { page_key, section_type, content, sort_order } = await request.json();
  const { rows } = await db.query(
    'INSERT INTO page_sections (page_key, section_type, content, sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
    [page_key, section_type, JSON.stringify(content ?? {}), sort_order ?? 0]
  );
  return NextResponse.json(rows[0]);
}
