import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.query('UPDATE contact_submissions SET is_read=1 WHERE id=$1', [id]);
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.query('DELETE FROM contact_submissions WHERE id=$1', [id]);
  return NextResponse.json({ success: true });
}
