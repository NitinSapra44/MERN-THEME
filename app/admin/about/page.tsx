import db from '@/lib/db';
import ContentEditorPage from '@/components/admin/ContentEditorPage';

export default async function AdminAboutPage() {
  const { rows } = await db.query('SELECT about_title, about_description FROM homepage_english WHERE id=1');
  return (
    <ContentEditorPage
      title="Edit About Us"
      fields={[
        { name: 'about_title', label: 'Page Title', type: 'text', value: rows[0]?.about_title ?? '' },
        { name: 'about_description', label: 'Content', type: 'rich', value: rows[0]?.about_description ?? '' },
      ]}
      saveAction={async (data) => {
        'use server';
        const db2 = (await import('@/lib/db')).default;
        await db2.query(
          'UPDATE homepage_english SET about_title=$1, about_description=$2 WHERE id=1',
          [data.about_title, data.about_description]
        );
      }}
    />
  );
}
