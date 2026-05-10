import db from '@/lib/db';
import AdminSettingsClient from './AdminSettingsClient';

export default async function AdminSettingsPage() {
  const { rows } = await db.query('SELECT * FROM homepage_settings LIMIT 1');
  const { rows: siteRows } = await db.query('SELECT * FROM site_settings LIMIT 1');
  return <AdminSettingsClient settings={rows[0]} siteSettings={siteRows[0]} />;
}
