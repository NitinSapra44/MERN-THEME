import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest) {
  const homepageId = request.nextUrl.searchParams.get('homepage_id') ?? '1';
  const { rows } = await db.query(
    'SELECT * FROM homepage_faqs WHERE homepage_id=$1 ORDER BY id',
    [homepageId]
  );
  return NextResponse.json(rows);
}

export async function PUT(request: NextRequest) {
  const homepageId = parseInt(request.nextUrl.searchParams.get('homepage_id') ?? '1');
  const faqs: { question: string; answer: string }[] = await request.json();

  await db.query('DELETE FROM homepage_faqs WHERE homepage_id=$1', [homepageId]);
  for (const faq of faqs) {
    await db.query(
      'INSERT INTO homepage_faqs (homepage_id, question, answer) VALUES ($1, $2, $3)',
      [homepageId, faq.question, faq.answer]
    );
  }
  return NextResponse.json({ success: true });
}
