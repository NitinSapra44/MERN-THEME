import { NextRequest, NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from '@/lib/session';
import db from '@/lib/db';
import crypto from 'crypto';

const WINDOW_MINUTES = 15;
const MAX_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';

  let body: { username?: string; password?: string };
  try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid request' }, { status: 400 }); }
  const { username, password } = body;

  // Rate limit check — silently skip if table doesn't exist yet
  try {
    const { rows: attempts } = await db.query(
      `SELECT COUNT(*) as cnt FROM login_attempts
       WHERE ip_address=$1 AND success=0
       AND attempted_at > NOW() - INTERVAL '${WINDOW_MINUTES} minutes'`,
      [ip]
    );
    if (Number(attempts[0]?.cnt ?? 0) >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: `Too many failed attempts. Try again in ${WINDOW_MINUTES} minutes.` }, { status: 429 });
    }
  } catch { /* login_attempts table may not exist yet */ }

  const { rows } = await db.query(
    'SELECT id, username, password, role FROM admin_users WHERE username=$1 LIMIT 1',
    [username]
  );
  const user = rows[0];

  const hash = crypto.createHash('md5').update(password ?? '').digest('hex');
  const success = user && user.password === hash;

  // Record attempt — silently skip if table doesn't exist
  try {
    await db.query(
      'INSERT INTO login_attempts (ip_address, success) VALUES ($1,$2)',
      [ip, success ? 1 : 0]
    );
  } catch { /* login_attempts table may not exist yet */ }

  if (!success) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Update last_login
  try { await db.query('UPDATE admin_users SET last_login=NOW() WHERE id=$1', [user.id]); } catch { /* */ }

  // Log activity — silently skip if table doesn't exist
  try {
    await db.query(
      'INSERT INTO admin_activity_log (admin_id, admin_username, action) VALUES ($1,$2,$3)',
      [user.id, user.username, `Logged in from ${ip}`]
    );
  } catch { /* admin_activity_log table may not exist yet */ }

  const response = NextResponse.json({ success: true });
  const session = await getIronSession<SessionData>(request, response, sessionOptions);
  session.isLoggedIn = true;
  session.adminId = user.id;
  session.adminUsername = user.username;
  await session.save();

  return response;
}
