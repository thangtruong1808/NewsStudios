import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "ok" });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    return NextResponse.json({ status: "ok", received: body });
  } catch (error) {
    console.error("Error in dashboard API route:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
