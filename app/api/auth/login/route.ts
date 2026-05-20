import { NextRequest, NextResponse } from "next/server";
import { createTeacherToken, setTeacherCookie, verifyTeacherCredentials } from "@/lib/auth";
import { jsonError } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };

    if (!verifyTeacherCredentials(String(body.email ?? ""), String(body.password ?? ""))) {
      return jsonError(new Error("E-mail ou senha inválidos."), 401);
    }

    const response = NextResponse.json({ ok: true });
    setTeacherCookie(response, createTeacherToken());
    return response;
  } catch (error) {
    return jsonError(error);
  }
}
