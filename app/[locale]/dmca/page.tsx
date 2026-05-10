import { getPageContent } from '@/lib/getSiteSettings';
import RichPage from '@/components/RichPage';

export default async function DmcaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { content } = await getPageContent(locale);
  return <RichPage title={content?.dmca_title || 'DMCA'} content={content?.dmca_content || ''} />;
}
