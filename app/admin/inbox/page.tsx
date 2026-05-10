import db from '@/lib/db';
import InboxClient from './InboxClient';

export default async function InboxPage() {
  const { rows } = await db.query('SELECT * FROM contact_submissions ORDER BY created_at DESC');
  const unread = rows.filter((r) => r.is_read !== 1).length;
  return <InboxClient initialMessages={rows} unread={unread} />;
}
