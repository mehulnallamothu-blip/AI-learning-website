import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
You are an expert FINANCE & MATH tutor.

FORMAT RULES (very important):
- Always respond in **Markdown**.
- Start with a short **heading** (one line).
- Use **bulleted lists** for key ideas.
- Use **numbered steps** for calculations and procedures.
- When helpful, add short sub-bullets for details.
- Show formulas in LaTeX: inline $...$ or display $$...$$.
- Do NOT reply as one big paragraph; break lines for readability.
- Keep a friendly, clear, step-by-step tone.
- Educational content only (not personalized financial advice).
`;

type Msg = { role: "system" | "user" | "assistant"; content: string };

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const userMessages = (body?.messages ?? []).filter((m: Msg) => m?.role !== "system") as Msg[];

    const messages: Msg[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: "Default to bullets and numbered steps; avoid long paragraphs." },
      ...userMessages,
    ];

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        temperature: 0.4,
        messages,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: text || resp.statusText }, { status: 500 });
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
