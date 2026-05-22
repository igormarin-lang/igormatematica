"use client";

import { useState } from "react";
import { Car2D } from "@/components/Car2D";
import type { PlayerWithAnswered } from "@/types/game";

export function TeacherPlayerControls({
  player,
  onKick,
  onResetScore
}: {
  player: PlayerWithAnswered;
  onKick: (player: PlayerWithAnswered) => void;
  onResetScore: (player: PlayerWithAnswered) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative rounded-2xl bg-green-50 p-2.5 ring-1 ring-green-950/10">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <Car2D color={player.car_color} model={player.car_model} sticker={player.car_sticker} className="scale-[.68]" />
          <div className="min-w-0">
            <p className="truncate text-sm font-black">{player.name}</p>
            <p className="text-[11px] font-bold text-green-900/65">
              {player.score} pts · {player.correct_answers} acertos
            </p>
          </div>
        </div>
        <button
          type="button"
          aria-label={`Ações de ${player.name}`}
          onClick={() => setOpen((current) => !current)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-green-950 bg-white text-lg font-black text-green-950 shadow-[0_3px_0_rgba(0,0,0,.2)]"
        >
          …
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${player.answered_current_round ? "bg-green-200 text-green-800" : "bg-white text-green-900/60"}`}>
          {player.answered_current_round ? "respondeu" : "aguardando"}
        </span>
        <span className="text-[10px] font-black uppercase text-green-900/45">{player.status ?? "active"}</span>
      </div>

      {open ? (
        <div className="absolute right-2 top-12 z-20 grid w-40 gap-1 rounded-2xl border-2 border-green-950 bg-white p-2 text-sm font-black text-green-950 shadow-xl">
          <button type="button" className="rounded-xl px-3 py-2 text-left hover:bg-green-50" onClick={() => onResetScore(player)}>
            Zerar pontos
          </button>
          <button type="button" className="rounded-xl px-3 py-2 text-left text-raceRed hover:bg-red-50" onClick={() => onKick(player)}>
            Remover
          </button>
        </div>
      ) : null}
    </div>
  );
}
