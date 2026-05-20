import { NextRequest } from "next/server";
import { submitAnswer } from "@/lib/gameLogic";
import { jsonError, jsonOk } from "@/lib/api";

export async function POST(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const body = (await request.json()) as { playerId?: string; answer?: unknown };
    const result = await submitAnswer(code, String(body.playerId ?? ""), body.answer);
    return jsonOk(result);
  } catch (error) {
    return jsonError(error);
  }
}
