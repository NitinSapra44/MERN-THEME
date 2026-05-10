'use client';
import { useState } from 'react';
import RichEditor from './RichEditor';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'rich' | 'textarea';
  value: string;
}

interface Props {
  title: string;
  fields: Field[];
  saveAction: (data: Record<string, string>) => Promise<void>;
}

export default function ContentEditorPage({ fields, saveAction }: Props) {
  const [data, setData] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.name, f.value]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await saveAction(data);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '11px 14px',
    background: '#1a1a2e',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 9, color: '#e2e8f0',
    fontSize: 14, boxSizing: 'border-box',
    outline: 'none',
  };

  return (
    <div style={{ maxWidth: 900 }}>
      {saved && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'rgba(16,185,129,0.12)',
          border: '1px solid rgba(16,185,129,0.25)',
          color: '#34d399', padding: '12px 18px', borderRadius: 10, marginBottom: 20,
          fontSize: 14, fontWeight: 500,
        }}>
          ✓ Changes saved successfully!
        </div>
      )}
      <form onSubmit={handleSave}>
        <div style={{
          background: '#12121e',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14, padding: '28px 28px',
        }}>
          {fields.map((field, i) => (
            <div key={field.name} style={{ marginBottom: i < fields.length - 1 ? 24 : 0 }}>
              <label style={{
                display: 'block', fontWeight: 600, marginBottom: 8,
                fontSize: 13, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {field.label}
              </label>
              {field.type === 'text' && (
                <input
                  value={data[field.name]}
                  onChange={(e) => setData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                  style={inputStyle}
                />
              )}
              {field.type === 'textarea' && (
                <textarea
                  value={data[field.name]}
                  onChange={(e) => setData((prev) => ({ ...prev, [field.name]: e.target.value }))}
                  rows={6}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              )}
              {field.type === 'rich' && (
                <RichEditor
                  value={data[field.name]}
                  onChange={(val) => setData((prev) => ({ ...prev, [field.name]: val }))}
                />
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 28px',
              background: saving ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff', border: 'none',
              borderRadius: 9, fontSize: 14, fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: saving ? 'none' : '0 4px 15px rgba(99,102,241,0.35)',
            }}
          >
            {saving ? (
              <>
                <span style={{ width: 14, height: 14, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                Saving…
              </>
            ) : '💾  Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
