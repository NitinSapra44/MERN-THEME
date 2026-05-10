import db from '@/lib/db';
import NavMenuClient from './NavMenuClient';

export default async function NavMenuPage() {
  const { rows } = await db.query('SELECT * FROM nav_menu ORDER BY sort_order');
  return <NavMenuClient initialItems={rows} />;
}
