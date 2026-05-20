"use client";

import { QuestionCard } from "@/components/QuestionCard";
import { RaceTrack } from "@/components/RaceTrack";
import { Ranking } from "@/components/Ranking";
import { SessionCode } from "@/components/SessionCode";
import { Timer } from "@/components/Timer";
import { useGameState } from "@/lib/useGameState";

export function BigScreenClient({ code }: { code: string }) {
  const { state, error } = useGameState(code);

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-6 text-white">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[1fr_330px]">
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-black uppercase text-flagYellow">Corrida das Expressões</p>
              <h1 className="text-4xl font-black">Telão da turma</h1>
            </div>
            <div className="bg-white text-slate-950">
              <SessionCode code={code} />
            </div>
          </div>

          {state ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="min-w-0 flex-1 text-slate-950">
                  <QuestionCard question={state.question} status={state.session.status} />
                </div>
                <Timer endsAt={state.session.question_ends_at} />
              </div>
              <div className="rounded-3xl bg-asphalt p-5 shadow-soft">
                <div className="mb-4 flex items-center justify-between">
                  <strong>Rodada {state.session.current_round || 0} de {state.session.total_rounds}</strong>
                  <span className="rounded-full bg-white/15 px-4 py-2 text-sm font-black uppercase">{state.session.status}</span>
                </div>
                <RaceTrack players={state.ranking} totalRounds={state.session.total_rounds} />
              </div>
            </>
          ) : (
            <div className="rounded-3xl bg-white/10 p-8 font-bold">{error || "Carregando sessão..."}</div>
          )}
        </section>

        <aside className="rounded-3xl bg-white p-5 text-slate-950 shadow-soft">
          <h2 className="mb-4 text-2xl font-black">Ranking</h2>
          <Ranking players={state?.ranking ?? []} />
          {state?.session.status === "finished" ? (
            <div className="mt-5 rounded-2xl bg-green-50 p-4">
              <p className="text-sm font-black uppercase text-green-700">Vencedor</p>
              <strong className="text-3xl font-black text-green-900">{state.winner?.name ?? "Turma"}</strong>
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
