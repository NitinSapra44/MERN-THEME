import { cache } from 'react';
import db from './db';

export const getSiteSettings = cache(async () => {
  const [settingsRes, cssRes, siteRes, linksRes] = await Promise.all([
    db.query('SELECT * FROM homepage_settings LIMIT 1'),
    db.query('SELECT * FROM css_setting WHERE id=1'),
    db.query('SELECT * FROM site_settings WHERE id=1'),
    db.query('SELECT * FROM social_media_links ORDER BY id'),
  ]);
  return {
    settings: settingsRes.rows[0] ?? {},
    css: cssRes.rows[0] ?? {},
    site: siteRes.rows[0] ?? {},
    links: linksRes.rows as { platform: string; url: string; icon: string }[],
  };
});

export const getPageContent = cache(async (locale: string) => {
  const { localeTableMap } = await import('./localeTableMap');
  const table = localeTableMap[locale] ?? 'homepage_english';
  const [contentRes, faqsRes, featuresRes, screenshotsRes] = await Promise.all([
    db.query(`SELECT * FROM ${table} WHERE id=1`),
    db.query('SELECT * FROM homepage_faqs WHERE homepage_id=1 ORDER BY id'),
    db.query('SELECT * FROM homepage_features WHERE homepage_id=1 ORDER BY id'),
    db.query('SELECT * FROM homepage_screenshots WHERE homepage_id=1 ORDER BY id'),
  ]);
  return {
    content: contentRes.rows[0] ?? {},
    faqs: faqsRes.rows as { question: string; answer: string }[],
    features: featuresRes.rows as { icon: string; title: string; description: string }[],
    screenshots: screenshotsRes.rows as { image: string; heading: string; description: string; bg_color: string }[],
  };
});
