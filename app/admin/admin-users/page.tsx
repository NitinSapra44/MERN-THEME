import db from '@/lib/db';
import UsersClient from './UsersClient';

export default async function AdminUsersPage() {
  const { rows } = await db.query(
    'SELECT id, username, role, created_at, last_login FROM admin_users ORDER BY id'
  );
  return <UsersClient initialUsers={rows} />;
}
