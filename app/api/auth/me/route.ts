import { jsonOk } from "@/lib/api";
import { isTeacherAuthenticated } from "@/lib/auth";

export async function GET() {
  return jsonOk({ authenticated: await isTeacherAuthenticated() });
}
