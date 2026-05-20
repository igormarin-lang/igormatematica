"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/Button";
import { PlayerCard } from "@/components/PlayerCard";
import { QuestionCard } from "@/components/QuestionCard";
import { RaceTrack } from "@/components/RaceTrack";
import { Ranking } from "@/components/Ranking";
import { SessionCode } from "@/components/SessionCode";
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
  const { state, setState, error, refresh } = useGameState(code);
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
    await refresh();
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

  async function copyLink() {
    if (!sessionUrl) return;
    await navigator.clipboard.writeText(sessionUrl);
    setMessage("Link copiado.");
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/professor/login");
  }

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6">
      <header className="mx-auto mb-5 flex w-full max-w-7xl flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-raceRed">Painel do professor</p>
          <h1 className="text-3xl font-black text-slate-950">Corrida das Expressões</h1>
        </div>
        <Button variant="quiet" onClick={logout}>
          Sair
        </Button>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-5 lg:grid-cols-[330px_minmax(0,1fr)_320px]">
        <aside className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-200">
          <label className="block text-sm font-black uppercase text-slate-500" htmlFor="rounds">
            Rodadas
          </label>
          <select
            id="rounds"
            value={totalRounds}
            onChange={(event) => setTotalRounds(Number(event.target.value))}
            className="mt-2 h-12 w-full rounded-xl border-2 border-slate-200 px-3 font-bold"
          >
            {[5, 10, 15, 20].map((rounds) => (
              <option key={rounds} value={rounds}>
                {rounds} rodadas
              </option>
            ))}
          </select>
          <Button className="mt-4 w-full" onClick={createNewSession} disabled={loading}>
            {loading ? "Criando..." : "Criar nova sessão"}
          </Button>

          {state ? (
            <div className="mt-5 space-y-4">
              <SessionCode code={state.session.code} />
              <Button variant="secondary" className="w-full" onClick={copyLink}>
                Copiar link da sessão
              </Button>
              <ButtonLink href={`/telao/${state.session.code}`} variant="quiet" className="w-full" target="_blank">
                Abrir modo telão
              </ButtonLink>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => sessionAction("start")} disabled={state.players.length < 1 || state.session.status === "running"}>
                  Iniciar
                </Button>
                <Button variant="quiet" onClick={() => sessionAction("pause")} disabled={state.session.status !== "running"}>
                  Pausar
                </Button>
                <Button variant="secondary" onClick={() => sessionAction("reset")}>
                  Reiniciar
                </Button>
                <Button variant="quiet" onClick={() => sessionAction("finish")}>
                  Encerrar
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-5 rounded-2xl bg-slate-50 p-4 font-bold text-slate-500">Crie uma sessão para liberar o código da turma.</p>
          )}
          {message || error ? <p className="mt-4 rounded-xl bg-yellow-50 p-3 font-bold text-slate-700">{message || error}</p> : null}
        </aside>

        <section className="min-w-0 space-y-5">
          {state ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <QuestionCard question={state.question} status={state.session.status} />
                <Timer endsAt={state.session.question_ends_at} />
              </div>
              <div className="rounded-3xl bg-asphalt p-4 shadow-soft sm:p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-white">
                  <strong>Rodada {state.session.current_round || 0} de {state.session.total_rounds}</strong>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-black">{state.session.status}</span>
                </div>
                <RaceTrack players={state.ranking} totalRounds={state.session.total_rounds} />
              </div>
            </>
          ) : (
            <div className="grid min-h-[520px] place-items-center rounded-3xl bg-white p-8 text-center shadow-soft ring-1 ring-slate-200">
              <div>
                <p className="text-sm font-black uppercase text-raceRed">Pronto para a aula</p>
                <h2 className="mt-2 text-4xl font-black">Crie uma sessão</h2>
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <section className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-200">
            <h2 className="mb-3 text-xl font-black">Alunos</h2>
            <div className="grid gap-2">
              {state?.players.length ? state.players.map((player) => <PlayerCard key={player.id} player={player} />) : <p className="font-bold text-slate-500">Aguardando alunos.</p>}
            </div>
          </section>
          <section className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-200">
            <h2 className="mb-3 text-xl font-black">Ranking</h2>
            <Ranking players={state?.ranking ?? []} compact />
          </section>
        </aside>
      </div>
    </main>
  );
}
