import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const { rows } = await db.query('SELECT * FROM page_seo ORDER BY page_key');
  return NextResponse.json(rows);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { page_key, ...fields } = body;
  if (!page_key) return NextResponse.json({ error: 'page_key required' }, { status: 400 });

  const keys = Object.keys(fields);
  if (keys.length === 0) return NextResponse.json({ success: true });

  const setClause = keys.map((k, i) => `${k}=$${i + 2}`).join(', ');
  const values = [page_key, ...keys.map((k) => fields[k])];
  await db.query(
    `INSERT INTO page_seo (page_key, ${keys.join(', ')}) VALUES ($1, ${keys.map((_, i) => `$${i + 2}`).join(', ')})
     ON CONFLICT (page_key) DO UPDATE SET ${setClause}`,
    values
  );
  return NextResponse.json({ success: true });
}
