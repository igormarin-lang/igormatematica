"use client";

import { QuestionCard } from "@/components/QuestionCard";
import { IFSPLogo } from "@/components/IFSPLogo";
import { RaceTrack } from "@/components/RaceTrack";
import { Ranking } from "@/components/Ranking";
import { SessionCode } from "@/components/SessionCode";
import { Timer } from "@/components/Timer";
import { useGameState } from "@/lib/useGameState";

export function BigScreenClient({ code }: { code: string }) {
  const { state, error } = useGameState(code);
  const podium = state?.ranking.slice(0, 3) ?? [];

  return (
    <main className="scoreboard-bg h-[100dvh] overflow-hidden px-4 py-4 text-white sm:px-6 sm:py-6">
      <div className="mx-auto grid h-full max-w-[1800px] gap-4 overflow-hidden xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="flex min-h-0 flex-col gap-4 overflow-hidden">
          <header className="grid gap-4 rounded-[2rem] bg-white/10 p-4 ring-1 ring-white/10 backdrop-blur sm:p-5 lg:grid-cols-[1fr_auto_auto] lg:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <IFSPLogo variant="white" compact className="hidden shrink-0 sm:inline-flex" />
              <div className="min-w-0">
                <p className="text-sm font-black uppercase text-flagYellow">Corrida das Expressões</p>
                <h1 className="truncate text-3xl font-black leading-tight sm:text-5xl 2xl:text-6xl">Placar da turma</h1>
              </div>
            </div>
            <div className="bg-white text-slate-950">
              <SessionCode code={code} />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-[1.75rem] bg-white/10 p-3 ring-1 ring-white/10 lg:flex-col">
              <span className="text-lg font-black">
                {state?.session.current_round ? `Pergunta ${state.session.current_round} de ${state.session.total_rounds}` : "Aguardando largada"}
              </span>
              <Timer endsAt={state?.session.question_ends_at ?? null} />
            </div>
          </header>

          {state ? (
            <>
              <div className="min-w-0 text-slate-950">
                {state.session.status === "waiting" ? (
                  <div className="rounded-[2rem] bg-white p-6 text-center shadow-soft">
                    <p className="text-sm font-black uppercase text-ifGreen">Aguardando largada</p>
                    <h2 className="mt-2 text-4xl font-black sm:text-6xl">A pista espera a turma</h2>
                  </div>
                ) : state.session.status === "finished" ? (
                  <div className="confetti rounded-[2rem] bg-white p-6 text-center shadow-soft">
                    <p className="text-sm font-black uppercase text-ifGreen">Fim da corrida</p>
                    <h2 className="mt-2 text-4xl font-black sm:text-6xl">Vencedor: {state.winner?.name ?? "Turma"}</h2>
                  </div>
                ) : (
                  <QuestionCard question={state.question} status={state.session.status} />
                )}
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto rounded-[2rem] bg-asphalt p-4 shadow-soft sm:p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <strong className="text-lg">Pista principal</strong>
                  <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-black uppercase">
                    {state.session.status === "running" ? "Corrida em andamento" : state.session.status}
                  </span>
                </div>
                <RaceTrack players={state.ranking} totalRounds={state.session.total_rounds} variant="screen" />
              </div>
            </>
          ) : (
            <div className="rounded-[2rem] bg-white/10 p-8 font-bold">{error || "Carregando sessão..."}</div>
          )}
        </section>

        <aside className="flex min-h-0 flex-col gap-5 overflow-y-auto rounded-[2rem] bg-white p-5 text-slate-950 shadow-soft">
          <div>
            <h2 className="mb-4 text-2xl font-black">Ranking da turma</h2>
            <Ranking players={state?.ranking ?? []} />
          </div>
          {state?.session.status === "finished" ? (
            <div className="confetti rounded-[1.75rem] bg-green-50 p-4 ring-1 ring-green-100">
              <p className="text-sm font-black uppercase text-green-700">Pódio final</p>
              <div className="mt-4 grid gap-3">
                {podium.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 shadow-sm">
                    <span className="font-black">
                      {index + 1}º {player.name}
                    </span>
                    <span className="text-right font-black text-ifGreen">
                      {player.score} pts
                      <span className="block text-xs text-slate-500">{player.correct_answers} acertos</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
