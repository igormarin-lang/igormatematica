import type { GameStatus } from "@/types/game";

const labels: Record<GameStatus, string> = {
  waiting: "Aguardando início",
  running: "Corrida em andamento",
  paused: "Corrida pausada",
  finished: "Corrida finalizada"
};

const styles: Record<GameStatus, string> = {
  waiting: "bg-blue-50 text-raceBlue ring-blue-100",
  running: "bg-green-50 text-ifGreen ring-green-100",
  paused: "bg-yellow-50 text-amber-700 ring-yellow-100",
  finished: "bg-slate-100 text-slate-700 ring-slate-200"
};

export function GameStatusBadge({ status }: { status: GameStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-black uppercase ring-1 ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

