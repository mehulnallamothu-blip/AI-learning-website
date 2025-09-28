'use client';

import React, { useEffect, useRef, useState } from 'react';
import './globals.css';

type Msg = { role: 'user' | 'assistant' | 'system'; content: string };

async function callBackendChat(messages: { role: string; content: string }[]) {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.reply ?? JSON.stringify(data);
}

export default function Page() {
  return <PlaygroundMinimal />;
}

function PlaygroundMinimal() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  async function onSend() {
    const text = input.trim();
    if (!text || loading) return;
    const user = { role: 'user' as const, content: text };
    setMessages((m) => [...m, user]);
    setInput('');
    setLoading(true);
    try {
      const reply = await callBackendChat([...messages, user]);
      setMessages((m) => [...m, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      setMessages((m) => [...m, { role: 'assistant', content: `Error: ${e?.message || e}` }]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  }

  return (
    <main className="min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mx-auto max-w-3xl p-6">
        <header className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">AI Tutor — Finance & Math</h1>
          <a href="/solve-image" className="rounded-lg border px-3 py-2 text-sm">Solve from Image</a>
        </header>

        <div
          ref={scrollerRef}
          className="h-[60vh] w-full overflow-y-auto rounded-lg border p-4 bg-neutral-50 dark:bg-neutral-900"
        >
          {messages.length === 0 && (
            <div className="text-sm opacity-70">
              Ask anything about finance & math. Examples:
              <ul className="list-disc pl-6 mt-2">
                <li>Explain compound interest; compute $1,000 at 7% for 5 years.</li>
                <li>NPV of cash flows [ -1000, 400, 400, 400 ] at 8%?</li>
              </ul>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`mb-3`}>
              <div className="text-xs opacity-60 mb-1">{m.role}</div>
              <div className={`whitespace-pre-wrap rounded-lg border px-3 py-2 ${m.role === 'assistant' ? 'bg-white dark:bg-neutral-800' : ''}`}>
                {m.content}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your question… (Enter to send, Shift+Enter for new line)"
            className="min-h-[60px] flex-1 rounded-lg border bg-transparent p-3"
          />
          <button
            onClick={onSend}
            disabled={loading}
            className="rounded-lg border px-4 py-2"
          >
            {loading ? 'Sending…' : 'Send'}
          </button>
        </div>
      </div>
    </main>
  );
}
