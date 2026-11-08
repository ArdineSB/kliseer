'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { ChatMessage, Tab } from '@/lib/chat';
import { HomeHero } from './HomeHero';
import { Icon } from './Icon';

type Props = {
  tab: Tab;
  threadId: string;
  title?: string;
  placeholder: string;
  initial: ChatMessage[];
  /** Home (frame 5013): hero while empty, large composer, no side-panel chrome. */
  home?: boolean;
};

export function ChatPanel({ tab, threadId, title, placeholder, initial, home }: Props) {
  const router = useRouter();
  const [messages, setMessages] = useState(initial);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Keep the newest message in view unless the user followed a "From chat" link (#msg-N).
    if (!location.hash.startsWith('#msg-')) listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length, sending]);

  async function send(message: string, retry = false) {
    if (!message.trim() || sending) return;
    setSending(true);
    setFailed(null);
    if (!retry) {
      setMessages((m) => [...m, { id: -Date.now(), tab, role: 'user', content: message, created_at: '' }]);
      setText('');
    }
    try {
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ tab, threadId, message }) });
      if (!res.ok) throw new Error();
      const r: { user: ChatMessage; assistant: ChatMessage; drafts: Record<string, unknown> } = await res.json();
      setMessages((m) => [...m.filter((x) => x.id > 0 && x.id !== r.user.id), r.user, r.assistant]);
      router.refresh(); // refresh thread titles, Home history, and setup drafts
    } catch {
      setFailed(message); // the user message stays in the thread (stored server-side before the LLM call)
    } finally {
      setSending(false);
    }
  }

  const composer = (
    <form className="composer" onSubmit={(e) => { e.preventDefault(); send(text); }}>
      <label htmlFor={`chat-${tab}`} className="sr-only">{placeholder}</label>
      <textarea
        id={`chat-${tab}`}
        value={text}
        placeholder={placeholder}
        maxLength={4000}
        rows={1}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(text); } }}
      />
      <button className="send" type="submit" disabled={sending || !text.trim()} aria-label="Send"><Icon name="arrowUp" /></button>
    </form>
  );
  // Home composer per frame 5013: 844px, radius 24, sparkle + input, context chip, Send pill, disclaimer.
  const homeComposer = (
    <div className="mx-auto mb-4 w-[844px] max-w-[calc(100%-32px)]">
      <form className="flex flex-col gap-3 rounded-3xl border border-input bg-canvas px-5 pt-4 pb-3 focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-[var(--focus-ring)]" onSubmit={(e) => { e.preventDefault(); send(text); }}>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 text-secondary"><Icon name="sparkle" size={18} /></span>
          <label htmlFor={`chat-${tab}`} className="sr-only">{placeholder}</label>
          <textarea
            id={`chat-${tab}`}
            className="min-h-6 flex-1 resize-none border-0 bg-transparent p-0 text-[15px] outline-none placeholder:text-secondary"
            value={text}
            placeholder={placeholder}
            maxLength={4000}
            rows={1}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(text); } }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 rounded-full bg-subtle px-3 py-1.5 text-xs text-secondary"><Icon name="message" size={14} />All workspaces</span>
          <button className="flex h-9 cursor-pointer items-center gap-1.5 rounded-full border-0 bg-brand px-4 font-medium text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-brand-disabled disabled:text-brand-disabled-ink" type="submit" disabled={sending || !text.trim()}>
            <Icon name="arrowUp" />Send
          </button>
        </div>
      </form>
      <p className="mt-3 mb-0 text-center text-xs text-muted">AI can make mistakes. Review drafts and check sources before using them.</p>
    </div>
  );
  const error = failed && (
    <div className="chat-error" role="alert">
      Klise is unavailable right now. Your message is saved.
      <button type="button" className="link" onClick={() => send(failed, true)}>Retry</button>
    </div>
  );
  const list = (
    <div className="messages" ref={listRef} aria-live="polite">
      {messages.map((m) => (
        <div key={m.id} id={m.id > 0 ? `msg-${m.id}` : undefined} className={`msg msg-${m.role}`}>
          <span className="sr-only">{m.role === 'user' ? 'You: ' : 'Klise: '}</span>{m.content}
        </div>
      ))}
      {sending && <div className="typing">Klise is typing…</div>}
    </div>
  );

  if (home) {
    return (
      <div className="home-main">
        {messages.length === 0 && !sending
          ? <div className="min-h-0 flex-1 overflow-auto"><HomeHero onPrompt={setText} /></div>
          : list}
        {error}
        {homeComposer}
      </div>
    );
  }
  return (
    <aside className="panel chat" aria-label={title}>
      <div className="chat-head">{title}</div>
      {list}
      {error}
      {composer}
    </aside>
  );
}
