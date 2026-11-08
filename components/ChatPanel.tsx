'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { ChatMessage, Tab } from '@/lib/chat';
import { Icon } from './Icon';

type Props = {
  tab: Tab;
  title?: string;
  placeholder: string;
  initial: ChatMessage[];
  /** Home: shown instead of the message list while the thread is empty. */
  hero?: ReactNode;
  /** Home: suggested prompt chip under the hero (frame 5013). Fills the composer. */
  suggestedPrompt?: string;
};

export function ChatPanel({ tab, title, placeholder, initial, hero, suggestedPrompt }: Props) {
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
      const res = await fetch('/api/chat', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ tab, message }) });
      if (!res.ok) throw new Error();
      const r: { user: ChatMessage; assistant: ChatMessage; drafts: Record<string, unknown> } = await res.json();
      setMessages((m) => [...m.filter((x) => x.id > 0 && x.id !== r.user.id), r.user, r.assistant]);
      if (Object.keys(r.drafts).length) router.refresh(); // pull new drafts into the setup form
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
  // Home composer per frame 5013: 844px, radius 24, context chip, Send pill, disclaimer below.
  const homeComposer = (
    <div className="home-composer">
      <form className="composer composer-lg" onSubmit={(e) => { e.preventDefault(); send(text); }}>
        <span className="context-chip"><Icon name="userCheck" size={14} /> All workspaces</span>
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
        <button className="send-pill" type="submit" disabled={sending || !text.trim()}>Send</button>
      </form>
      <p className="chat-disclaimer">AI can make mistakes. Review drafts and check sources before using them.</p>
    </div>
  );
  const prompt = suggestedPrompt && !text && (
    <button type="button" className="hero-prompt" onClick={() => setText(suggestedPrompt)}>{suggestedPrompt}</button>
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

  if (hero) {
    return (
      <div className="home-main">
        {messages.length === 0 && !sending
          ? <div className="home-hero">{hero}{prompt}{homeComposer}{error}</div>
          : <>{list}{error}{homeComposer}</>}
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
