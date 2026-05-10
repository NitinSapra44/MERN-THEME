'use client';
import { useState } from 'react';

interface AdminUser {
  id: number;
  username: string;
  role: string;
  created_at: string;
  last_login: string | null;
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '9px 12px', background: '#0a0a14',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
  color: '#f1f5f9', fontSize: 13, boxSizing: 'border-box',
};
const btnStyle = (color: string): React.CSSProperties => ({
  padding: '8px 16px', borderRadius: 8, border: 'none',
  background: color, color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 600,
});

export default function UsersClient({ initialUsers }: { initialUsers: AdminUser[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [form, setForm] = useState({ username: '', password: '', role: 'editor' });
  const [editId, setEditId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ role: '', password: '' });
  const [msg, setMsg] = useState('');

  const refresh = () => fetch('/api/admin-users').then(r => r.json()).then(setUsers);
  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  async function addUser() {
    if (!form.username || !form.password) return;
    const res = await fetch('/api/admin-users', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) { flash('User created.'); setForm({ username: '', password: '', role: 'editor' }); refresh(); }
    else { const d = await res.json(); flash(d.error || 'Error creating user.'); }
  }

  async function saveEdit(id: number) {
    await fetch(`/api/admin-users/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    setEditId(null); flash('Updated.'); refresh();
  }

  async function deleteUser(id: number) {
    if (!confirm('Delete this admin user?')) return;
    const res = await fetch(`/api/admin-users/${id}`, { method: 'DELETE' });
    if (res.ok) { flash('Deleted.'); refresh(); }
    else { const d = await res.json(); flash(d.error || 'Cannot delete.'); }
  }

  return (
    <div style={{ padding: 32, maxWidth: 860, margin: '0 auto' }}>
      <h2 style={{ margin: '0 0 24px', color: '#f1f5f9', fontSize: 20, fontWeight: 700 }}>Admin Users</h2>

      {msg && (
        <div style={{ padding: '10px 16px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#a5b4fc', fontSize: 13, marginBottom: 20 }}>
          {msg}
        </div>
      )}

      {/* Add user form */}
      <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ margin: '0 0 16px', color: '#f1f5f9', fontSize: 15, fontWeight: 600 }}>Add New Admin</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 160px', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Username</label>
            <input style={inputStyle} value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="e.g. editor1" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Password</label>
            <input style={inputStyle} type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Minimum 6 chars" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Role</label>
            <select style={inputStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
              <option value="editor">Editor</option>
              <option value="moderator">Moderator</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
        </div>
        <button onClick={addUser} style={{ ...btnStyle('#6366f1'), marginTop: 14 }}>Create User</button>
      </div>

      {/* Users table */}
      <div style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['Username', 'Role', 'Last Login', 'Actions'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, color: '#475569', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                <td style={{ padding: '12px 16px', fontSize: 14, color: '#f1f5f9', fontWeight: 600 }}>{u.username}</td>
                <td style={{ padding: '12px 16px' }}>
                  {editId === u.id ? (
                    <select style={{ ...inputStyle, width: 'auto' }} value={editData.role} onChange={e => setEditData({ ...editData, role: e.target.value })}>
                      <option value="editor">Editor</option>
                      <option value="moderator">Moderator</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  ) : (
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: u.role === 'superadmin' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.12)',
                      color: u.role === 'superadmin' ? '#a5b4fc' : '#34d399',
                    }}>{u.role}</span>
                  )}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>
                  {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {editId === u.id ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        style={{ ...inputStyle, width: 160 }} type="password" placeholder="New password (optional)"
                        value={editData.password} onChange={e => setEditData({ ...editData, password: e.target.value })}
                      />
                      <button onClick={() => saveEdit(u.id)} style={btnStyle('#10b981')}>Save</button>
                      <button onClick={() => setEditId(null)} style={{ ...btnStyle('transparent'), color: '#64748b', border: '1px solid rgba(255,255,255,0.1)' }}>Cancel</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => { setEditId(u.id); setEditData({ role: u.role, password: '' }); }} style={{ ...btnStyle('rgba(99,102,241,0.15)'), color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.3)' }}>Edit</button>
                      <button onClick={() => deleteUser(u.id)} style={{ ...btnStyle('rgba(239,68,68,0.12)'), color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
