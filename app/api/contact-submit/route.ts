import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, subject, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? request.headers.get('x-real-ip') ?? '';

  await db.query(
    'INSERT INTO contact_submissions (name, email, subject, message, ip_address) VALUES ($1, $2, $3, $4, $5)',
    [name.trim(), email.trim(), (subject || '').trim(), message.trim(), ip]
  );

  return NextResponse.json({ success: true });
}
