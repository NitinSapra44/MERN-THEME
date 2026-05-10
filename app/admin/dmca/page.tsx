import db from '@/lib/db';
import ContentEditorPage from '@/components/admin/ContentEditorPage';

export default async function AdminDmcaPage() {
  const { rows } = await db.query('SELECT dmca_title, dmca_content FROM homepage_english WHERE id=1');
  return (
    <ContentEditorPage
      title="Edit DMCA"
      fields={[
        { name: 'dmca_title', label: 'Page Title', type: 'text', value: rows[0]?.dmca_title ?? '' },
        { name: 'dmca_content', label: 'Content', type: 'rich', value: rows[0]?.dmca_content ?? '' },
      ]}
      saveAction={async (data) => {
        'use server';
        const db2 = (await import('@/lib/db')).default;
        await db2.query(
          'UPDATE homepage_english SET dmca_title=$1, dmca_content=$2 WHERE id=1',
          [data.dmca_title, data.dmca_content]
        );
      }}
    />
  );
}
