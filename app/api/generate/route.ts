import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(()=>({}));
  const prompt = body?.prompt || "";
  const text = `• Here is a generated response for: "${prompt}"
• Replace this with your model call in /app/api/generate/route.ts
• Deployed on Next.js API Routes.`;
  return NextResponse.json({ text });
}
