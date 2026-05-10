import db from '@/lib/db';
import MediaLibraryClient from './MediaLibraryClient';

export default async function MediaPage() {
  const { rows } = await db.query('SELECT * FROM media_files ORDER BY created_at DESC');
  return <MediaLibraryClient initialFiles={rows} />;
}
