'use client';

import { useState } from 'react';
import { ContactForm } from './ContactForm';
import { Icon } from './Icon';

export function NewContactButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="btn btn-primary h-9" onClick={() => setOpen(true)} disabled={open}><Icon name="plus" />New Contact</button>
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-6" role="dialog" aria-modal="true" aria-labelledby="contact-form-title" onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}>
          <div className="max-h-full w-[640px] max-w-full overflow-auto rounded-xl shadow-xl"><ContactForm onDone={() => setOpen(false)} /></div>
        </div>
      )}
    </>
  );
}
