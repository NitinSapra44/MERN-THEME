import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const { rows } = await db.query('SELECT * FROM nav_menu ORDER BY sort_order ASC, id ASC');
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { label, url, target } = await request.json();
  const { rows: count } = await db.query('SELECT COUNT(*) as cnt FROM nav_menu');
  const { rows } = await db.query(
    'INSERT INTO nav_menu (label, url, target, sort_order) VALUES ($1,$2,$3,$4) RETURNING *',
    [label, url, target || '_self', Number(count[0].cnt)]
  );
  return NextResponse.json(rows[0]);
}
