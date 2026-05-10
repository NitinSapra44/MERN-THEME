'use client';
import { useState, useEffect } from 'react';

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 300,
        width: 44, height: 44, borderRadius: '50%',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: '#fff', border: 'none', cursor: 'pointer',
        fontSize: 20, boxShadow: '0 4px 14px rgba(99,102,241,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      ↑
    </button>
  );
}
