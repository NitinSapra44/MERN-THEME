'use client';

import { useTransition } from 'react';

export default function DeleteBlogButton({ id, deleteAction }: {
  id: number;
  deleteAction: (id: number) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm('Delete this blog post? This cannot be undone.')) return;
    startTransition(() => deleteAction(id));
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      style={{
        padding: '6px 14px',
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.2)',
        color: pending ? '#475569' : '#f87171',
        borderRadius: 7, fontSize: 13, fontWeight: 500,
        cursor: pending ? 'not-allowed' : 'pointer',
      }}
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
