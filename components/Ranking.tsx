import type { PlayerWithAnswered } from "@/types/game";

export function Ranking({ players, compact = false }: { players: PlayerWithAnswered[]; compact?: boolean }) {
  if (!players.length) {
    return <p className="rounded-2xl bg-slate-50 p-4 text-sm font-bold text-slate-500">Nenhum aluno entrou ainda.</p>;
  }

  return (
    <ol className="grid gap-2">
      {players.map((player, index) => (
        <li
          key={player.id}
          className="flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200"
        >
          <span className="min-w-0 truncate font-black">
            {index + 1}. {player.name}
          </span>
          <span className={`${compact ? "text-sm" : "text-base"} shrink-0 font-extrabold text-raceBlue`}>
            {player.score} pts
          </span>
        </li>
      ))}
    </ol>
  );
}
