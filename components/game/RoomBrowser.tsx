"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GameButton } from "@/components/GameButton";
import { GameLoadingScreen } from "@/components/game/GameLoadingScreen";

type PublicRoom = {
  code: string;
  status: "waiting" | "running" | "paused" | "finished";
  total_rounds: number;
  current_round: number;
  players: number;
  entries_locked: boolean;
  created_at?: string | null;
  last_activity_at?: string | null;
};

type RoomResponse = {
  ok: boolean;
  rooms?: PublicRoom[];
  message?: string;
};

const statusLabel: Record<PublicRoom["status"], string> = {
  waiting: "Aguardando",
  running: "Em andamento",
  paused: "Pausada",
  finished: "Finalizada"
};

function minutesSince(value?: string | null) {
  if (!value) return "agora";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "agora";
  const minutes = Math.max(0, Math.floor((Date.now() - date.getTime()) / 60000));
  if (minutes < 1) return "agora";
  if (minutes === 1) return "há 1 min";
  return `há ${minutes} min`;
}

export function RoomBrowser() {
  const router = useRouter();
  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadRooms = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setMessage("");
      const response = await fetch("/api/sessions/public", { cache: "no-store" });
      const data = (await response.json()) as RoomResponse;
      if (signal?.aborted) return;

      setLoading(false);
      if (!data.ok) {
        setMessage(data.message ?? "Não foi possível carregar as salas.");
        setRooms([]);
        return;
      }
      setRooms(data.rooms ?? []);
    } catch {
      if (signal?.aborted) return;
      setLoading(false);
      setRooms([]);
      setMessage("Não foi possível carregar as salas.");
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadRooms(controller.signal);
    return () => controller.abort();
  }, [loadRooms]);

  if (loading) return <GameLoadingScreen text="Carregando salas..." />;

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black">Salas disponíveis</h2>
          <p className="text-sm font-semibold text-white/70">Aparecem aqui apenas corridas abertas.</p>
        </div>
        <GameButton type="button" variant="white" className="px-4 py-2 text-sm" onClick={() => void loadRooms()} disabled={loading}>
          Atualizar
        </GameButton>
      </div>

      {message ? <p className="rounded-2xl bg-orange-50 p-3 font-black text-raceRed">{message}</p> : null}

      {!rooms.length ? (
        <div className="rounded-[1.5rem] border-2 border-white/15 bg-green-950/55 p-5 text-center">
          <p className="text-2xl font-black">Nenhuma sala aberta agora.</p>
          <p className="mt-2 font-semibold text-white/75">Peça o código ao professor ou crie uma nova corrida.</p>
        </div>
      ) : null}

      <div className="grid max-h-[min(52dvh,27rem)] gap-3 overflow-y-auto overscroll-contain pr-1">
        {rooms.map((room) => {
          const blocked = room.entries_locked || room.status !== "waiting";
          return (
            <article
              key={room.code}
              className="grid gap-3 rounded-[1.5rem] border-2 border-white/15 bg-white p-4 text-green-950 shadow-[0_6px_0_rgba(0,0,0,.22)] sm:grid-cols-[1fr_auto] sm:items-center"
            >
              <div className="min-w-0">
                <p className="text-xs font-black uppercase text-ifGreen">Corrida {room.code}</p>
                <h3 className="truncate text-2xl font-black">Sala {room.code}</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-black uppercase">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">{statusLabel[room.status]}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{room.players} jogadores</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                    Atualizada {minutesSince(room.last_activity_at ?? room.created_at)}
                  </span>
                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-green-950">
                    {room.current_round || 0}/{room.total_rounds}
                  </span>
                  {room.entries_locked ? <span className="rounded-full bg-red-100 px-3 py-1 text-raceRed">Bloqueada</span> : null}
                </div>
              </div>
              <GameButton type="button" variant={blocked ? "white" : "green"} disabled={blocked} onClick={() => router.push(`/sessao/${room.code}`)}>
                Entrar
              </GameButton>
            </article>
          );
        })}
      </div>
    </div>
  );
}
