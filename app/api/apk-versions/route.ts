import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const { rows } = await db.query('SELECT * FROM apk_versions ORDER BY sort_order ASC, id DESC');
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { version_name, file_size, min_android, changelog, download_url, is_latest, sort_order } = body;

  if (is_latest) {
    await db.query('UPDATE apk_versions SET is_latest = 0');
  }

  const { rows } = await db.query(
    `INSERT INTO apk_versions (version_name, file_size, min_android, changelog, download_url, is_latest, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [version_name, file_size, min_android || 'Android 5.0+', changelog || '', download_url, is_latest ? 1 : 0, sort_order ?? 0]
  );
  return NextResponse.json(rows[0]);
}
