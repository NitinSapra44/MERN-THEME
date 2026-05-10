import { getPageContent } from '@/lib/getSiteSettings';
import RichPage from '@/components/RichPage';

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const { content } = await getPageContent(locale);
  return <RichPage title={content?.privacy_title || 'Privacy Policy'} content={content?.privacy_content || ''} />;
}
