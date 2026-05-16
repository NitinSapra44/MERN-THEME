'use client';
import { useState, useEffect } from 'react';

interface Props {
  version: { id: number; download_url: string; version_name: string };
  btnBg: string; btnText: string;
  btnPt: number; btnPb: number; btnPl: number; btnPr: number; btnFs: number;
  buttonName: string;
  small?: boolean;
  timerSeconds?: number;
}

export default function DownloadTracker({ version, btnBg, btnText, btnPt, btnPb, btnPl, btnPr, btnFs, buttonName, small, timerSeconds = 0 }: Props) {
  const [countdown, setCountdown] = useState<number | null>(null);

  async function track() {
    try { await fetch(`/api/apk-versions/${version.id}/track`, { method: 'POST' }); } catch {}
  }

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!timerSeconds || timerSeconds <= 0) { track(); return; }
    e.preventDefault();
    track();
    setCountdown(timerSeconds);
  }

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) { window.location.href = version.download_url; return; }
    const t = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, version.download_url]);

  const label = countdown !== null && countdown > 0 ? `${buttonName} (${countdown}s)` : buttonName;

  return (
    <a
      href={version.download_url}
      onClick={handleClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: btnBg, color: btnText,
        padding: `${btnPt}px ${btnPr}px ${btnPb}px ${btnPl}px`,
        fontSize: btnFs, fontWeight: 700, borderRadius: 8,
        textDecoration: 'none', boxShadow: small ? 'none' : '0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      {label}
      {countdown !== null && countdown > 0 && (
        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', border: '2px solid currentColor', fontSize: 11, fontWeight: 700 }}>
          {countdown}
        </span>
      )}
    </a>
  );
}
