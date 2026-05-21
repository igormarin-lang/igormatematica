import type { PlayerWithAnswered } from "@/types/game";
import { Car2D } from "@/components/Car2D";

const carStyles = [
  "text-raceRed",
  "text-ifGreen",
  "text-flagYellow",
  "text-sky-300",
  "text-fuchsia-300",
  "text-orange-300"
];

export function RaceTrack({
  players,
  totalRounds,
  variant = "default"
}: {
  players: PlayerWithAnswered[];
  totalRounds: number;
  variant?: "default" | "compact" | "screen";
}) {
  const laneSize =
    variant === "screen" ? "min-h-24 sm:min-h-28 2xl:min-h-32" : variant === "compact" ? "min-h-20" : "min-h-20 sm:min-h-24";
  const carSize = variant === "screen" ? "text-5xl sm:text-6xl" : variant === "compact" ? "text-4xl" : "text-4xl sm:text-5xl";

  if (!players.length) {
    return (
      <div className="race-lane relative min-h-40 overflow-hidden rounded-[1.75rem] ring-1 ring-white/10">
        <span className="absolute left-4 top-4 max-w-[70%] font-black text-white">Nenhum aluno entrou ainda</span>
        <span className="absolute left-4 top-12 text-sm font-semibold text-white/75">Peça para a turma digitar o código da sessão.</span>
        <span className="absolute bottom-3 left-4 text-6xl drop-shadow">🏎️</span>
        <span className="checkered absolute bottom-0 right-0 top-0 w-12 opacity-90" />
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {players.map((player, index) => {
        const progress = Math.min(1, player.position / totalRounds);

        return (
          <div key={player.id} className={`race-lane relative overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 ${laneSize}`}>
            <div className="absolute inset-y-0 left-1/4 w-px bg-white/20" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
            <div className="absolute inset-y-0 left-3/4 w-px bg-white/20" />
            <span className="absolute left-4 top-3 z-10 max-w-[48%] truncate text-sm font-black text-white drop-shadow sm:max-w-72 sm:text-base">
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
              className={`absolute bottom-2 drop-shadow-lg transition-all duration-500 ${carStyles[index % carStyles.length]}`}
              style={{ left: `calc(12px + ${progress * 100}% - ${progress * (variant === "screen" ? 82 : 64)}px)` }}
            >
              <Car2D color={player.car_color} model={player.car_model} sticker={player.car_sticker} className={carSize} />
            </span>
            <span className="absolute bottom-2 right-12 z-10 text-xs font-black text-white/70">CHEGADA</span>
            <span className="checkered absolute bottom-0 right-0 top-0 w-10 opacity-90 sm:w-12" />
          </div>
        );
      })}
    </div>
  );
}
