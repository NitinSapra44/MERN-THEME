import db from '@/lib/db';
import RedirectsClient from './RedirectsClient';

export default async function RedirectsPage() {
  const { rows } = await db.query('SELECT * FROM redirects ORDER BY created_at DESC');
  return <RedirectsClient initialRedirects={rows} />;
}
