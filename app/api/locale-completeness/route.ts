import { NextResponse } from 'next/server';
import db from '@/lib/db';

const TRACKED_FIELDS = [
  'banner_title', 'banner_subtitle', 'banner_button_text', 'intro_title', 'intro_description',
  'feature_title', 'home_info_title', 'home_info_description', 'meta_title', 'meta_description',
  'download_page_title', 'download_page_description', 'about_title', 'about_description',
  'contact_title', 'contact_description', 'privacy_title', 'privacy_content', 'dmca_title', 'dmca_content',
];

const LOCALE_TABLE_MAP: Record<string, string> = {
  en: 'homepage_english', ur: 'homepage_urdu', ar: 'homepage_arabic', fr: 'homepage_france',
  es: 'homepage_espanol', de: 'homepage_germany', it: 'homepage_italy', ru: 'homepage_russia',
  vn: 'homepage_vietnam', bd: 'homepage_bangladesh', in: 'homepage_india', id: 'homepage_indonesia',
  jp: 'homepage_japan', my: 'homepage_malaysia', br: 'homepage_portugues', te: 'homepage_telugu',
  ta: 'homepage_tamil', th: 'homepage_thailand', tr: 'homepage_turkey', ph: 'homepage_philippine',
  pa: 'homepage_punjabi',
};

const LOCALE_LABELS: Record<string, string> = {
  en: 'English', ur: 'Urdu', ar: 'Arabic', fr: 'French', es: 'Spanish', de: 'German',
  it: 'Italian', ru: 'Russian', vn: 'Vietnamese', bd: 'Bangladeshi', in: 'Hindi',
  id: 'Indonesian', jp: 'Japanese', my: 'Malay', br: 'Portuguese', te: 'Telugu',
  ta: 'Tamil', th: 'Thai', tr: 'Turkish', ph: 'Filipino', pa: 'Punjabi',
};

export async function GET() {
  const results: Array<{ locale: string; label: string; pct: number; filled: number; total: number; missing: string[] }> = [];

  for (const [locale, table] of Object.entries(LOCALE_TABLE_MAP)) {
    try {
      const { rows } = await db.query(`SELECT ${TRACKED_FIELDS.join(',')} FROM ${table} WHERE id=1 LIMIT 1`);
      const row = rows[0] ?? {};
      const filled = TRACKED_FIELDS.filter((f) => row[f] && String(row[f]).trim() !== '').length;
      const missing = TRACKED_FIELDS.filter((f) => !row[f] || String(row[f]).trim() === '');
      results.push({ locale, label: LOCALE_LABELS[locale] ?? locale, pct: Math.round((filled / TRACKED_FIELDS.length) * 100), filled, total: TRACKED_FIELDS.length, missing });
    } catch {
      results.push({ locale, label: LOCALE_LABELS[locale] ?? locale, pct: 0, filled: 0, total: TRACKED_FIELDS.length, missing: TRACKED_FIELDS });
    }
  }

  return NextResponse.json(results);
}
