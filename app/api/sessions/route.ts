import { NextRequest } from "next/server";
import { createSession } from "@/lib/gameLogic";
import { jsonError, jsonOk, requireTeacherResponse } from "@/lib/api";

export async function POST(request: NextRequest) {
  const unauthorized = await requireTeacherResponse();
  if (unauthorized) return unauthorized;

  try {
    const body = (await request.json().catch(() => ({}))) as { totalRounds?: number };
    const session = await createSession(Number(body.totalRounds ?? 10));
    return jsonOk({ session });
  } catch (error) {
    return jsonError(error);
  }
}
