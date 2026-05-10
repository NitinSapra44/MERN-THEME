import db from '@/lib/db';

export default async function AnnouncementBar() {
  try {
    const { rows } = await db.query(
      "SELECT content FROM site_widgets WHERE widget_key='announcement_bar' AND is_enabled=1 LIMIT 1"
    );
    const content = rows[0]?.content?.trim();
    if (!content) return null;

    return (
      <div style={{
        background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
        color: '#fff', textAlign: 'center',
        padding: '8px 16px', fontSize: 13, fontWeight: 500,
        lineHeight: 1.4,
      }}>
        {content}
      </div>
    );
  } catch {
    return null;
  }
}
