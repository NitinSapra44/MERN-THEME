import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// PUT: set as current or add new slug
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { type } = await request.json(); // type: 'download' | 'home'
  const table = type === 'home' ? 'home_slugs' : 'download_slugs';
  await db.query(`UPDATE ${table} SET is_current=0`);
  await db.query(`UPDATE ${table} SET is_current=1 WHERE id=$1`, [id]);
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { type } = await request.json();
  const table = type === 'home' ? 'home_slugs' : 'download_slugs';
  await db.query(`DELETE FROM ${table} WHERE id=$1`, [id]);
  return NextResponse.json({ success: true });
}
