import type { PlayerWithAnswered } from "@/types/game";

export function PlayerCard({ player }: { player: PlayerWithAnswered }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200">
      <span className="min-w-0 truncate font-extrabold">{player.name}</span>
      <span className={`rounded-full px-3 py-1 text-xs font-black ${player.answered_current_round ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
        {player.answered_current_round ? "respondeu" : "aguardando"}
      </span>
    </div>
  );
}
