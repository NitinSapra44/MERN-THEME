import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { variant, type } = await request.json(); // variant: 'a'|'b', type: 'click'|'impression'
  const col = type === 'impression'
    ? (variant === 'a' ? 'impressions_a' : 'impressions_b')
    : (variant === 'a' ? 'clicks_a' : 'clicks_b');
  await db.query(`UPDATE ab_tests SET ${col} = ${col} + 1 WHERE id=$1`, [id]);
  return NextResponse.json({ ok: true });
}
