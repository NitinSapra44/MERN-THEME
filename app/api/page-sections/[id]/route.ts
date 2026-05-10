import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { section_type, content, sort_order, is_enabled } = body;
  await db.query(
    'UPDATE page_sections SET section_type=$1, content=$2, sort_order=$3, is_enabled=$4 WHERE id=$5',
    [section_type, JSON.stringify(content ?? {}), sort_order ?? 0, is_enabled ?? 1, id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.query('DELETE FROM page_sections WHERE id=$1', [id]);
  return NextResponse.json({ success: true });
}
