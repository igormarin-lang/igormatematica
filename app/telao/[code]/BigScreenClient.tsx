"use client";

import { IFSPLogo } from "@/components/IFSPLogo";
import { QuestionCard } from "@/components/QuestionCard";
import { RaceTrack } from "@/components/RaceTrack";
import { Ranking } from "@/components/Ranking";
import { SessionCode } from "@/components/SessionCode";
import { Timer } from "@/components/Timer";
import { GameAppShell } from "@/components/game/GameAppShell";
import { GameTopBar } from "@/components/game/GameTopBar";
import { GameWindow } from "@/components/game/GameWindow";
import { useGameState } from "@/lib/useGameState";

export function BigScreenClient({ code }: { code: string }) {
  const { state, error } = useGameState(code);
  const podium = state?.ranking.slice(0, 3) ?? [];

  return (
    <GameAppShell className="p-2 sm:p-3">
      <GameWindow className="max-w-[1800px] bg-green-950/84" compact>
        <GameTopBar
          title="Corrida das Expressões"
          subtitle={state?.session.current_round ? `Pergunta ${state.session.current_round} de ${state.session.total_rounds}` : "Aguardando largada"}
          left={<IFSPLogo variant="white" compact className="hidden sm:inline-flex" />}
          right={
            <div className="flex items-center gap-3">
              <div className="bg-white text-slate-950">
                <SessionCode code={code} />
              </div>
              <Timer endsAt={state?.session.question_ends_at ?? null} />
            </div>
          }
        />

        {state ? (
          <div className="mt-3 grid min-h-0 flex-1 gap-3 overflow-hidden xl:grid-cols-[minmax(0,1fr)_340px]">
            <section className="flex min-h-0 flex-col gap-3 overflow-hidden">
              {state.session.status === "waiting" ? (
                <div className="rounded-[1.7rem] bg-white p-4 text-center text-green-950 shadow-soft">
                  <p className="text-sm font-black uppercase text-ifGreen">Aguardando largada</p>
                  <h2 className="mt-1 text-4xl font-black sm:text-6xl">A pista espera a turma</h2>
                </div>
              ) : state.session.status === "finished" ? (
                <div className="confetti rounded-[1.7rem] bg-white p-4 text-center text-green-950 shadow-soft">
                  <p className="text-sm font-black uppercase text-ifGreen">Fim da corrida</p>
                  <h2 className="mt-1 text-4xl font-black sm:text-6xl">Vencedor: {state.winner?.name ?? "Turma"}</h2>
                </div>
              ) : (
                <div className="text-slate-950">
                  <QuestionCard question={state.question} status={state.session.status} />
                </div>
              )}

              <div className="min-h-0 flex-1 overflow-y-auto rounded-[1.7rem] bg-asphalt p-4 shadow-soft">
                <div className="mb-3 flex items-center justify-between gap-3 text-white">
                  <strong className="text-xl">Arena da turma</strong>
                  <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-black uppercase">
                    {state.session.status === "running" ? "Corrida em andamento" : state.session.status === "finished" ? "Fim da corrida" : "Aguardando"}
                  </span>
                </div>
                <RaceTrack players={state.ranking} totalRounds={state.session.total_rounds} variant="screen" />
              </div>
            </section>

            <aside className="hidden min-h-0 flex-col gap-3 overflow-y-auto rounded-[1.7rem] border-2 border-white/15 bg-white p-4 text-green-950 shadow-soft xl:flex">
              <h2 className="text-2xl font-black">Ranking da turma</h2>
              <Ranking players={state.ranking.slice(0, 8)} />
              {state.session.status === "finished" ? (
                <div className="confetti rounded-[1.4rem] bg-green-50 p-4 ring-1 ring-green-100">
                  <p className="text-sm font-black uppercase text-green-700">Pódio final</p>
                  <div className="mt-3 grid gap-2">
                    {podium.map((player, index) => (
                      <div key={player.id} className="flex items-center justify-between rounded-2xl bg-white px-3 py-2 shadow-sm">
                        <span className="font-black">
                          {index + 1}º {player.name}
                        </span>
                        <span className="text-right font-black text-ifGreen">{player.score} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </aside>
          </div>
        ) : (
          <div className="mt-3 grid min-h-0 flex-1 place-items-center rounded-[1.7rem] bg-white/10 p-8 text-center font-black text-white">
            {error || "Carregando sala..."}
          </div>
        )}
      </GameWindow>
    </GameAppShell>
  );
}
