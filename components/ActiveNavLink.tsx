'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function ActiveNavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isHome = href === '/' || /^\/[a-z]{2}$/.test(href);
  const active = isHome
    ? pathname === href || pathname === href.replace(/\/$/, '')
    : pathname.startsWith(href);

  return (
    <Link
      href={href}
      style={{
        position: 'relative',
        padding: '8px 15px',
        borderRadius: 8,
        textDecoration: 'none',
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        color: active ? '#ffffff' : 'rgba(255,255,255,0.55)',
        background: active ? 'rgba(99,102,241,0.15)' : 'transparent',
        transition: 'color 0.15s, background 0.15s',
        whiteSpace: 'nowrap',
        letterSpacing: '-0.01em',
      }}
    >
      {label}
      {active && (
        <span style={{
          position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)',
          width: 16, height: 2, borderRadius: 2,
          background: 'linear-gradient(90deg, #6366f1, #a78bfa)',
        }} />
      )}
    </Link>
  );
}
