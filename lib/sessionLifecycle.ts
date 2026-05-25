import type { createServiceClient } from "@/lib/supabase/server";
import type { GameStatus, Session } from "@/types/game";

const WAITING_EXPIRATION_MS = 30 * 60 * 1000;
const ACTIVE_EXPIRATION_MS = 60 * 60 * 1000;

type SupabaseServiceClient = ReturnType<typeof createServiceClient>;

function isMissingColumn(error: { message?: string } | null | undefined, column: string) {
  return Boolean(error?.message?.includes(column) || error?.message?.includes("schema cache"));
}

function activityDate(session: Session) {
  return new Date(session.last_activity_at ?? session.created_at);
}

export function sessionExpiresAt(status: GameStatus, from = new Date()) {
  if (status === "waiting") return new Date(from.getTime() + WAITING_EXPIRATION_MS);
  if (status === "running" || status === "paused") return new Date(from.getTime() + ACTIVE_EXPIRATION_MS);
  return from;
}

export function isRoomActive(session: Session, now = new Date()) {
  if (session.status === "finished") return false;
  if (session.ended_at || session.close_reason) return false;

  const expiresAt = session.expires_at ? new Date(session.expires_at) : sessionExpiresAt(session.status, activityDate(session));
  return expiresAt.getTime() > now.getTime();
}

export function getRoomVisibilityStatus(session: Session, now = new Date()) {
  if (session.status === "finished" || session.ended_at) return "closed";
  if (!isRoomActive(session, now)) return "expired";
  if (session.entries_locked) return "locked";
  if (session.status !== "waiting") return "in_progress";
  return "open";
}

export async function updateSessionWithActivity(
  supabase: SupabaseServiceClient,
  sessionId: string,
  patch: Record<string, unknown>,
  statusForExpiry?: GameStatus
) {
  const now = new Date();
  const nextStatus = (statusForExpiry ?? (typeof patch.status === "string" ? (patch.status as GameStatus) : "waiting")) as GameStatus;
  const fullPatch = {
    ...patch,
    last_activity_at: now.toISOString(),
    expires_at: sessionExpiresAt(nextStatus, now).toISOString()
  };

  let { error } = await supabase.from("sessions").update(fullPatch).eq("id", sessionId);

  if (isMissingColumn(error, "last_activity_at") || isMissingColumn(error, "expires_at")) {
    const fallback = await supabase.from("sessions").update(patch).eq("id", sessionId);
    error = fallback.error;
  }

  if (error) throw error;
}

export async function closeSession(
  supabase: SupabaseServiceClient,
  sessionId: string,
  reason: "teacher_closed" | "inactive" | "finished" | "reset",
  extra: Record<string, unknown> = {}
) {
  const now = new Date().toISOString();
  const patch = {
    ...extra,
    status: "finished",
    question_ends_at: null,
    ended_at: now,
    close_reason: reason,
    last_activity_at: now,
    expires_at: now
  };

  let { error } = await supabase.from("sessions").update(patch).eq("id", sessionId);

  if (isMissingColumn(error, "ended_at") || isMissingColumn(error, "close_reason") || isMissingColumn(error, "last_activity_at") || isMissingColumn(error, "expires_at")) {
    const fallback = await supabase
      .from("sessions")
      .update({ ...extra, status: "finished", question_ends_at: null })
      .eq("id", sessionId);
    error = fallback.error;
  }

  if (error) throw error;
}

export async function touchSessionActivity(supabase: SupabaseServiceClient, session: Pick<Session, "id" | "status">) {
  await updateSessionWithActivity(supabase, session.id, {}, session.status);
}

export async function expireInactiveRooms(supabase: SupabaseServiceClient) {
  const { data: sessions, error } = await supabase.from("sessions").select("*").neq("status", "finished").returns<Session[]>();
  if (error) throw error;

  const expired = (sessions ?? []).filter((session) => !isRoomActive(session));

  for (const session of expired) {
    try {
      await closeSession(supabase, session.id, "inactive");
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("Failed to expire inactive room", session.code, error);
      }
    }
  }

  return expired;
}
