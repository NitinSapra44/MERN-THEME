'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import RichEditor from '@/components/admin/RichEditor';

interface BlogData {
  title: string;
  slug: string;
  short_description: string;
  content: string;
  image: string;
  meta_title: string;
  meta_description: string;
  is_published: number;
  published_at: string;
  scheduled_at: string;
  category_id: string;
  tags: string;
}

const empty: BlogData = {
  title: '', slug: '', short_description: '',
  content: '', image: '', meta_title: '', meta_description: '',
  is_published: 1, published_at: '', scheduled_at: '', category_id: '', tags: '',
};

const inp: React.CSSProperties = {
  width: '100%', padding: '10px 14px', border: '1.5px solid #e2e8f0',
  borderRadius: 8, fontSize: 14, color: '#0f172a', background: '#fff',
  boxSizing: 'border-box', outline: 'none', transition: 'border-color 0.15s',
  fontFamily: 'inherit',
};
const lbl: React.CSSProperties = {
  display: 'block', fontSize: 12, fontWeight: 700, color: '#64748b',
  marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em',
};
const card: React.CSSProperties = {
  background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0',
  boxShadow: '0 1px 4px rgba(0,0,0,0.04)', overflow: 'hidden',
};
const cardHead: React.CSSProperties = {
  padding: '14px 20px', borderBottom: '1px solid #f1f5f9',
  fontSize: 12, fontWeight: 700, color: '#64748b',
  textTransform: 'uppercase', letterSpacing: '0.07em',
  background: '#fafafa',
};
const cardBody: React.CSSProperties = { padding: '20px' };

function FocusInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const [focus, setFocus] = useState(false);
  return (
    <input
      {...props}
      style={{ ...inp, ...(props.style ?? {}), borderColor: focus ? '#6366f1' : '#e2e8f0' }}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    />
  );
}

function FocusTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [focus, setFocus] = useState(false);
  return (
    <textarea
      {...props}
      style={{ ...inp, resize: 'vertical', ...(props.style ?? {}), borderColor: focus ? '#6366f1' : '#e2e8f0' }}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
    />
  );
}

export default function BlogForm({ blogId }: { blogId?: number }) {
  const router = useRouter();
  const isEdit = blogId !== undefined;

  const [form, setForm] = useState<BlogData>(empty);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [dragOver, setDragOver] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [tagInput, setTagInput] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    fetch(`/api/blogs/${blogId}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          title: data.title ?? '',
          slug: data.slug ?? '',
          short_description: data.short_description ?? '',
          content: data.content ?? '',
          image: data.image ?? '',
          meta_title: data.meta_title ?? '',
          meta_description: data.meta_description ?? '',
          is_published: data.is_published ?? 1,
          published_at: data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : '',
          scheduled_at: data.scheduled_at ? new Date(data.scheduled_at).toISOString().slice(0, 16) : '',
          category_id: data.category_id ? String(data.category_id) : '',
          tags: data.tags ?? '',
        });
        if (data.image) {
          setImagePreview(data.image.startsWith('/') ? data.image : `/uploads/blogs/${data.image}`);
        }
        setLoading(false);
      });
  }, [blogId, isEdit]);

  function handleTitleChange(val: string) {
    setForm((f) => ({
      ...f,
      title: val,
      slug: isEdit ? f.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      meta_title: isEdit ? f.meta_title : (f.meta_title === '' ? val : f.meta_title),
    }));
  }

  function set(key: keyof BlogData, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function applyFile(file: File) {
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) applyFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) applyFile(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    let image = form.image;
    if (imageFile) {
      const fd = new FormData();
      fd.append('file', imageFile);
      fd.append('type', 'blogs');
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
      const uploadData = await uploadRes.json();
      image = uploadData.url ?? uploadData.filename;
    }

    const payload = { ...form, image, category_id: form.category_id ? Number(form.category_id) : null };

    if (isEdit) {
      await fetch(`/api/blogs/${blogId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } else {
      const res = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setSaving(false);
      router.push(`/admin/blogs/${data.id}`);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
          <div style={{ fontSize: 15 }}>Loading post…</div>
        </div>
      </div>
    );
  }

  const metaLen = form.meta_description.length;
  const metaColor = metaLen > 160 ? '#ef4444' : metaLen > 130 ? '#f59e0b' : '#10b981';

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 1200 }}>

      {/* ── Top action bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 24, padding: '12px 20px',
        background: '#fff', borderRadius: 12, border: '1px solid #e2e8f0',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: isEdit ? 'linear-gradient(135deg, #f59e0b, #ef4444)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>
            {isEdit ? '✏️' : '✨'}
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a' }}>
              {isEdit ? 'Edit Post' : 'New Blog Post'}
            </div>
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>
              {isEdit
                ? `Editing: ${form.title || 'Untitled'}`
                : 'Write and publish a new article'}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {isEdit && form.slug && (
            <a
              href={`/blogs/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '8px 16px', background: '#f1f5f9', color: '#475569',
                border: '1px solid #e2e8f0', borderRadius: 8, textDecoration: 'none',
                fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              ↗ Preview
            </a>
          )}
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '9px 24px', border: 'none', borderRadius: 8, fontWeight: 700,
              fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer', minWidth: 140,
              background: saved
                ? '#10b981'
                : saving
                ? '#a5b4fc'
                : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: '#fff',
              boxShadow: saved ? '0 2px 8px rgba(16,185,129,0.35)' : '0 2px 8px rgba(99,102,241,0.35)',
              transition: 'all 0.2s',
            }}
          >
            {saving ? '⏳ Saving…' : saved ? '✓ Saved!' : isEdit ? 'Save Changes' : '🚀 Publish'}
          </button>
        </div>
      </div>

      {/* ── Two column layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' }}>

        {/* LEFT: Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Title + slug */}
          <div style={card}>
            <div style={cardHead}>Post Details</div>
            <div style={cardBody}>
              <div style={{ marginBottom: 18 }}>
                <label style={lbl}>Title *</label>
                <FocusInput
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  placeholder="Enter a compelling blog post title…"
                  style={{ fontSize: 16, fontWeight: 600, padding: '12px 14px' }}
                />
              </div>

              <div style={{ marginBottom: 18 }}>
                <label style={lbl}>URL Slug *</label>
                <div style={{ position: 'relative' }}>
                  <span style={{
                    position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                    color: '#94a3b8', fontSize: 13, pointerEvents: 'none', userSelect: 'none',
                  }}>/blogs/</span>
                  <FocusInput
                    value={form.slug}
                    onChange={(e) => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    required
                    placeholder="my-blog-post"
                    style={{ paddingLeft: 60, fontFamily: 'monospace', fontSize: 13, color: '#6366f1' }}
                  />
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                  Auto-generated from title. Lowercase letters, numbers and hyphens only.
                </div>
              </div>

              <div>
                <label style={lbl}>Short Description</label>
                <FocusTextarea
                  value={form.short_description}
                  onChange={(e) => set('short_description', e.target.value)}
                  placeholder="A 1–2 sentence summary displayed in blog cards and listings…"
                  style={{ minHeight: 80 }}
                />
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                  {form.short_description.length} characters
                </div>
              </div>
            </div>
          </div>

          {/* Rich Content Editor */}
          <div style={card}>
            <div style={cardHead}>Full Content</div>
            <div style={{ padding: '16px' }}>
              <RichEditor
                value={form.content}
                onChange={(v) => set('content', v)}
                minHeight={420}
              />
            </div>
          </div>
        </div>

        {/* RIGHT: Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Featured Image */}
          <div style={card}>
            <div style={cardHead}>Featured Image</div>
            <div style={cardBody}>
              <div
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                  border: `2px dashed ${dragOver ? '#6366f1' : imagePreview ? 'transparent' : '#d1d5db'}`,
                  background: dragOver ? '#eef2ff' : '#f8fafc',
                  transition: 'all 0.15s',
                  marginBottom: 12,
                }}
              >
                {imagePreview ? (
                  <div style={{ position: 'relative' }}>
                    <img
                      src={imagePreview}
                      alt="Featured"
                      style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s',
                    }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.35)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}
                    >
                      <span style={{ color: '#fff', fontSize: 13, fontWeight: 600, opacity: 0 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
                      >Click to change</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '32px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#475569' }}>
                      {dragOver ? 'Drop image here' : 'Click or drag to upload'}
                    </div>
                    <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>
                      PNG, JPG, WEBP up to 5MB
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              {imagePreview && (
                <button
                  type="button"
                  onClick={() => { setImagePreview(''); setImageFile(null); set('image', ''); }}
                  style={{
                    width: '100%', padding: '7px', background: '#fef2f2', color: '#dc2626',
                    border: '1px solid #fecaca', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontWeight: 500,
                  }}
                >
                  Remove Image
                </button>
              )}
            </div>
          </div>

          {/* SEO */}
          <div style={card}>
            <div style={{ ...cardHead, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>SEO</span>
              <span style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 20,
                background: form.meta_title && form.meta_description ? '#d1fae5' : '#fef3c7',
                color: form.meta_title && form.meta_description ? '#065f46' : '#92400e',
                fontWeight: 700,
              }}>
                {form.meta_title && form.meta_description ? '✓ Ready' : '⚠ Incomplete'}
              </span>
            </div>
            <div style={cardBody}>
              {/* Google preview */}
              {(form.meta_title || form.title) && (
                <div style={{
                  background: '#f8fafc', borderRadius: 8, padding: '12px 14px',
                  marginBottom: 16, border: '1px solid #e2e8f0',
                }}>
                  <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4 }}>Google Preview</div>
                  <div style={{ fontSize: 14, color: '#1a0dab', fontWeight: 500, marginBottom: 2, lineHeight: 1.3 }}>
                    {form.meta_title || form.title || 'Page Title'}
                  </div>
                  <div style={{ fontSize: 12, color: '#006621', marginBottom: 4 }}>
                    yourdomain.com/blogs/{form.slug || 'post-slug'}
                  </div>
                  <div style={{ fontSize: 12, color: '#545454', lineHeight: 1.5 }}>
                    {(form.meta_description || form.short_description || 'Meta description will appear here…').slice(0, 155)}
                    {(form.meta_description || form.short_description || '').length > 155 ? '…' : ''}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={lbl}>Meta Title</label>
                <FocusInput
                  value={form.meta_title}
                  onChange={(e) => set('meta_title', e.target.value)}
                  placeholder="SEO title (50–60 chars ideal)"
                />
                <div style={{ fontSize: 11, marginTop: 4, color: form.meta_title.length > 60 ? '#ef4444' : '#94a3b8' }}>
                  {form.meta_title.length}/60
                </div>
              </div>

              <div>
                <label style={lbl}>Meta Description</label>
                <FocusTextarea
                  value={form.meta_description}
                  onChange={(e) => set('meta_description', e.target.value)}
                  placeholder="Brief description for search engines…"
                  style={{ minHeight: 90 }}
                />
                <div style={{ fontSize: 11, marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>150–160 chars ideal</span>
                  <span style={{ color: metaColor, fontWeight: 600 }}>{metaLen}/160</span>
                </div>
              </div>
            </div>
          </div>

          {/* Publishing */}
          <div style={card}>
            <div style={cardHead}>Publishing</div>
            <div style={cardBody}>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Status</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[{ v: 1, label: '🟢 Published' }, { v: 0, label: '🔴 Draft' }].map((opt) => (
                    <button key={opt.v} type="button" onClick={() => set('is_published', opt.v as any)} style={{ flex: 1, padding: '8px', border: `2px solid ${form.is_published === opt.v ? '#6366f1' : '#e2e8f0'}`, borderRadius: 7, background: form.is_published === opt.v ? '#eef2ff' : '#fff', color: form.is_published === opt.v ? '#4338ca' : '#64748b', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Publish Date</label>
                <FocusInput type="datetime-local" value={form.published_at} onChange={(e) => set('published_at', e.target.value)} style={{ fontSize: 12 }} />
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>Leave empty to publish immediately.</div>
              </div>
              <div>
                <label style={lbl}>Schedule (future)</label>
                <FocusInput type="datetime-local" value={form.scheduled_at} onChange={(e) => set('scheduled_at', e.target.value)} style={{ fontSize: 12 }} />
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>Post goes live at this time even if published status is on.</div>
              </div>
            </div>
          </div>

          {/* Category + Tags */}
          <div style={card}>
            <div style={cardHead}>Category & Tags</div>
            <div style={cardBody}>
              <div style={{ marginBottom: 14 }}>
                <label style={lbl}>Category</label>
                <select value={form.category_id} onChange={(e) => set('category_id', e.target.value)} style={{ ...inp, color: '#0f172a', background: '#fff', border: '1.5px solid #e2e8f0' }}>
                  <option value="">— No Category —</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Tags</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 6 }}>
                  {(form.tags || '').split(',').filter(Boolean).map((t) => t.trim()).filter(Boolean).map((tag) => (
                    <span key={tag} style={{ padding: '3px 10px', background: '#eef2ff', color: '#4338ca', borderRadius: 20, fontSize: 12, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                      {tag}
                      <button type="button" onClick={() => set('tags', form.tags.split(',').filter((x) => x.trim() !== tag).join(','))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#818cf8', fontSize: 14, lineHeight: 1, padding: 0 }}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <FocusInput value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
                        e.preventDefault();
                        const existing = form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];
                        if (!existing.includes(tagInput.trim())) set('tags', [...existing, tagInput.trim()].join(','));
                        setTagInput('');
                      }
                    }}
                    placeholder="Type tag + Enter" style={{ fontSize: 13 }} />
                </div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>Press Enter or comma to add a tag.</div>
              </div>
            </div>
          </div>

          {/* Status card */}
          <div style={{ ...card, background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' }}>
            <div style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Post Status
              </div>
              {[
                { label: 'Title',       ok: form.title.length > 0 },
                { label: 'Slug',        ok: form.slug.length > 0 },
                { label: 'Content',     ok: form.content.length > 50 },
                { label: 'Image',       ok: !!imagePreview },
                { label: 'Meta title',  ok: form.meta_title.length > 0 },
                { label: 'Meta desc',   ok: form.meta_description.length > 0 },
              ].map((item) => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#475569' }}>{item.label}</span>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%', fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: item.ok ? '#d1fae5' : '#f1f5f9',
                    color: item.ok ? '#065f46' : '#94a3b8',
                  }}>
                    {item.ok ? '✓' : '–'}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
