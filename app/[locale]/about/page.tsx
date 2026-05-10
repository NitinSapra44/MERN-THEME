import { getPageContent } from '@/lib/getSiteSettings';
import RichPage from '@/components/RichPage';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { content } = await getPageContent(locale);
  return { title: content?.about_meta_title, description: content?.about_meta_description };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { content } = await getPageContent(locale);
  return <RichPage title={content?.about_title || 'About Us'} content={content?.about_description || ''} />;
}
