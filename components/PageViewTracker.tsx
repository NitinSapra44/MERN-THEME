'use client';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function PageViewTracker() {
  const pathname = usePathname();
  const last = useRef('');

  useEffect(() => {
    if (pathname === last.current) return;
    last.current = pathname;
    fetch('/api/analytics/pageview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: pathname }),
    }).catch(() => {});
  }, [pathname]);

  return null;
}
