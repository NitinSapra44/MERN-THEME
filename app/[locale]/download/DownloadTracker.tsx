'use client';

interface Props {
  version: { id: number; download_url: string; version_name: string };
  btnBg: string; btnText: string;
  btnPt: number; btnPb: number; btnPl: number; btnPr: number; btnFs: number;
  buttonName: string;
  small?: boolean;
}

export default function DownloadTracker({ version, btnBg, btnText, btnPt, btnPb, btnPl, btnPr, btnFs, buttonName, small }: Props) {
  async function handleClick() {
    try {
      await fetch(`/api/apk-versions/${version.id}/track`, { method: 'POST' });
    } catch {}
  }

  return (
    <a
      href={version.download_url}
      onClick={handleClick}
      style={{
        display: 'inline-block',
        background: btnBg, color: btnText,
        padding: small ? `${btnPt}px ${btnPr}px ${btnPb}px ${btnPl}px` : `${btnPt}px ${btnPr}px ${btnPb}px ${btnPl}px`,
        fontSize: btnFs, fontWeight: 700, borderRadius: 8,
        textDecoration: 'none', boxShadow: small ? 'none' : '0 4px 16px rgba(0,0,0,0.3)',
      }}
    >
      {buttonName}
    </a>
  );
}
