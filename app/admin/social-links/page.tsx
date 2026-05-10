import db from '@/lib/db';
import SocialLinksClient from './SocialLinksClient';

export default async function SocialLinksPage() {
  const { rows } = await db.query('SELECT * FROM social_media_links ORDER BY id');
  return <SocialLinksClient links={rows} />;
}
