'use client';

import { useState, useRef, useEffect } from 'react';

const LOCALE_LABELS: Record<string, string> = {
  en: 'English', ur: 'Urdu', ar: 'Arabic', fr: 'French', es: 'Spanish',
  de: 'German', it: 'Italian', ru: 'Russian', vn: 'Vietnamese', bd: 'Bangladeshi',
  in: 'Hindi', id: 'Indonesian', jp: 'Japanese', my: 'Malay', br: 'Portuguese',
  te: 'Telugu', ta: 'Tamil', th: 'Thai', tr: 'Turkish', ph: 'Filipino', pa: 'Punjabi',
};

export default function LanguageSwitcher({ currentLocale, availableLocales }: {
  currentLocale: string;
  availableLocales: string[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function switchLocale(newLocale: string) {
    setOpen(false);
    const currentPath = window.location.pathname;

    // Strip any non-English locale prefix from the current URL
    let cleanPath = currentPath;
    for (const loc of availableLocales) {
      if (loc !== 'en' && (currentPath === `/${loc}` || currentPath.startsWith(`/${loc}/`))) {
        cleanPath = currentPath.slice(loc.length + 1) || '/';
        break;
      }
    }

    const newUrl = newLocale === 'en'
      ? cleanPath
      : `/${newLocale}${cleanPath === '/' ? '' : cleanPath}`;
    window.location.href = newUrl;
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', padding: '6px 14px', borderRadius: 6, cursor: 'pointer',
          fontSize: 14, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
        }}
      >
        {LOCALE_LABELS[currentLocale] ?? 'English'} <span style={{ fontSize: 10 }}>▾</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 4,
          background: '#1e1e1e', border: '1px solid #333', borderRadius: 8,
          minWidth: 160, zIndex: 1000, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          maxHeight: 320, overflowY: 'auto',
        }}>
          {availableLocales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '9px 16px', background: loc === currentLocale ? '#333' : 'transparent',
                border: 'none', color: '#fff', cursor: 'pointer', fontSize: 14,
                borderBottom: '1px solid #2a2a2a',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#2a2a2a')}
              onMouseLeave={(e) => (e.currentTarget.style.background = loc === currentLocale ? '#333' : 'transparent')}
            >
              {LOCALE_LABELS[loc] ?? loc}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
