"use client";
import { useState } from "react";

export default function SolveImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState("Please read the question and solve step-by-step, showing formulas and variables.");
  const [answer, setAnswer] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function onSolve() {
    if (!file) { alert("Choose an image first."); return; }
    setBusy(true);
    setAnswer("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("prompt", prompt);
      const res = await fetch("/api/classify", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setAnswer(data?.reply ?? "No reply");
    } catch (e: any) {
      setAnswer(`Error: ${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Solve from Image (Finance & Math)</h1>
      <div className="rounded-lg border p-4 space-y-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <input
          className="w-full rounded border px-3 py-2 bg-transparent"
          placeholder="Optional instruction to the tutor"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          onClick={onSolve}
          disabled={busy}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          {busy ? "Solving..." : "Solve from Image"}
        </button>
      </div>
      {answer && (
        <div className="rounded-lg border p-4 whitespace-pre-wrap">
          {answer}
        </div>
      )}
    </main>
  );
}
