import db from '@/lib/db';
import CssControlsClient from './CssControlsClient';

export default async function CssControlsPage() {
  const { rows } = await db.query('SELECT * FROM css_setting WHERE id=1');
  return <CssControlsClient data={rows[0] ?? {}} />;
}
