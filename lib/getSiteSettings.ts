import { cache } from 'react';
import db from './db';

export const getSiteSettings = cache(async () => {
  const [settingsRes, cssRes, siteRes, linksRes] = await Promise.all([
    db.query('SELECT * FROM homepage_settings LIMIT 1'),
    db.query('SELECT * FROM css_setting WHERE id=1'),
    db.query('SELECT * FROM site_settings WHERE id=1'),
    db.query('SELECT * FROM social_media_links ORDER BY id'),
  ]);
  const settings = settingsRes.rows[0] ?? {};
  const enabledLocales: string[] = settings.enabled_locales
    ? settings.enabled_locales.split(',').map((s: string) => s.trim()).filter(Boolean)
    : ['en', 'ur', 'ar', 'fr', 'es', 'de', 'it', 'ru', 'vn', 'bd', 'in', 'id', 'jp', 'my', 'br', 'te', 'ta', 'th', 'tr', 'ph', 'pa'];

  return {
    settings,
    css: cssRes.rows[0] ?? {},
    site: siteRes.rows[0] ?? {},
    links: linksRes.rows as { platform: string; url: string; icon: string }[],
    enabledLocales,
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

  let content = contentRes.rows[0] ?? null;

  // English is the master/fallback language. For any non-English locale, overlay
  // the locale's filled-in fields on top of the English row so that missing or
  // empty translations fall back to English instead of rendering blank.
  if (locale !== 'en') {
    const { rows } = await db.query('SELECT * FROM homepage_english WHERE id=1');
    const en = rows[0] ?? {};
    if (!content) {
      content = en;
    } else {
      const merged: Record<string, unknown> = { ...en };
      for (const [key, value] of Object.entries(content)) {
        if (value !== null && value !== undefined && value !== '') merged[key] = value;
      }
      content = merged;
    }
  }

  content = content ?? {};

  // Parse JSON button arrays
  const parseBtns = (raw: string | null) => {
    try { return JSON.parse(raw || '[]'); } catch { return []; }
  };
  content.banner_buttons_parsed   = parseBtns(content.banner_buttons);
  content.download_buttons_parsed = parseBtns(content.download_buttons);

  return {
    content,
    faqs:        faqsRes.rows        as { question: string; answer: string }[],
    features:    featuresRes.rows    as { icon: string; title: string; description: string }[],
    screenshots: screenshotsRes.rows as { image: string; heading: string; description: string; bg_color: string }[],
  };
});
