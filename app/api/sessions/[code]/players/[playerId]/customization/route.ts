import { NextRequest } from "next/server";
import { updatePlayerCustomization } from "@/lib/gameLogic";
import { jsonError, jsonOk } from "@/lib/api";

export async function POST(request: NextRequest, { params }: { params: Promise<{ code: string; playerId: string }> }) {
  try {
    const { code, playerId } = await params;
    const body = (await request.json()) as {
      carColor?: string;
      carModel?: string;
      carSticker?: string;
      celebrationEmoji?: string;
      studentTheme?: string;
    };
    const state = await updatePlayerCustomization(code, playerId, body);
    return jsonOk({ state });
  } catch (error) {
    return jsonError(error);
  }
}
