import { NextResponse } from "next/server";

export async function POST() {
  // LLM integration wired in next step
  return NextResponse.json({ message: "Analysis endpoint ready" }, { status: 200 });
}
