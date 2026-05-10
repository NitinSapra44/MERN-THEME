import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const { rows } = await db.query('SELECT * FROM css_setting WHERE id=1');
  return NextResponse.json(rows[0] ?? {});
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const fields = Object.keys(body).filter((k) => k !== 'id');
  if (fields.length === 0) return NextResponse.json({ success: true });

  const setClause = fields.map((f, i) => `${f}=$${i + 1}`).join(', ');
  const values = fields.map((f) => body[f]);

  await db.query(`UPDATE css_setting SET ${setClause} WHERE id=1`, values);
  return NextResponse.json({ success: true });
}
