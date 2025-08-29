import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(()=>({}));
  const messages = body?.messages || [];
  // Simple echo-style demo
  const last = messages[messages.length - 1]?.content || "Hello!";
  return NextResponse.json({ reply: `You said: ${last}` });
}
