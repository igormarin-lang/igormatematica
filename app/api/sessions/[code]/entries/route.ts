import { NextRequest } from "next/server";
import { setEntriesLocked } from "@/lib/gameLogic";
import { jsonError, jsonOk, requireTeacherResponse } from "@/lib/api";

export async function POST(request: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const unauthorized = await requireTeacherResponse();
  if (unauthorized) return unauthorized;

  try {
    const { code } = await params;
    const body = (await request.json().catch(() => ({}))) as { locked?: boolean };
    const state = await setEntriesLocked(code, Boolean(body.locked));
    return jsonOk({ state });
  } catch (error) {
    return jsonError(error);
  }
}
