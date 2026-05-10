import { MetadataRoute } from 'next';
import db from '@/lib/db';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://yourdomain.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { rows: blogs } = await db.query('SELECT slug, updated_at FROM blogs ORDER BY updated_at DESC');

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), priority: 1.0 },
    { url: `${BASE_URL}/download`, lastModified: new Date(), priority: 0.9 },
    { url: `${BASE_URL}/blogs`, lastModified: new Date(), priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), priority: 0.5 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: new Date(), priority: 0.3 },
    { url: `${BASE_URL}/dmca`, lastModified: new Date(), priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${BASE_URL}/blogs/${blog.slug}`,
    lastModified: new Date(blog.updated_at),
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
