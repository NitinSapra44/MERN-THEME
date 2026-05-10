import db from '@/lib/db';
import WidgetsClient from './WidgetsClient';

export default async function WidgetsPage() {
  const { rows } = await db.query('SELECT * FROM site_widgets ORDER BY widget_key');
  return <WidgetsClient initialWidgets={rows} />;
}
