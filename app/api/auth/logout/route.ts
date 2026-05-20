import { NextResponse } from "next/server";
import { clearTeacherCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearTeacherCookie(response);
  return response;
}
