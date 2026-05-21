import { kickPlayer } from "@/lib/gameLogic";
import { jsonError, jsonOk, requireTeacherResponse } from "@/lib/api";

export async function POST(_request: Request, { params }: { params: Promise<{ code: string; playerId: string }> }) {
  const unauthorized = await requireTeacherResponse();
  if (unauthorized) return unauthorized;

  try {
    const { code, playerId } = await params;
    const state = await kickPlayer(code, playerId);
    return jsonOk({ state });
  } catch (error) {
    return jsonError(error);
  }
}
