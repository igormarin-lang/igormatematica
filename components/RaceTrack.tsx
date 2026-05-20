import type { PlayerWithAnswered } from "@/types/game";

export function RaceTrack({ players, totalRounds }: { players: PlayerWithAnswered[]; totalRounds: number }) {
  if (!players.length) {
    return (
      <div className="race-lane relative min-h-24 overflow-hidden rounded-2xl">
        <span className="absolute left-4 top-4 font-black text-white">A pista espera a turma</span>
        <span className="absolute bottom-3 left-4 text-4xl">🏎️</span>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {players.map((player) => {
        const progress = Math.min(1, player.position / totalRounds);

        return (
          <div key={player.id} className="race-lane relative min-h-20 overflow-hidden rounded-2xl">
            <span className="absolute left-4 top-3 z-10 max-w-44 truncate text-sm font-black text-white drop-shadow">
              {player.name}
            </span>
            <div
              className="absolute bottom-0 left-0 top-0 bg-pitGreen/35 transition-all duration-500"
              style={{ width: `${progress * 100}%` }}
            />
            <span
              className="absolute bottom-2 text-4xl transition-all duration-500"
              style={{ left: `calc(12px + ${progress * 100}% - ${progress * 58}px)` }}
            >
              🏎️
            </span>
            <span className="checkered absolute bottom-0 right-0 top-0 w-9 opacity-90" />
          </div>
        );
      })}
    </div>
  );
}
