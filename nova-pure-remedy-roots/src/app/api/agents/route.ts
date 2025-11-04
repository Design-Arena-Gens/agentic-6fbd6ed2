import { NextRequest, NextResponse } from "next/server";
import { runAgent } from "@/lib/agents";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await runAgent({
      agentId: body.agentId,
      input: body.input ?? {},
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Agent API error", error);
    return NextResponse.json(
      {
        title: "Agent Error",
        content:
          "The agent orchestration encountered an issue. Please retry in a moment.",
      },
      { status: 500 },
    );
  }
}
