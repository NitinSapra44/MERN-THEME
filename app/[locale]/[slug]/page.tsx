import db from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import DownloadPage from '../download/page';

export default async function DynamicSlugPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // 1. Check download_slugs
  const { rows: dlRows } = await db.query(
    'SELECT slug, is_current FROM download_slugs WHERE slug=$1 LIMIT 1',
    [slug]
  );
  if (dlRows.length > 0) {
    if (dlRows[0].is_current === 1) {
      return <DownloadPage params={Promise.resolve({ locale })} />;
    } else {
      const { rows: currentRows } = await db.query(
        'SELECT slug FROM download_slugs WHERE is_current=1 LIMIT 1'
      );
      redirect(`/${currentRows[0]?.slug ?? 'download'}`);
    }
  }

  // 2. Check home_slugs
  const { rows: homeRows } = await db.query(
    'SELECT slug, is_current FROM home_slugs WHERE slug=$1 LIMIT 1',
    [slug]
  );
  if (homeRows.length > 0) {
    if (homeRows[0].is_current === 1) {
      const { default: HomePage } = await import('../page');
      return <HomePage params={Promise.resolve({ locale })} />;
    } else {
      const { rows: currentRows } = await db.query(
        'SELECT slug FROM home_slugs WHERE is_current=1 LIMIT 1'
      );
      redirect(`/${currentRows[0]?.slug ?? ''}`);
    }
  }

  // 3. Check blogs
  const { rows: blogRows } = await db.query(
    'SELECT slug FROM blogs WHERE slug=$1 LIMIT 1',
    [slug]
  );
  if (blogRows.length > 0) {
    const { default: BlogDetailPage } = await import('../blogs/[slug]/page');
    return <BlogDetailPage params={Promise.resolve({ slug })} />;
  }

  notFound();
}
