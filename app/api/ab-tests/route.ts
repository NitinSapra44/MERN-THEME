import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const { rows } = await db.query('SELECT * FROM ab_tests ORDER BY created_at DESC');
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { name, variant_a_text, variant_a_color, variant_b_text, variant_b_color } = await request.json();
  const { rows } = await db.query(
    'INSERT INTO ab_tests (name, variant_a_text, variant_a_color, variant_b_text, variant_b_color) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [name, variant_a_text, variant_a_color, variant_b_text, variant_b_color]
  );
  return NextResponse.json(rows[0]);
}
