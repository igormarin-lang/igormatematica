import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { Player, Session } from "@/types/game";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const { data: sessions, error } = await supabase
      .from("sessions")
      .select("*")
      .neq("status", "finished")
      .order("created_at", { ascending: false })
      .limit(12)
      .returns<Session[]>();

    if (error) throw error;

    const sessionIds = (sessions ?? []).map((session) => session.id);
    const { data: players, error: playersError } = sessionIds.length
      ? await supabase.from("players").select("session_id").in("session_id", sessionIds).returns<Pick<Player, "session_id">[]>()
      : { data: [], error: null };

    if (playersError) throw playersError;

    const counts = new Map<string, number>();
    for (const player of players ?? []) {
      counts.set(player.session_id, (counts.get(player.session_id) ?? 0) + 1);
    }

    return NextResponse.json({
      ok: true,
      rooms: (sessions ?? []).map((session) => ({
        code: session.code,
        status: session.status,
        total_rounds: session.total_rounds,
        current_round: session.current_round,
        entries_locked: Boolean(session.entries_locked),
        players: counts.get(session.id) ?? 0
      }))
    });
  } catch (error) {
    console.warn("public sessions route unavailable", error);
    return NextResponse.json({ ok: true, rooms: [] });
  }
}
