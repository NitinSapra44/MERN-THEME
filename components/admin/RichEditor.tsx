'use client';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { CharacterCount } from '@tiptap/extension-character-count';
import { useEffect, useState, useRef } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  minHeight?: number;
}

/* ─── tiny helpers ─── */
function Divider() {
  return <div style={{ width: 1, height: 20, background: '#e2e8f0', margin: '0 3px', alignSelf: 'center', flexShrink: 0 }} />;
}

function Btn({
  active = false, title, onClick, children, danger = false,
}: {
  active?: boolean; title: string; onClick: () => void;
  children: React.ReactNode; danger?: boolean;
}) {
  const [h, setH] = useState(false);
  return (
    <button
      type="button" title={title}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      onClick={onClick}
      style={{
        minWidth: 28, height: 28, padding: '0 5px',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 5, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
        flexShrink: 0,
        background: active ? '#eef2ff' : h ? '#f1f5f9' : 'transparent',
        color: active ? '#6366f1' : danger ? '#dc2626' : '#475569',
        transition: 'all 0.1s',
      }}
    >{children}</button>
  );
}

/* toolbar group label */
function GroupLabel({ label }: { label: string }) {
  return (
    <span style={{
      fontSize: 9, fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.07em',
      textTransform: 'uppercase', alignSelf: 'center', padding: '0 2px', userSelect: 'none',
    }}>{label}</span>
  );
}

export default function RichEditor({ value, onChange, minHeight = 360 }: Props) {
  const [fullscreen, setFullscreen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ horizontalRule: false, codeBlock: false }),
      Underline,
      TextStyle,
      Color,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image.configure({ inline: false, allowBase64: true }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      HorizontalRule,
      CharacterCount,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /* close color picker on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!editor) return null;

  const wordCount  = editor.storage.characterCount?.words() ?? editor.getText().trim().split(/\s+/).filter(Boolean).length;
  const charCount  = editor.storage.characterCount?.characters() ?? editor.getText().length;

  /* insert inline image */
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !editor) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', 'blogs');
    const res  = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    editor.chain().focus().setImage({ src: data.url ?? `/uploads/blogs/${data.filename}` }).run();
    e.target.value = '';
  }

  function addLink() {
    if (!editor) return;
    const prev = editor.getAttributes('link').href ?? '';
    const url  = prompt('Enter URL', prev);
    if (url === null) return;
    if (url === '') { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  }

  function insertTable() {
    if (!editor) return;
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  const PRESET_COLORS = [
    '#000000','#374151','#6b7280','#ef4444','#f97316',
    '#f59e0b','#10b981','#3b82f6','#6366f1','#8b5cf6',
    '#ec4899','#ffffff',
  ];

  /* ── wrapper style (fullscreen vs normal) ── */
  const wrapStyle: React.CSSProperties = fullscreen
    ? {
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#fff', display: 'flex', flexDirection: 'column',
      }
    : {
        border: '1.5px solid #e2e8f0', borderRadius: 10, overflow: 'hidden',
        background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      };

  return (
    <div style={wrapStyle}>

      {/* ════ TOOLBAR ════ */}
      <div style={{
        background: '#fafafa', borderBottom: '1px solid #e2e8f0',
        padding: '5px 8px', display: 'flex', alignItems: 'center',
        flexWrap: 'wrap', gap: 1, rowGap: 4,
        flexShrink: 0,
      }}>

        {/* Format */}
        <GroupLabel label="Format" />
        <Btn active={editor.isActive('bold')}      title="Bold (Ctrl+B)"         onClick={() => editor.chain().focus().toggleBold().run()}>      <b>B</b>      </Btn>
        <Btn active={editor.isActive('italic')}    title="Italic (Ctrl+I)"       onClick={() => editor.chain().focus().toggleItalic().run()}>    <i style={{ fontStyle: 'italic' }}>I</i>  </Btn>
        <Btn active={editor.isActive('underline')} title="Underline (Ctrl+U)"    onClick={() => editor.chain().focus().toggleUnderline().run()}> <u>U</u>      </Btn>
        <Btn active={editor.isActive('strike')}    title="Strikethrough"         onClick={() => editor.chain().focus().toggleStrike().run()}>    <span style={{ textDecoration: 'line-through' }}>S</span></Btn>
        <Btn active={editor.isActive('code')}      title="Inline Code"           onClick={() => editor.chain().focus().toggleCode().run()}>      <code style={{ fontSize: 11 }}>`c`</code></Btn>

        <Divider />

        {/* Text color */}
        <GroupLabel label="Color" />
        <div ref={colorRef} style={{ position: 'relative' }}>
          <Btn active={showColorPicker} title="Text Color" onClick={() => setShowColorPicker(s => !s)}>
            <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 800, lineHeight: 1 }}>A</span>
              <span style={{ width: 16, height: 3, borderRadius: 2, background: editor.getAttributes('textStyle').color ?? '#000' }} />
            </span>
          </Btn>
          {showColorPicker && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, zIndex: 100, marginTop: 4,
              background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8,
              padding: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              display: 'grid', gridTemplateColumns: 'repeat(6, 22px)', gap: 5,
            }}>
              {PRESET_COLORS.map(c => (
                <button key={c} type="button" title={c}
                  onClick={() => { editor.chain().focus().setColor(c).run(); setShowColorPicker(false); }}
                  style={{
                    width: 22, height: 22, borderRadius: 4, border: c === '#ffffff' ? '1px solid #e2e8f0' : 'none',
                    background: c, cursor: 'pointer',
                    outline: editor.getAttributes('textStyle').color === c ? '2px solid #6366f1' : 'none',
                    outlineOffset: 1,
                  }} />
              ))}
              <button type="button" title="Remove color"
                onClick={() => { editor.chain().focus().unsetColor().run(); setShowColorPicker(false); }}
                style={{ width: 22, height: 22, borderRadius: 4, border: '1px dashed #e2e8f0', background: 'transparent', cursor: 'pointer', fontSize: 10 }}>✕</button>
            </div>
          )}
        </div>

        <Divider />

        {/* Headings */}
        <GroupLabel label="Headings" />
        <Btn active={editor.isActive('heading', { level: 1 })} title="Heading 1" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</Btn>
        <Btn active={editor.isActive('heading', { level: 2 })} title="Heading 2" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Btn>
        <Btn active={editor.isActive('heading', { level: 3 })} title="Heading 3" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Btn>

        <Divider />

        {/* Lists & blocks */}
        <GroupLabel label="Lists" />
        <Btn active={editor.isActive('bulletList')}  title="Bullet List"  onClick={() => editor.chain().focus().toggleBulletList().run()}>  ≡• </Btn>
        <Btn active={editor.isActive('orderedList')} title="Ordered List" onClick={() => editor.chain().focus().toggleOrderedList().run()}> 1≡ </Btn>
        <Btn active={editor.isActive('blockquote')}  title="Blockquote"   onClick={() => editor.chain().focus().toggleBlockquote().run()}>  ❝  </Btn>
        <Btn active={editor.isActive('codeBlock')}   title="Code Block"   onClick={() => editor.chain().focus().toggleCodeBlock().run()}>   <code style={{ fontSize: 10 }}>{ }</code> </Btn>

        <Divider />

        {/* Alignment */}
        <GroupLabel label="Align" />
        <Btn active={editor.isActive({ textAlign: 'left' })}    title="Left"    onClick={() => editor.chain().focus().setTextAlign('left').run()}>    ⬛⬜ </Btn>
        <Btn active={editor.isActive({ textAlign: 'center' })}  title="Center"  onClick={() => editor.chain().focus().setTextAlign('center').run()}>  ⬛⬛ </Btn>
        <Btn active={editor.isActive({ textAlign: 'right' })}   title="Right"   onClick={() => editor.chain().focus().setTextAlign('right').run()}>   ⬜⬛ </Btn>
        <Btn active={editor.isActive({ textAlign: 'justify' })} title="Justify" onClick={() => editor.chain().focus().setTextAlign('justify').run()}> ≡≡≡ </Btn>

        <Divider />

        {/* Insert */}
        <GroupLabel label="Insert" />
        <Btn active={editor.isActive('link')} title="Insert / Edit Link"   onClick={addLink}>                                          🔗 </Btn>
        <Btn active={false}                   title="Remove Link"          onClick={() => editor.chain().focus().unsetLink().run()}>    ✂️ </Btn>
        <Btn active={false}                   title="Insert Image"         onClick={() => imageInputRef.current?.click()}>             🖼️ </Btn>
        <Btn active={false}                   title="Insert Table (3×3)"   onClick={insertTable}>                                      ⊞  </Btn>
        <Btn active={false}                   title="Horizontal Rule"      onClick={() => editor.chain().focus().setHorizontalRule().run()}>  — </Btn>

        {/* Table controls (only when cursor is in table) */}
        {editor.isActive('table') && (
          <>
            <Divider />
            <GroupLabel label="Table" />
            <Btn active={false} title="Add row below"    onClick={() => editor.chain().focus().addRowAfter().run()}>    +row </Btn>
            <Btn active={false} title="Add col right"    onClick={() => editor.chain().focus().addColumnAfter().run()}>+col </Btn>
            <Btn active={false} title="Delete row"       onClick={() => editor.chain().focus().deleteRow().run()}       danger>−row </Btn>
            <Btn active={false} title="Delete col"       onClick={() => editor.chain().focus().deleteColumn().run()}    danger>−col </Btn>
            <Btn active={false} title="Delete table"     onClick={() => editor.chain().focus().deleteTable().run()}     danger>✕tbl </Btn>
          </>
        )}

        {/* History — pushed to right */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 1, alignItems: 'center' }}>
          <Btn active={false} title="Undo (Ctrl+Z)" onClick={() => editor.chain().focus().undo().run()}>↩</Btn>
          <Btn active={false} title="Redo (Ctrl+Y)" onClick={() => editor.chain().focus().redo().run()}>↪</Btn>
          <Divider />
          <Btn active={fullscreen} title={fullscreen ? 'Exit fullscreen' : 'Fullscreen editor'} onClick={() => setFullscreen(f => !f)}>
            {fullscreen ? '⊡' : '⛶'}
          </Btn>
        </div>
      </div>

      {/* hidden image file input */}
      <input ref={imageInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />

      {/* ════ EDITOR CONTENT ════ */}
      <div style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        <EditorContent
          editor={editor}
          style={{
            minHeight: fullscreen ? undefined : minHeight,
            height: fullscreen ? '100%' : undefined,
            padding: '18px 24px',
            outline: 'none',
            fontSize: 15,
            lineHeight: 1.75,
            color: '#1e293b',
          }}
        />
      </div>

      {/* ════ FOOTER ════ */}
      <div style={{
        borderTop: '1px solid #f1f5f9', padding: '5px 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: 11, color: '#94a3b8', background: '#fafafa', flexShrink: 0,
      }}>
        <span>
          {wordCount} word{wordCount !== 1 ? 's' : ''} · {charCount} character{charCount !== 1 ? 's' : ''}
        </span>
        {fullscreen && (
          <button type="button" onClick={() => setFullscreen(false)} style={{
            padding: '3px 10px', background: '#f1f5f9', border: '1px solid #e2e8f0',
            borderRadius: 5, cursor: 'pointer', fontSize: 11, color: '#475569', fontWeight: 500,
          }}>
            ⊡ Exit Fullscreen
          </button>
        )}
      </div>

      {/* ════ STYLES ════ */}
      <style>{`
        .tiptap { outline: none; }
        .tiptap h1 { font-size: 30px; font-weight: 800; margin: 20px 0 10px; color: #0f172a; }
        .tiptap h2 { font-size: 24px; font-weight: 700; margin: 18px 0 8px;  color: #0f172a; }
        .tiptap h3 { font-size: 19px; font-weight: 700; margin: 14px 0 6px;  color: #0f172a; }
        .tiptap p  { margin: 0 0 12px; }
        .tiptap ul, .tiptap ol { padding-left: 24px; margin: 8px 0 12px; }
        .tiptap li { margin-bottom: 5px; }
        .tiptap blockquote {
          border-left: 4px solid #6366f1; padding: 8px 16px;
          margin: 14px 0; color: #475569; font-style: italic;
          background: #f8f7ff; border-radius: 0 6px 6px 0;
        }
        .tiptap code {
          background: #f1f5f9; padding: 2px 6px; border-radius: 4px;
          font-family: 'Fira Code', monospace; font-size: 13px; color: #e11d48;
        }
        .tiptap pre {
          background: #1e293b; padding: 16px 20px; border-radius: 8px;
          margin: 14px 0; overflow-x: auto;
        }
        .tiptap pre code {
          background: none; color: #e2e8f0; font-size: 13px; padding: 0;
        }
        .tiptap a { color: #6366f1; text-decoration: underline; }
        .tiptap hr { border: none; border-top: 2px solid #e2e8f0; margin: 20px 0; }
        .tiptap img { max-width: 100%; height: auto; border-radius: 8px; margin: 10px 0; }
        .tiptap strong { font-weight: 700; }
        /* Table */
        .tiptap table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .tiptap td, .tiptap th {
          border: 1px solid #e2e8f0; padding: 8px 12px;
          text-align: left; vertical-align: top; position: relative;
        }
        .tiptap th { background: #f8fafc; font-weight: 700; }
        .tiptap .selectedCell:after {
          content: ''; position: absolute; inset: 0;
          background: rgba(99,102,241,0.1); pointer-events: none;
        }
        .tiptap .column-resize-handle {
          position: absolute; right: -2px; top: 0; bottom: 0;
          width: 4px; background: #6366f1; cursor: col-resize;
        }
        .tiptap p.is-editor-empty:first-child::before {
          content: 'Start writing your blog post here…';
          color: #cbd5e1; pointer-events: none; float: left; height: 0;
        }
      `}</style>
    </div>
  );
}
