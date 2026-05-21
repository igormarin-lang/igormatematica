"use client";

import { Button } from "@/components/Button";
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
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Car2D color={player.car_color} model={player.car_model} sticker={player.car_sticker} className="scale-75" />
          <div className="min-w-0">
            <p className="truncate font-black">{player.name}</p>
            <p className="text-xs font-bold text-slate-500">
              {player.score} pts · {player.correct_answers} acertos · {player.status ?? "active"}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-black ${player.answered_current_round ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
          {player.answered_current_round ? "respondeu" : "aguardando"}
        </span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <Button variant="quiet" className="min-h-10 px-3 py-2 text-xs" onClick={() => onResetScore(player)}>
          Zerar
        </Button>
        <Button variant="primary" className="min-h-10 px-3 py-2 text-xs" onClick={() => onKick(player)}>
          Remover
        </Button>
      </div>
    </div>
  );
}
