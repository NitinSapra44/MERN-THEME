'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push('/admin');
    } else {
      setError('Invalid username or password. Please try again.');
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 20px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: 18, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 28, color: '#fff', fontWeight: 800,
          }}>A</div>
          <h1 style={{ color: '#f1f5f9', fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>Admin Panel</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Sign in to manage your site</p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '32px 28px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
        }}>
          {error && (
            <div style={{
              background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8,
              padding: '10px 14px', marginBottom: 20, color: '#dc2626', fontSize: 13,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                style={{
                  width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0',
                  borderRadius: 8, fontSize: 14, color: '#0f172a', outline: 'none',
                  boxSizing: 'border-box', background: '#f8fafc',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0',
                  borderRadius: 8, fontSize: 14, color: '#0f172a', outline: 'none',
                  boxSizing: 'border-box', background: '#f8fafc',
                }}
                onFocus={(e) => { e.target.style.borderColor = '#6366f1'; e.target.style.background = '#fff'; }}
                onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.background = '#f8fafc'; }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '12px',
                background: loading ? '#a5b4fc' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: '#fff', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(99,102,241,0.35)',
              }}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 20, marginBottom: 0 }}>
            Default: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
