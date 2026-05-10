import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';

export async function GET() {
  const { rows } = await db.query('SELECT id, username, role, created_at, last_login FROM admin_users ORDER BY id');
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const { username, password, role } = await request.json();
  if (!username || !password) return NextResponse.json({ error: 'Username and password required.' }, { status: 400 });
  const hash = crypto.createHash('md5').update(password).digest('hex');
  try {
    const { rows } = await db.query(
      'INSERT INTO admin_users (username, password, role) VALUES ($1,$2,$3) RETURNING id, username, role, created_at',
      [username, hash, role || 'editor']
    );
    return NextResponse.json(rows[0]);
  } catch {
    return NextResponse.json({ error: 'Username already exists.' }, { status: 409 });
  }
}
