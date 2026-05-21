import type { PlayerWithAnswered } from "@/types/game";
import { Car2D } from "@/components/Car2D";

export function PlayerCard({ player }: { player: PlayerWithAnswered }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
      <span className="flex min-w-0 items-center gap-2 truncate font-extrabold">
        <Car2D color={player.car_color} model={player.car_model} sticker={player.car_sticker} className="scale-75" />
        <span className="truncate">{player.name}</span>
      </span>
      <span className={`rounded-full px-3 py-1 text-xs font-black ${player.answered_current_round ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
        {player.answered_current_round ? "respondeu" : "aguardando"}
      </span>
    </div>
  );
}
