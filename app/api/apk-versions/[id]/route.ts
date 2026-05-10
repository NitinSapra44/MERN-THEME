import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { version_name, file_size, min_android, changelog, download_url, is_latest, sort_order } = body;

  if (is_latest) {
    await db.query('UPDATE apk_versions SET is_latest = 0');
  }

  await db.query(
    `UPDATE apk_versions SET version_name=$1, file_size=$2, min_android=$3, changelog=$4,
     download_url=$5, is_latest=$6, sort_order=$7 WHERE id=$8`,
    [version_name, file_size, min_android, changelog, download_url, is_latest ? 1 : 0, sort_order ?? 0, id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.query('DELETE FROM apk_versions WHERE id=$1', [id]);
  return NextResponse.json({ success: true });
}
