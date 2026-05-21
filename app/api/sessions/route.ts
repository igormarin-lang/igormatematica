import { NextRequest } from "next/server";
import { createSession, getStateBySessionId } from "@/lib/gameLogic";
import { jsonError, jsonOk, requireTeacherResponse } from "@/lib/api";

export async function POST(request: NextRequest) {
  const unauthorized = await requireTeacherResponse();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json().catch(() => ({}))) as { totalRounds?: number };
    const session = await createSession(Number(body.totalRounds ?? 10));
    const state = await getStateBySessionId(session.id);
    return jsonOk({ session, state });
  } catch (error) {
    return jsonError(error);
  }
}
