"use client";

import { useEffect, useState } from "react";
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

export function RoomBrowser() {
  const router = useRouter();
  const [rooms, setRooms] = useState<PublicRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function loadRooms() {
      setLoading(true);
      const response = await fetch("/api/sessions/public", { cache: "no-store" });
      const data = (await response.json()) as RoomResponse;
      if (cancelled) return;
      setLoading(false);
      if (!data.ok) {
        setMessage(data.message ?? "Não foi possível carregar as salas.");
        return;
      }
      setRooms(data.rooms ?? []);
    }

    void loadRooms();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <GameLoadingScreen text="Carregando salas..." />;

  return (
    <div className="grid gap-3">
      {message ? <p className="rounded-2xl bg-orange-50 p-3 font-black text-raceRed">{message}</p> : null}
      {!rooms.length ? (
        <div className="rounded-[1.5rem] border-2 border-white/15 bg-green-950/55 p-5 text-center">
          <p className="text-2xl font-black">Nenhuma sala aberta agora.</p>
          <p className="mt-2 font-semibold text-white/75">Peça o código ao professor ou crie uma nova corrida.</p>
        </div>
      ) : null}
      <div className="grid max-h-[min(56dvh,28rem)] gap-3 overflow-y-auto pr-1">
        {rooms.map((room) => {
          const blocked = room.entries_locked || room.status === "finished";
          return (
            <article key={room.code} className="grid gap-3 rounded-[1.5rem] border-2 border-white/15 bg-white p-4 text-green-950 shadow-[0_6px_0_rgba(0,0,0,.22)] sm:grid-cols-[1fr_auto] sm:items-center">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase text-ifGreen">Corrida {room.code}</p>
                <h3 className="truncate text-2xl font-black">Sala {room.code}</h3>
                <div className="mt-2 flex flex-wrap gap-2 text-xs font-black uppercase">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-green-800">{statusLabel[room.status]}</span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{room.players} jogadores</span>
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
