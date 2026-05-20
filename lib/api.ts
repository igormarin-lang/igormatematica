import { NextResponse } from "next/server";
import { isTeacherAuthenticated } from "@/lib/auth";

export function jsonOk(data: Record<string, unknown> = {}) {
  return NextResponse.json({ ok: true, ...data });
}

export function jsonError(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : "Algo deu errado.";
  return NextResponse.json({ ok: false, message }, { status });
}

export async function requireTeacherResponse() {
  if (!(await isTeacherAuthenticated())) {
    return NextResponse.json({ ok: false, message: "Professor não autenticado." }, { status: 401 });
  }

  return null;
}
