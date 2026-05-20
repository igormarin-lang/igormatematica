import { NextRequest } from "next/server";
import { getStateBySessionId, joinSession } from "@/lib/gameLogic";
import { jsonError, jsonOk } from "@/lib/api";

export async function POST(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const body = (await request.json()) as { name?: string };
    const player = await joinSession(code, String(body.name ?? ""));
    const state = await getStateBySessionId(player.session_id);
    return jsonOk({ player, state });
  } catch (error) {
    return jsonError(error);
  }
}
