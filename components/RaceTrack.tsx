import type { PlayerWithAnswered } from "@/types/game";

export function RaceTrack({ players, totalRounds }: { players: PlayerWithAnswered[]; totalRounds: number }) {
  if (!players.length) {
    return (
      <div className="race-lane relative min-h-28 overflow-hidden rounded-[1.75rem] ring-1 ring-white/10">
        <span className="absolute left-4 top-4 font-black text-white">A pista espera a turma</span>
        <span className="absolute bottom-3 left-4 text-5xl drop-shadow">🏎️</span>
        <span className="checkered absolute bottom-0 right-0 top-0 w-12 opacity-90" />
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {players.map((player) => {
        const progress = Math.min(1, player.position / totalRounds);

        return (
          <div key={player.id} className="race-lane relative min-h-20 overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 sm:min-h-24">
            <span className="absolute left-4 top-3 z-10 max-w-[52%] truncate text-sm font-black text-white drop-shadow sm:max-w-64 sm:text-base">
              {player.name}
            </span>
            <span className="absolute right-14 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-900 shadow-sm">
              {player.score} pts
            </span>
            <div
              className="absolute bottom-0 left-0 top-0 bg-gradient-to-r from-pitGreen/45 to-flagYellow/30 transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
            <span
              className="absolute bottom-2 text-4xl drop-shadow-lg transition-all duration-500 sm:text-5xl"
              style={{ left: `calc(12px + ${progress * 100}% - ${progress * 64}px)` }}
            >
              🏎️
            </span>
            <span className="checkered absolute bottom-0 right-0 top-0 w-10 opacity-90 sm:w-12" />
          </div>
        );
      })}
    </div>
  );
}
