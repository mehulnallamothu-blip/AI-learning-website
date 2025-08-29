import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const SYSTEM_PROMPT = `
You are an expert tutor focused on FINANCE and MATH.
Tone: friendly, clear, step-by-step.
When solving: show formulas first, define variables, compute stepwise, check units.
Give general educational info (risk/return, diversification); do not give personalized financial advice.
Use concise Markdown. Use $inline$ or $$block$$ LaTeX when helpful.
If the topic veers away, gently guide back to finance & math.
`;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const messages = (body?.messages ?? []) as { role:"system"|"user"|"assistant"; content:string }[];

    const chat = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "system", content: "Prefer finance & math topics unless the user insists otherwise." },
        ...messages.filter(m => m.role !== "system"),
      ],
    });

    const reply = chat.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
