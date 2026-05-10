import db from '@/lib/db';
import PageBuilderClient from './PageBuilderClient';

const PAGES = [
  { key: 'about', label: 'About Us', url: '/about' },
  { key: 'contact', label: 'Contact Us', url: '/contact' },
  { key: 'privacy', label: 'Privacy Policy', url: '/privacy-policy' },
  { key: 'dmca', label: 'DMCA', url: '/dmca' },
];

export default async function PageBuilderPage() {
  const { rows } = await db.query('SELECT * FROM page_sections ORDER BY page_key, sort_order ASC, id ASC');
  const sectionsByPage: Record<string, any[]> = {};
  for (const r of rows) {
    if (!sectionsByPage[r.page_key]) sectionsByPage[r.page_key] = [];
    sectionsByPage[r.page_key].push(r);
  }
  return <PageBuilderClient pages={PAGES} initialSections={sectionsByPage} />;
}
