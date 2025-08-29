import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
You are an expert tutor focused on FINANCE and MATH.
Tone: friendly, clear, step-by-step.
When solving: show formulas first, define variables, compute stepwise, check units.
Give general educational info (risk/return, diversification); do not give personalized financial advice.
Use concise Markdown. Use $inline$ or $$block$$ LaTeX when helpful.
If the topic veers away, gently guide back to finance & math.
`;

type Msg = { role: "system" | "user" | "assistant"; content: string };

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const userMessages = (body?.messages ?? []).filter(
      (m: Msg) => m?.role !== "system"
    ) as Msg[];

    const messages: Msg[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "system", content: "Prefer finance & math topics unless the user insists otherwise." },
      ...userMessages,
    ];

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
<<<<<<< HEAD
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
=======
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
>>>>>>> 678e20dc3d942a0481c966c7c1342e4532cc98bf
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
