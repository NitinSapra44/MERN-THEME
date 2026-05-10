import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { label, url, target, sort_order, is_active } = await request.json();
  await db.query(
    'UPDATE nav_menu SET label=$1, url=$2, target=$3, sort_order=$4, is_active=$5 WHERE id=$6',
    [label, url, target, sort_order, is_active ?? 1, id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.query('DELETE FROM nav_menu WHERE id=$1', [id]);
  return NextResponse.json({ success: true });
}
