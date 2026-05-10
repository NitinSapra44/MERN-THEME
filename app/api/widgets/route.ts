import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const { rows } = await db.query('SELECT * FROM site_widgets ORDER BY widget_key');
  return NextResponse.json(rows);
}

export async function PUT(request: NextRequest) {
  const { widget_key, content, is_enabled } = await request.json();
  await db.query(
    `INSERT INTO site_widgets (widget_key, content, is_enabled) VALUES ($1,$2,$3)
     ON CONFLICT (widget_key) DO UPDATE SET content=$2, is_enabled=$3`,
    [widget_key, content, is_enabled ? 1 : 0]
  );
  return NextResponse.json({ success: true });
}
