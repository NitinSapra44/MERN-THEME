import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = (formData.get('type') as string) ?? 'blogs';

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}.${ext}`;
    const pathname = `uploads/${type}/${filename}`;

    const blob = await put(pathname, file, { access: 'public' });

    await db.query(
      'INSERT INTO media_files (filename, original_name, file_type, file_size, url, upload_type) VALUES ($1,$2,$3,$4,$5,$6)',
      [filename, file.name, file.type, file.size, blob.url, type]
    ).catch(() => {});

    return NextResponse.json({ filename, url: blob.url });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
