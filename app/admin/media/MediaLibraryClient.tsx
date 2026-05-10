'use client';
import { useState, useRef } from 'react';

function fmt(bytes: number) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1024 / 1024).toFixed(1) + ' MB';
}

function fmtDate(dt: string) {
  return new Date(dt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function MediaLibraryClient({ initialFiles }: { initialFiles: any[] }) {
  const [files, setFiles] = useState(initialFiles);
  const [selected, setSelected] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState('');
  const [filter, setFilter] = useState('all');
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  function flash(t: string) { setMsg(t); setTimeout(() => setMsg(''), 2500); }

  async function reload() {
    const res = await fetch('/api/media');
    setFiles(await res.json());
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'general');
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        flash(`Upload failed: ${err.error || res.statusText}`);
        return;
      }
      await reload();
      flash('File uploaded!');
    } catch (err: any) {
      flash(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleDelete(f: any) {
    if (!confirm(`Delete "${f.original_name || f.filename}"? This cannot be undone.`)) return;
    await fetch(`/api/media/${encodeURIComponent(f.filename)}`, { method: 'DELETE' });
    setFiles((prev) => prev.filter((x) => x.id !== f.id));
    if (selected?.id === f.id) setSelected(null);
    flash('File deleted.');
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(''), 2000);
  }

  const types = ['all', 'blogs', 'logos', 'general'];
  const displayed = filter === 'all' ? files : files.filter((f) => f.upload_type === filter);

  return (
    <div style={{ maxWidth: 1100 }}>
      {msg && <div style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399', padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>✓ {msg}</div>}

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {types.map((t) => (
            <button key={t} onClick={() => setFilter(t)} style={{ padding: '7px 14px', borderRadius: 7, fontSize: 12, cursor: 'pointer', border: 'none', background: filter === t ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.05)', color: filter === t ? '#818cf8' : '#64748b', fontWeight: filter === t ? 600 : 400, textTransform: 'capitalize' }}>
              {t} {t === 'all' ? `(${files.length})` : `(${files.filter(f => f.upload_type === t).length})`}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <input ref={fileRef} type="file" accept="image/*,video/*,application/*" onChange={handleUpload} style={{ display: 'none' }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{ padding: '9px 20px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 9, fontSize: 13, fontWeight: 600, cursor: uploading ? 'not-allowed' : 'pointer' }}>
            {uploading ? 'Uploading…' : '+ Upload File'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 300px' : '1fr', gap: 20 }}>
        {/* Grid */}
        <div>
          {displayed.length === 0 ? (
            <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '60px 20px', textAlign: 'center', color: '#475569' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🖼️</div>
              No files yet. Upload one above.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
              {displayed.map((f) => {
                const isImage = f.file_type?.startsWith('image/');
                const isSelected = selected?.id === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelected(isSelected ? null : f)}
                    style={{
                      background: '#12121e',
                      border: `2px solid ${isSelected ? '#6366f1' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    <div style={{ height: 120, background: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {isImage ? (
                        <img src={f.url} alt={f.original_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: 36 }}>📄</span>
                      )}
                    </div>
                    <div style={{ padding: '8px 10px' }}>
                      <div style={{ fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.original_name || f.filename}</div>
                      <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{f.file_size ? fmt(f.file_size) : ''}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{ background: '#12121e', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '20px', position: 'sticky', top: 20, height: 'fit-content' }}>
            {selected.file_type?.startsWith('image/') && (
              <img src={selected.url} alt={selected.original_name} style={{ width: '100%', borderRadius: 8, marginBottom: 16, objectFit: 'contain', maxHeight: 200 }} />
            )}
            <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', marginBottom: 12, wordBreak: 'break-all' }}>{selected.original_name || selected.filename}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {[
                { lbl: 'Type', val: selected.file_type || 'unknown' },
                { lbl: 'Size', val: selected.file_size ? fmt(selected.file_size) : '—' },
                { lbl: 'Uploaded', val: fmtDate(selected.created_at) },
                { lbl: 'Folder', val: selected.upload_type },
              ].map((r) => (
                <div key={r.lbl} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                  <span style={{ color: '#64748b' }}>{r.lbl}</span>
                  <span style={{ color: '#94a3b8' }}>{r.val}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6 }}>URL</div>
              <div style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '8px 10px', fontSize: 11, color: '#818cf8', fontFamily: 'monospace', wordBreak: 'break-all', marginBottom: 6 }}>{selected.url}</div>
              <button onClick={() => copyUrl(selected.url)} style={{ width: '100%', padding: '8px', background: copied === selected.url ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.1)', color: copied === selected.url ? '#34d399' : '#818cf8', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 6, fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                {copied === selected.url ? '✓ Copied!' : 'Copy URL'}
              </button>
            </div>
            <button onClick={() => handleDelete(selected)} style={{ width: '100%', padding: '8px', background: 'rgba(239,68,68,0.08)', color: '#f87171', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 6, fontSize: 12, cursor: 'pointer' }}>
              Delete File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
