import { NextResponse } from "next/server";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `
You are a helpful FINANCE & MATH tutor. When given an image of a problem:
- Carefully read the problem statement from the image.
- Restate the problem briefly.
- Solve step-by-step with correct formulas and variables.
- Show intermediate steps and a final answer.
- Use Markdown and LaTeX where helpful.
- If the image is unclear, ask for a clearer picture or missing values.
- Do NOT provide personalized financial advice.
`;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const userPrompt = (form.get("prompt") as string | null)?.trim()
      || "Please read the question in the image and solve it step-by-step.";

    if (!file) {
      return NextResponse.json({ error: "No file uploaded (field name must be 'file')." }, { status: 400 });
    }

    // Convert uploaded image to a data URL for OpenAI vision
    const bytes = Buffer.from(await file.arrayBuffer());
    const base64 = bytes.toString("base64");
    const dataUrl = `data:${file.type || "image/png"};base64,${base64}`;

    const model = process.env.OPENAI_VISION_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini";

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: text || resp.statusText }, { status: 500 });
    }

    const data = await resp.json();
    const reply = data?.choices?.[0]?.message?.content ?? "Sorry, I couldn't read that image.";
    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("Vision route error:", err);
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}
