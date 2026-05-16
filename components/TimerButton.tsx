'use client';
import { useState, useEffect } from 'react';

interface Props {
  href: string;
  text: string;
  timerSeconds?: number;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

export default function TimerButton({ href, text, timerSeconds = 0, style, className, children }: Props) {
  const [countdown, setCountdown] = useState<number | null>(null);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (!timerSeconds || timerSeconds <= 0) return;
    e.preventDefault();
    setCountdown(timerSeconds);
  }

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      window.location.href = href;
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, href]);

  const label = countdown !== null && countdown > 0
    ? `${text} (${countdown}s)`
    : text;

  return (
    <a href={href} onClick={handleClick} style={style} className={className}>
      {children ?? label}
      {countdown !== null && countdown > 0 && (
        <span style={{
          marginLeft: 10, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 28, height: 28, borderRadius: '50%',
          border: '2px solid currentColor', fontSize: 12, fontWeight: 700,
          opacity: 0.85,
        }}>
          {countdown}
        </span>
      )}
    </a>
  );
}
