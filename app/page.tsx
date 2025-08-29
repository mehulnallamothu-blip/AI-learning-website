'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import './globals.css';

export default function Page() {
  return <AiLearningSite />;
}

function AiLearningSite() {
  const [activeTab, setActiveTab] = useState("learn");
  const [theme, setTheme] = useState(() => (typeof window !== "undefined" && localStorage.getItem("theme")) || "light");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    if (typeof window !== "undefined") localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">
      <TopBar theme={theme} setTheme={setTheme} />
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="mt-6">
          {activeTab === "learn" && <LearnHome />}
          {activeTab === "playground" && <Playground />}
          {activeTab === "quizzes" && <Quizzes />}
          {activeTab === "datasets" && <Datasets />}
          {activeTab === "about" && <About />}
        </div>
      </div>
      <Footer />
    </div>
  );
}

function TopBar({ theme, setTheme }: { theme: string, setTheme: (t: string)=>void }) {
  return (
    <header className="border-b border-[hsl(var(--border))] bg-white/70 backdrop-blur dark:bg-neutral-900/70 sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="text-xl font-semibold tracking-tight">AI Learning</h1>
          <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900 dark:text-emerald-100">
            Starter
          </span>
        </div>
        <div className="flex items-center gap-2">
          <a className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800" href="#getting-started">
            Getting Started
          </a>
          <button
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-50 dark:hover:bg-neutral-800"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </button>
        </div>
      </div>
    </header>
  );
}

function Tabs({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: (id:string)=>void }) {
  const tabs = [
    { id: "learn", label: "Learn" },
    { id: "playground", label: "Playground" },
    { id: "quizzes", label: "Quizzes" },
    { id: "datasets", label: "Datasets" },
    { id: "about", label: "About" },
  ];
  return (
    <nav className="flex flex-wrap gap-2" role="tablist" aria-label="Primary">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => setActiveTab(t.id)}
          role="tab"
          aria-selected={activeTab === t.id}
          className={`rounded-xl border px-4 py-2 text-sm transition ${
            activeTab === t.id
              ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-100"
              : "border-gray-200 hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-800"
          }`}
        >{t.label}</button>
      ))}
    </nav>
  );
}

function LearnHome() {
  const modules = [
    { title: "Intro to ML", desc: "Supervised vs Unsupervised, loss, over/underfitting.", slug: "intro-ml" },
    { title: "Feature Engineering", desc: "Cleaning, encoding, scaling, PCA, leakage.", slug: "feature-eng" },
    { title: "Modeling", desc: "LogReg, SVM, RF, XGBoost, KMeans.", slug: "modeling" },
    { title: "Explainability", desc: "SHAP, importance, PD plots, calibration.", slug: "explainability" },
  ];
  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {modules.map(m => (
        <article key={m.slug} className="rounded-2xl border bg-white p-4 shadow-sm transition hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
          <h3 className="text-lg font-semibold">{m.title}</h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-neutral-300">{m.desc}</p>
          <button
            className="mt-3 rounded-xl border border-emerald-600 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 dark:text-emerald-200 dark:border-emerald-700 dark:hover:bg-emerald-900/30"
            onClick={() => alert("Wire this to your lesson content or Markdown renderer.")}
          >Open Module</button>
        </article>
      ))}
      <article className="rounded-2xl border border-dashed p-4 text-center dark:border-neutral-700">
        <p className="text-sm opacity-80">Add more modules by editing the <code>modules</code> array.</p>
      </article>
    </section>
  );
}

function Playground() {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <ChatDemo />
        <TextGenerationDemo />
      </div>
      <div className="space-y-6">
        <ImageClassificationDemo />
        <IntegrationHelpCard />
      </div>
    </section>
  );
}

function ChatDemo() {
  const [messages, setMessages] = useState<{role:"system"|"user"|"assistant", content:string}[]>([
  { role: "system", content: "You're chatting with a Finance & Math Tutor. Ask about compound interest, NPV/IRR, CAPM, options basics, probability, calculus, etc." },
]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  async function onSend() {
    if (!input.trim()) return;
    const user = { role: "user" as const, content: input.trim() };
    setMessages(m => [...m, user]);
    setInput("");
    setLoading(true);
    try {
      const reply = await callBackendChat([...messages, user]);
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    } catch (e: any) {
      setMessages(m => [...m, { role: "assistant", content: `⚠️ Chat backend not connected: ${e?.message || e}` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="text-lg font-semibold">Chat (connect your model)</h3>
      <div ref={scrollerRef} className="mt-3 h-64 overflow-y-auto rounded-xl border p-3 text-sm dark:border-neutral-800">
        {messages.map((m, i) => (
          <div key={i} className="mb-2">
            <span className="mr-2 font-medium capitalize opacity-70">{m.role}:</span>
            <span>{m.content}</span>
          </div>
        ))}
        {loading && <div className="animate-pulse text-gray-500">Model is thinking…</div>}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-800"
          placeholder="Ask anything…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSend()}
        />
        <button
          onClick={onSend}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          disabled={loading}
        >Send</button>
      </div>
      <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400">
        In <code>callBackendChat</code> replace the URL or pipe directly into your model.
      </p>
    </div>
  );
}

function TextGenerationDemo() {
  const [prompt, setPrompt] = useState("Explain bias-variance tradeoff in 3 bullet points.");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function run() {
    setLoading(true); setOutput("");
    try {
      const text = await callBackendText(prompt);
      setOutput(text);
    } catch (e: any) {
      setOutput(`⚠️ Text generation not connected: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="text-lg font-semibold">Text Generation</h3>
      <div className="mt-2 flex gap-2">
        <input
          className="flex-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-500 dark:border-neutral-700 dark:bg-neutral-800"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button onClick={run} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Generate</button>
      </div>
      <pre className="mt-3 rounded-xl bg-gray-50 p-3 text-xs dark:bg-neutral-800 whitespace-pre-wrap break-words min-h-[80px]">
        {loading ? "Running…" : output}
      </pre>
      <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400">Wire this to /api/generate or drop your JS model below in <code>callBackendText</code>.</p>
    </div>
  );
}

function ImageClassificationDemo() {
  const [file, setFile] = useState<File|null>(null);
  const [label, setLabel] = useState("");
  const [loading, setLoading] = useState(false);

  async function classify() {
    if (!file) return;
    setLoading(true); setLabel("");
    try {
      const result = await callBackendImage(file);
      setLabel(result);
    } catch (e: any) {
      setLabel(`⚠️ Image classification not connected: ${e?.message || e}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="text-lg font-semibold">Image Classification</h3>
      <input type="file" accept="image/*" onChange={(e)=>setFile(e.target.files?.[0]||null)} className="mt-2 text-sm" />
      {file && <img alt="preview" className="mt-3 max-h-40 rounded-lg border object-contain p-1 dark:border-neutral-800" src={URL.createObjectURL(file)} />}
      <div className="mt-3 flex gap-2">
        <button onClick={classify} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700" disabled={!file || loading}>
          {loading ? "Classifying…" : "Classify"}
        </button>
        <button onClick={()=>{setFile(null); setLabel("");}} className="rounded-xl border px-3 py-2 text-sm dark:border-neutral-700">Reset</button>
      </div>
      {!!label && <div className="mt-3 rounded-xl border bg-gray-50 p-3 text-sm dark:border-neutral-800 dark:bg-neutral-800">
        <strong>Result:</strong> {label}
      </div>}
      <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400">Connect to /api/classify or run in-browser model inside <code>callBackendImage</code>.</p>
    </div>
  );
}

function IntegrationHelpCard() {
  return (
    <div className="rounded-2xl border border-dashed bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h4 className="font-semibold">How to integrate your code</h4>
      <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
        <li id="getting-started">Paste URLs or logic into <code>callBackendChat</code>, <code>callBackendText</code>, <code>callBackendImage</code>.</li>
        <li>If your code is Python (FastAPI/Flask), expose endpoints like <code>/api/chat</code>, <code>/api/generate</code>, <code>/api/classify</code>.</li>
        <li>If your code is pure JS/TF.js, run directly in those functions and return a string/label.</li>
        <li>Share your code with me and say where you want it to live: server or in-browser.</li>
      </ol>
    </div>
  );
}

function Quizzes() {
  const sample = [
    { q: "Which statement best describes overfitting?", options: [
      "Model fits noise in training data and performs poorly on new data",
      "Model underutilizes features and always predicts the mean",
      "Model achieves perfect generalization",
      "Model has zero training loss and zero test loss",
    ], a: 0 },
    { q: "Which metric is appropriate for imbalanced classification?", options: ["Accuracy","Precision/Recall/AUC","MSE","R^2"], a: 1 },
  ] as const;

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number|null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const current = sample[idx];

  function next() {
    if (selected === null) return;
    if (selected === current.a) setScore(s => s + 1);
    if (idx + 1 < sample.length) { setIdx(i => i + 1); setSelected(null); }
    else { setDone(true); }
  }
  function reset() { setIdx(0); setSelected(null); setScore(0); setDone(false); }

  return (
    <div className="rounded-2xl border bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="text-lg font-semibold">Quick Quiz</h3>
      {!done ? (
        <div className="mt-2">
          <p className="text-sm font-medium">{current.q}</p>
          <div className="mt-2 grid gap-2">
            {current.options.map((opt, i) => (
              <button key={i} onClick={()=>setSelected(i)}
                className={`rounded-xl border px-3 py-2 text-sm text-left ${
                  selected === i ? "border-emerald-600 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/30"
                  : "border-gray-200 hover:bg-gray-50 dark:border-neutral-800 dark:hover:bg-neutral-800"}`}
              >{opt}</button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={next} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
              {idx + 1 < sample.length ? "Next" : "Finish"}
            </button>
            <button onClick={reset} className="rounded-xl border px-3 py-2 text-sm dark:border-neutral-700">Reset</button>
          </div>
          <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400">Add your own questions by editing <code>sample</code>.</p>
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-sm">Your score: <strong>{score}</strong> / {sample.length}</p>
          <button onClick={reset} className="mt-2 rounded-xl border px-3 py-2 text-sm dark:border-neutral-700">Try again</button>
        </div>
      )}
    </div>
  );
}

function Datasets() {
  const rows = [
    { name: "MNIST", size: "12MB", tasks: "Classification", href: "https://yann.lecun.com/exdb/mnist/" },
    { name: "IMDB Reviews", size: "80MB", tasks: "Sentiment", href: "https://ai.stanford.edu/~amaas/data/sentiment/" },
    { name: "UCI Wine", size: "7KB", tasks: "Classification", href: "https://archive.ics.uci.edu/ml/datasets/Wine" },
  ];
  return (
    <div className="rounded-2xl border bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="text-lg font-semibold">Datasets</h3>
      <div className="mt-2 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left">
            <tr className="border-b dark:border-neutral-800">
              <th className="py-2 pr-4">Name</th><th className="py-2 pr-4">Tasks</th><th className="py-2 pr-4">Size</th><th className="py-2 pr-4">Links</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.name} className="border-b last:border-none dark:border-neutral-800">
                <td className="py-2 pr-4 font-medium">{r.name}</td>
                <td className="py-2 pr-4">{r.tasks}</td>
                <td className="py-2 pr-4">{r.size}</td>
                <td className="py-2 pr-4"><a className="rounded-lg border px-2 py-1 hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800" href={r.href} target="_blank" rel="noreferrer">Open</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="rounded-2xl border bg-white p-4 leading-relaxed dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="text-lg font-semibold">About this starter</h3>
      <p className="mt-2 text-sm opacity-90">
        This single-file React app gives you a clean, modern UI scaffold for an AI learning site.
        Plug in your own models via REST endpoints or in-browser JavaScript. It includes a Chat playground,
        text generation, image classification stub, quizzes, and a place for learning modules.
      </p>
      <ul className="mt-3 list-disc pl-6 text-sm">
        <li>Responsive layout with soft shadows and rounded corners.</li>
        <li>Dark mode toggle (persists in localStorage).</li>
        <li>Commented hooks for integrating your code.</li>
      </ul>
      <p className="mt-3 text-sm">
        When you share your code, tell me: <em>what language, what libraries, and how you want users to interact with it</em>.
        I’ll help wire it up right away.
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-10 border-t border-[hsl(var(--border))] py-6 text-center text-xs text-gray-500 dark:text-neutral-400">
      Built with ❤️ for fast prototyping. Replace this footer with your branding.
    </footer>
  );
}
function Logo() {
  return <div className="grid h-8 w-8 place-content-center rounded-xl bg-emerald-600 text-white shadow"><span className="text-sm font-bold">AI</span></div>;
}

// Backend integration shims
async function callBackendChat(messages: { role: string; content: string }[]) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.reply ?? JSON.stringify(data);
}

async function callBackendText(prompt: string) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.text ?? JSON.stringify(data);
}

async function callBackendImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/classify", { method: "POST", body: form });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.label ?? JSON.stringify(data);
}

