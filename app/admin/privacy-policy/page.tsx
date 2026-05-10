import db from '@/lib/db';
import ContentEditorPage from '@/components/admin/ContentEditorPage';

export default async function AdminPrivacyPage() {
  const { rows } = await db.query('SELECT privacy_title, privacy_content FROM homepage_english WHERE id=1');
  return (
    <ContentEditorPage
      title="Edit Privacy Policy"
      fields={[
        { name: 'privacy_title', label: 'Page Title', type: 'text', value: rows[0]?.privacy_title ?? '' },
        { name: 'privacy_content', label: 'Content', type: 'rich', value: rows[0]?.privacy_content ?? '' },
      ]}
      saveAction={async (data) => {
        'use server';
        const db2 = (await import('@/lib/db')).default;
        await db2.query(
          'UPDATE homepage_english SET privacy_title=$1, privacy_content=$2 WHERE id=1',
          [data.privacy_title, data.privacy_content]
        );
      }}
    />
  );
}
