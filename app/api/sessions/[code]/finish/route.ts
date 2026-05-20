import { finishSession } from "@/lib/gameLogic";
import { jsonError, jsonOk, requireTeacherResponse } from "@/lib/api";

export async function POST(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const unauthorized = await requireTeacherResponse();
  if (unauthorized) return unauthorized;

  try {
    const { code } = await params;
    const state = await finishSession(code);
    return jsonOk({ state });
  } catch (error) {
    return jsonError(error);
  }
}
