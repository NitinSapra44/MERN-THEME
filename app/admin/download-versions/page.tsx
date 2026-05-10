import db from '@/lib/db';
import VersionsClient from './VersionsClient';

export default async function DownloadVersionsPage() {
  const { rows } = await db.query('SELECT * FROM apk_versions ORDER BY sort_order ASC, id DESC');
  return <VersionsClient initialVersions={rows} />;
}
