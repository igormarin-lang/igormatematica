"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { GameStatusBadge } from "@/components/GameStatusBadge";
import { IFSPLogo } from "@/components/IFSPLogo";
import { PlayerCard } from "@/components/PlayerCard";
import { QuestionCard } from "@/components/QuestionCard";
import { RaceTrack } from "@/components/RaceTrack";
import { Ranking } from "@/components/Ranking";
import { SessionCodeCard } from "@/components/SessionCodeCard";
import { StatCard } from "@/components/StatCard";
import { Timer } from "@/components/Timer";
import { useGameState } from "@/lib/useGameState";
import type { GameState, Session } from "@/types/game";

type ApiResponse = {
  ok: boolean;
  session?: Session;
  state?: GameState;
  message?: string;
};

export function DashboardClient() {
  const router = useRouter();
  const [totalRounds, setTotalRounds] = useState(10);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { state, setState, error } = useGameState(code);
  const sessionUrl = useMemo(() => {
    if (!code || typeof window === "undefined") return "";
    return `${window.location.origin}/sessao/${code}`;
  }, [code]);

  async function createNewSession() {
    setLoading(true);
    setMessage("");
    const response = await fetch("/api/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ totalRounds })
    });
    const data = (await response.json()) as ApiResponse;
    setLoading(false);

    if (!data.ok || !data.session) {
      setMessage(data.message ?? "Não foi possível criar a sessão.");
      return;
    }

    setCode(data.session.code);
    if (data.state) {
      setState(data.state);
    }
  }

  async function sessionAction(action: "start" | "pause" | "reset" | "finish" | "advance") {
    if (!code) return;
    const response = await fetch(`/api/sessions/${code}/${action}`, { method: "POST" });
    const data = (await response.json()) as ApiResponse;

    if (!data.ok) {
      setMessage(data.message ?? "Ação não realizada.");
      return;
    }

    if (data.state) setState(data.state);
    setMessage("");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/professor/login");
  }

  return (
    <main className="academic-bg min-h-screen px-4 py-4 sm:px-6 sm:py-6">
      <header className="sticky top-3 z-20 mx-auto mb-5 flex w-full max-w-[1600px] items-center justify-between gap-3 rounded-[2rem] bg-green-950/90 p-4 shadow-sm ring-1 ring-white/10 backdrop-blur">
        <div className="flex min-w-0 items-center gap-4">
          <IFSPLogo compact className="hidden shrink-0 sm:inline-flex" />
          <div className="min-w-0">
          <p className="text-sm font-black uppercase text-flagYellow">Painel do professor • IFSP / Trabalho acadêmico</p>
          <h1 className="text-2xl font-black leading-tight text-white sm:text-3xl">Corrida das Expressões</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ButtonLink href="/sobre" variant="quiet" className="hidden sm:inline-flex">
            Sobre
          </ButtonLink>
          <Button variant="quiet" onClick={logout}>
            Sair
          </Button>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1600px] gap-5 xl:grid-cols-12">
        <aside className="space-y-5 xl:col-span-3">
          <section className="rounded-[2rem] bg-white/90 p-5 shadow-soft ring-1 ring-slate-200 backdrop-blur">
            <label className="block text-sm font-black uppercase text-slate-500" htmlFor="rounds">
              Rodadas
            </label>
            <select
              id="rounds"
              value={totalRounds}
              onChange={(event) => setTotalRounds(Number(event.target.value))}
              className="mt-2 h-14 w-full rounded-2xl border-2 border-slate-200 bg-white px-3 font-bold"
            >
              {[5, 10, 15, 20].map((rounds) => (
                <option key={rounds} value={rounds}>
                  {rounds} rodadas
                </option>
              ))}
            </select>
            <Button className="mt-4 w-full min-h-14" onClick={createNewSession} disabled={loading}>
              {loading ? "Criando..." : "Criar nova sessão"}
            </Button>
            <p className="mt-3 text-sm font-semibold text-slate-500">Crie uma sala, projete o telão e peça para a turma entrar pelo código.</p>
          </section>

          {state ? (
            <div className="space-y-4">
              <SessionCodeCard code={state.session.code} sessionUrl={sessionUrl} />
              <ButtonLink href={`/telao/${state.session.code}`} variant="quiet" className="w-full" target="_blank">
                Abrir modo telão
              </ButtonLink>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-2">
                <Button className="px-3" onClick={() => sessionAction("start")} disabled={state.players.length < 1 || state.session.status === "running"}>
                  Iniciar
                </Button>
                <Button className="px-3" variant="quiet" onClick={() => sessionAction("pause")} disabled={state.session.status !== "running"}>
                  Pausar
                </Button>
                <Button className="px-3" variant="secondary" onClick={() => sessionAction("reset")}>
                  Reiniciar
                </Button>
                <Button className="px-3" variant="quiet" onClick={() => sessionAction("finish")}>
                  Encerrar
                </Button>
              </div>
            </div>
          ) : (
            <EmptyState title="Crie uma sessão">
              <p>Crie uma sessão para liberar o código da turma e iniciar a corrida.</p>
            </EmptyState>
          )}
          {message || error ? <p className="mt-4 rounded-xl bg-yellow-50 p-3 font-bold text-slate-700">{message || error}</p> : null}
        </aside>

        <section className="min-w-0 space-y-5 xl:col-span-6">
          {state ? (
            <>
              <div className="grid grid-cols-[1fr_auto] items-start gap-3 sm:gap-4">
                <div className="min-w-0">
                  <QuestionCard question={state.question} status={state.session.status} />
                </div>
                <Timer endsAt={state.session.question_ends_at} />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard label="Status" value={state.session.status === "running" ? "Rodando" : state.session.status === "waiting" ? "Aguardando" : state.session.status === "paused" ? "Pausada" : "Final"} />
                <StatCard label="Rodada" value={`${state.session.current_round || 0}/${state.session.total_rounds}`} />
                <StatCard label="Alunos" value={state.players.length} />
                <StatCard label="Dificuldade" value={state.question?.difficulty ?? "-"} />
              </div>
              <div className="rounded-[2rem] bg-asphalt p-4 shadow-soft sm:p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-white">
                  <strong>Rodada {state.session.current_round || 0} de {state.session.total_rounds}</strong>
                  <GameStatusBadge status={state.session.status} />
                </div>
                <RaceTrack players={state.ranking} totalRounds={state.session.total_rounds} />
              </div>
            </>
          ) : (
            <div className="grid min-h-[520px] place-items-center rounded-[2rem] bg-asphalt p-6 text-center shadow-soft">
              <EmptyState eyebrow="Pronto para a aula" title="A pista está vazia">
                <p>Nenhuma sessão foi criada ainda. Escolha a quantidade de rodadas e libere o código para a turma.</p>
              </EmptyState>
            </div>
          )}
        </section>

        <aside className="space-y-5 xl:col-span-3">
          <section className="rounded-[2rem] bg-white/90 p-5 shadow-soft ring-1 ring-slate-200 backdrop-blur">
            <h2 className="mb-3 text-xl font-black">Alunos</h2>
            <div className="grid gap-2">
              {state?.players.length ? state.players.map((player) => <PlayerCard key={player.id} player={player} />) : <p className="rounded-2xl bg-slate-50 p-4 font-bold text-slate-500">Nenhum aluno entrou ainda. Peça para eles acessarem o site e digitarem o código.</p>}
            </div>
          </section>
          <section className="rounded-[2rem] bg-white/90 p-5 shadow-soft ring-1 ring-slate-200 backdrop-blur">
            <h2 className="mb-3 text-xl font-black">Ranking da turma</h2>
            <Ranking players={state?.ranking ?? []} compact />
          </section>
        </aside>
      </div>
    </main>
  );
}
