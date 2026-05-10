import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.query('UPDATE apk_versions SET download_count = download_count + 1 WHERE id=$1', [id]);
  return NextResponse.json({ success: true });
}
