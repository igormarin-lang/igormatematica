import { Car2D } from "@/components/Car2D";
import type { PlayerWithAnswered } from "@/types/game";

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
  const carSize = variant === "screen" ? "scale-[1.5]" : variant === "compact" ? "scale-110" : "scale-125";

  if (!players.length) {
    return (
      <div className="race-lane relative min-h-40 overflow-hidden rounded-[2rem] border-2 border-white/15 ring-1 ring-white/10">
        <span className="absolute left-4 top-4 max-w-[70%] font-black text-white">Nenhum aluno entrou ainda</span>
        <span className="absolute left-4 top-12 text-sm font-semibold text-white/75">Peça para a turma digitar o código da sessão.</span>
        <span className="absolute bottom-8 left-4">
          <Car2D color="#2f9e41" model="future" sticker="plus" className="scale-125" />
        </span>
        <span className="checkered absolute bottom-0 right-0 top-0 w-12 opacity-90" />
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:gap-4">
      {players.map((player) => {
        const progress = Math.min(1, player.position / totalRounds);

        return (
          <div
            key={player.id}
            className={`race-lane relative overflow-hidden rounded-[2rem] border-2 border-white/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)] ${laneSize}`}
          >
            <div className="absolute inset-y-0 left-1/4 w-px bg-white/20" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-white/20" />
            <div className="absolute inset-y-0 left-3/4 w-px bg-white/20" />
            <span className="absolute bottom-1 left-1/4 z-10 text-[10px] font-black text-white/45">25%</span>
            <span className="absolute bottom-1 left-1/2 z-10 text-[10px] font-black text-white/45">50%</span>
            <span className="absolute bottom-1 left-3/4 z-10 text-[10px] font-black text-white/45">75%</span>
            <span className="absolute left-4 top-3 z-10 max-w-[48%] truncate text-sm font-black text-white drop-shadow sm:max-w-72 sm:text-base">
              {player.name}
            </span>
            <span className="absolute right-14 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-green-950 shadow-sm">
              {player.score} pts
            </span>
            <div
              className="absolute bottom-0 left-0 top-0 bg-gradient-to-r from-ifGreen/55 via-green-400/30 to-flagYellow/35 transition-all duration-700"
              style={{ width: `${progress * 100}%` }}
            />
            <span
              className="absolute bottom-4 drop-shadow-lg transition-all duration-700"
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
