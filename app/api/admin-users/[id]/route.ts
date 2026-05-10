import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { role, password } = await request.json();
  if (password) {
    const hash = crypto.createHash('md5').update(password).digest('hex');
    await db.query('UPDATE admin_users SET role=$1, password=$2 WHERE id=$3', [role, hash, id]);
  } else {
    await db.query('UPDATE admin_users SET role=$1 WHERE id=$2', [role, id]);
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { rows } = await db.query('SELECT COUNT(*) as cnt FROM admin_users');
  if (Number(rows[0].cnt) <= 1) return NextResponse.json({ error: 'Cannot delete the last admin user.' }, { status: 400 });
  await db.query('DELETE FROM admin_users WHERE id=$1', [id]);
  return NextResponse.json({ success: true });
}
