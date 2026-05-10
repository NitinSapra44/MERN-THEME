import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  const { rows } = await db.query('SELECT * FROM homepage_settings LIMIT 1');
  return NextResponse.json(rows[0] ?? {});
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const { website_name, banner_type, page_settings, languages, logo,
          google_analytics, google_adsense, google_search_console,
          header_bg_color, footer_bg_color, text_color } = body;

  await Promise.all([
    db.query(
      'UPDATE homepage_settings SET website_name=$1, banner_type=$2, page_settings=$3, languages=$4, logo=$5 WHERE id=1',
      [website_name, banner_type, JSON.stringify(page_settings ?? {}), languages ?? 'en', logo ?? '']
    ),
    db.query(
      `UPDATE site_settings SET
        google_analytics=$1, google_adsense=$2, google_search_console=$3,
        header_bg_color=$4, footer_bg_color=$5, text_color=$6
       WHERE id=1`,
      [google_analytics ?? '', google_adsense ?? '', google_search_console ?? '',
       header_bg_color ?? '#ffffff', footer_bg_color ?? '#ffffff', text_color ?? '#000000']
    ),
  ]);

  return NextResponse.json({ success: true });
}
