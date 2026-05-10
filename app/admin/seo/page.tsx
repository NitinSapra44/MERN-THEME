import db from '@/lib/db';
import SeoClient from './SeoClient';

export default async function SeoPage() {
  const { rows } = await db.query('SELECT * FROM page_seo ORDER BY page_key');
  const seoMap: Record<string, any> = {};
  for (const row of rows) seoMap[row.page_key] = row;
  return <SeoClient seoMap={seoMap} />;
}
