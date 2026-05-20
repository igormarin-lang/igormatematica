import { getStateByCode } from "@/lib/gameLogic";
import { jsonError, jsonOk } from "@/lib/api";

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const state = await getStateByCode(code);
    return jsonOk({ state });
  } catch (error) {
    return jsonError(error, 404);
  }
}
