import db from '@/lib/db';
import AbTestsClient from './AbTestsClient';

export default async function AbTestsPage() {
  const { rows } = await db.query('SELECT * FROM ab_tests ORDER BY created_at DESC');
  return <AbTestsClient initialTests={rows} />;
}
