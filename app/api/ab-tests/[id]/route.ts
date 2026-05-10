import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, variant_a_text, variant_a_color, variant_b_text, variant_b_color, is_active } = await request.json();
  if (is_active === 1) await db.query('UPDATE ab_tests SET is_active=0');
  await db.query(
    'UPDATE ab_tests SET name=$1, variant_a_text=$2, variant_a_color=$3, variant_b_text=$4, variant_b_color=$5, is_active=$6 WHERE id=$7',
    [name, variant_a_text, variant_a_color, variant_b_text, variant_b_color, is_active ?? 0, id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.query('DELETE FROM ab_tests WHERE id=$1', [id]);
  return NextResponse.json({ success: true });
}
