import db from '@/lib/db';
import CategoriesClient from './CategoriesClient';

export default async function CategoriesPage() {
  const { rows } = await db.query(
    `SELECT c.*, (SELECT COUNT(*) FROM blogs WHERE category_id=c.id AND is_published=1) as post_count
     FROM blog_categories c ORDER BY c.name`
  );
  return <CategoriesClient initialCategories={rows} />;
}
