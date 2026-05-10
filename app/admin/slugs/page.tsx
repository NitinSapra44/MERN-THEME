import db from '@/lib/db';
import SlugManagerClient from './SlugManagerClient';

export default async function SlugManagerPage() {
  const [dl, home] = await Promise.all([
    db.query('SELECT * FROM download_slugs ORDER BY id'),
    db.query('SELECT * FROM home_slugs ORDER BY id'),
  ]);
  return <SlugManagerClient downloadSlugs={dl.rows} homeSlugs={home.rows} />;
}
