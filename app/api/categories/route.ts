import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const { rows } = await db.query('SELECT *, (SELECT COUNT(*) FROM blogs WHERE category_id=blog_categories.id AND is_published=1) as post_count FROM blog_categories ORDER BY name');
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { name, description } = await request.json();
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  try {
    const { rows } = await db.query(
      'INSERT INTO blog_categories (name, slug, description) VALUES ($1,$2,$3) RETURNING *',
      [name, slug, description || '']
    );
    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ error: 'Category with this name already exists.' }, { status: 409 });
  }
}
