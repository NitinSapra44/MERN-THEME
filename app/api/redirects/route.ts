import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const { rows } = await db.query('SELECT * FROM redirects ORDER BY created_at DESC');
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { from_path, to_path, redirect_type } = await request.json();
  const from = from_path.startsWith('/') ? from_path : `/${from_path}`;
  try {
    const { rows } = await db.query(
      'INSERT INTO redirects (from_path, to_path, redirect_type, is_active) VALUES ($1,$2,$3,1) RETURNING *',
      [from, to_path, redirect_type || 301]
    );
    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ error: 'A redirect from this path already exists.' }, { status: 409 });
  }
}
