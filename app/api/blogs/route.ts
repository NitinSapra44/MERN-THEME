import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all');
  const category = searchParams.get('category');

  let query = `SELECT b.id, b.title, b.slug, b.short_description, b.image, b.created_at,
    b.is_published, b.published_at, b.scheduled_at, b.tags,
    c.name as category_name, c.slug as category_slug
    FROM blogs b LEFT JOIN blog_categories c ON b.category_id = c.id`;

  const conditions: string[] = [];
  const values: any[] = [];

  if (!all) {
    conditions.push(`b.is_published = 1`);
    conditions.push(`(b.scheduled_at IS NULL OR b.scheduled_at <= NOW())`);
  }
  if (category) {
    values.push(category);
    conditions.push(`c.slug = $${values.length}`);
  }

  if (conditions.length) query += ` WHERE ${conditions.join(' AND ')}`;
  query += ' ORDER BY b.created_at DESC';

  const { rows } = await db.query(query, values);
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, slug, short_description, content, image, meta_title, meta_description,
    is_published, published_at, scheduled_at, category_id, tags } = body;

  const { rows } = await db.query(
    `INSERT INTO blogs (title, slug, short_description, content, image, meta_title, meta_description,
      is_published, published_at, scheduled_at, category_id, tags)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING id`,
    [title, slug, short_description, content, image, meta_title, meta_description,
     is_published ?? 1, published_at || new Date(), scheduled_at || null, category_id || null, tags || '']
  );

  return NextResponse.json({ id: rows[0].id }, { status: 201 });
}
