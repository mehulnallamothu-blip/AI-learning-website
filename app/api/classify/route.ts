import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge'; // fast start, fine for demo

export async function POST(req: NextRequest) {
  // This demo doesn't read the file; it returns a placeholder.
  // Wire up your model here by reading the formData.
  const label = "placeholder-label"; 
  return NextResponse.json({ label });
}
