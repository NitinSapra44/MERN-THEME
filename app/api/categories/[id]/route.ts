import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, description } = await request.json();
  await db.query('UPDATE blog_categories SET name=$1, description=$2 WHERE id=$3', [name, description, id]);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.query('UPDATE blogs SET category_id=NULL WHERE category_id=$1', [id]);
  await db.query('DELETE FROM blog_categories WHERE id=$1', [id]);
  return NextResponse.json({ success: true });
}
