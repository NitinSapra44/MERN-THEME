import db from '@/lib/db';
import ContentEditorPage from '@/components/admin/ContentEditorPage';

export default async function AdminContactPage() {
  const { rows } = await db.query('SELECT contact_title, contact_description FROM homepage_english WHERE id=1');
  const { rows: rows2 } = await db.query('SELECT email FROM contactus WHERE id=1');
  return (
    <ContentEditorPage
      title="Edit Contact Us"
      fields={[
        { name: 'contact_title', label: 'Page Title', type: 'text', value: rows[0]?.contact_title ?? '' },
        { name: 'contact_email', label: 'Contact Email', type: 'text', value: rows2[0]?.email ?? '' },
        { name: 'contact_description', label: 'Content', type: 'rich', value: rows[0]?.contact_description ?? '' },
      ]}
      saveAction={async (data) => {
        'use server';
        const db2 = (await import('@/lib/db')).default;
        await Promise.all([
          db2.query('UPDATE homepage_english SET contact_title=$1, contact_description=$2 WHERE id=1', [data.contact_title, data.contact_description]),
          db2.query('UPDATE contactus SET email=$1 WHERE id=1', [data.contact_email]),
        ]);
      }}
    />
  );
}
