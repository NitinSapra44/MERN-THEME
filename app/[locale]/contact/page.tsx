import { getPageContent, getSiteSettings } from '@/lib/getSiteSettings';
import db from '@/lib/db';
import ContactForm from './ContactForm';

export async function generateMetadata() {
  const { rows } = await db.query("SELECT * FROM page_seo WHERE page_key='contact' LIMIT 1");
  const seo = rows[0];
  return {
    title: seo?.meta_title || 'Contact Us',
    description: seo?.meta_description || 'Get in touch with our team.',
    robots: seo?.robots || 'index, follow',
    openGraph: seo?.og_title ? { title: seo.og_title, description: seo.og_description, images: seo.og_image ? [seo.og_image] : [] } : undefined,
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [{ content }, { css }] = await Promise.all([getPageContent(locale), getSiteSettings()]);
  const fontSize = css?.font_size ?? 16;
  const textColor = css?.text_color || '#333333';
  const h2GenSize = css?.h2_general_size ?? 22;
  const h3Size = css?.h3_size ?? 18;
  const h3Color = css?.h3_color || '#222';

  return (
    <div style={{ background: '#fff', minHeight: '60vh' }}>
      <section style={{ background: 'linear-gradient(135deg, #3d3d3d 0%, #1a1a1a 100%)', padding: '48px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 34, color: '#fff', margin: 0, fontWeight: 800 }}>{content?.contact_title || 'Contact Us'}</h1>
      </section>

      <section style={{ padding: '48px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
          {/* Left: content */}
          <div>
            {content?.contact_description && (
              <div className="rich-content" style={{ fontSize, color: textColor, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: content.contact_description }} />
            )}
          </div>

          {/* Right: contact form */}
          <ContactForm />
        </div>
      </section>

      <style>{`
        .rich-content h2 { background: linear-gradient(135deg, #3a3a3a 0%, #1a1a1a 100%); color: #fff !important; padding: 12px 20px; border-radius: 6px; font-size: ${h2GenSize}px; margin: 28px 0 16px; }
        .rich-content h3 { font-size: ${h3Size}px; color: ${h3Color}; margin: 20px 0 10px; }
        .rich-content ul, .rich-content ol { padding-left: 24px; margin: 12px 0; }
        .rich-content li { margin-bottom: 6px; line-height: 1.7; }
        .rich-content a { color: #4f46e5; }
      `}</style>
    </div>
  );
}
