import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';
import db from '@/lib/db';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const { rows } = await db.query('SELECT * FROM media_files WHERE filename=$1 LIMIT 1', [filename]);
  if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  try { await del(rows[0].url); } catch {}

  await db.query('DELETE FROM media_files WHERE filename=$1', [filename]);
  return NextResponse.json({ success: true });
}
