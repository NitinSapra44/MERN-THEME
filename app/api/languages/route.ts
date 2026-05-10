import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { localeTableMap } from '@/lib/localeTableMap';

function safeTable(locale: string): string | null {
  return localeTableMap[locale] ?? null;
}

export async function GET(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') ?? 'en';
  const table = safeTable(locale);
  if (!table) return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });

  const { rows } = await db.query(`SELECT * FROM ${table} WHERE id=1`);
  return NextResponse.json(rows[0] ?? {});
}

export async function PUT(request: NextRequest) {
  const locale = request.nextUrl.searchParams.get('locale') ?? 'en';
  const table = safeTable(locale);
  if (!table) return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });

  const body = await request.json();

  // Whitelist of allowed columns to prevent SQL injection
  const allowed = [
    'banner_title', 'banner_subtitle', 'banner_button_text', 'banner_button_url', 'banner_image',
    'security_info', 'security_icon1', 'security_icon1_name', 'security_icon2', 'security_icon2_name',
    'security_icon3', 'security_icon3_name', 'intro_title', 'intro_description',
    'feature_title', 'faqs_title', 'post_limit', 'post_button_text', 'post_button_bg_color', 'post_button_text_color',
    'home_info_title', 'home_info_description',
    'meta_title', 'meta_description', 'meta_keyword',
    'download_slug', 'home_slug', 'download_page_title', 'download_page_description',
    'download_button_name', 'download_button_url', 'download_page_content',
    'old_version_title', 'old_version_buttons',
    'download_meta_title', 'download_meta_description', 'download_meta_keyword',
    'about_title', 'about_description', 'about_meta_title', 'about_meta_description',
    'contact_title', 'contact_description', 'contact_meta_title', 'contact_meta_description',
    'privacy_title', 'privacy_content', 'dmca_title', 'dmca_content',
  ];

  const keys = Object.keys(body).filter((k) => allowed.includes(k));
  if (keys.length === 0) return NextResponse.json({ success: true });

  const setClauses = keys.map((k, i) => `${k}=$${i + 1}`).join(', ');
  const values = keys.map((k) => body[k]);

  // Upsert: ensure row 1 exists
  await db.query(`INSERT INTO ${table} (id) VALUES (1) ON CONFLICT (id) DO NOTHING`);
  await db.query(`UPDATE ${table} SET ${setClauses} WHERE id=1`, values);

  return NextResponse.json({ success: true });
}
