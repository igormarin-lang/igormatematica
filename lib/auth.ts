import crypto from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { requireEnv } from "@/lib/env";

const COOKIE_NAME = "corrida_professor";
const MAX_AGE_SECONDS = 60 * 60 * 8;

function sign(value: string) {
  return crypto.createHmac("sha256", requireEnv("AUTH_SECRET")).update(value).digest("hex");
}

export function verifyTeacherCredentials(email: string, password: string) {
  const expectedEmail = requireEnv("PROFESSOR_EMAIL");
  const expectedPassword = requireEnv("PROFESSOR_PASSWORD");
  return email === expectedEmail && password === expectedPassword;
}

export function createTeacherToken() {
  const payload = JSON.stringify({
    role: "teacher",
    exp: Date.now() + MAX_AGE_SECONDS * 1000
  });
  const encoded = Buffer.from(payload).toString("base64url");
  return `${encoded}.${sign(encoded)}`;
}

export function isTeacherTokenValid(token?: string) {
  if (!token) return false;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature || sign(encoded) !== signature) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as { role: string; exp: number };
    return payload.role === "teacher" && payload.exp > Date.now();
  } catch {
    return false;
  }
}

export async function isTeacherAuthenticated() {
  return isTeacherTokenValid((await cookies()).get(COOKIE_NAME)?.value);
}

export function setTeacherCookie(response: NextResponse, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS
  });
}

export function clearTeacherCookie(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });
}
