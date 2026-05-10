import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { from_path, to_path, redirect_type, is_active } = await request.json();
  await db.query(
    'UPDATE redirects SET from_path=$1, to_path=$2, redirect_type=$3, is_active=$4 WHERE id=$5',
    [from_path, to_path, redirect_type, is_active, id]
  );
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await db.query('DELETE FROM redirects WHERE id=$1', [id]);
  return NextResponse.json({ success: true });
}
