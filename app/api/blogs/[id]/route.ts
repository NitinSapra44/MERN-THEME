import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { rows } = await db.query(
    `SELECT b.*, c.name as category_name FROM blogs b
     LEFT JOIN blog_categories c ON b.category_id = c.id
     WHERE b.id=$1 LIMIT 1`,
    [id]
  );
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { title, slug, short_description, content, image, meta_title, meta_description,
    is_published, published_at, scheduled_at, category_id, tags } = body;

  await db.query(
    `UPDATE blogs SET title=$1, slug=$2, short_description=$3, content=$4, image=$5,
     meta_title=$6, meta_description=$7, is_published=$8, published_at=$9,
     scheduled_at=$10, category_id=$11, tags=$12, updated_at=NOW() WHERE id=$13`,
    [title, slug, short_description, content, image, meta_title, meta_description,
     is_published ?? 1, published_at || new Date(), scheduled_at || null,
     category_id || null, tags || '', id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.query('DELETE FROM blogs WHERE id=$1', [id]);
  return NextResponse.json({ success: true });
}
