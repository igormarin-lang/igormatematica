"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/EmptyState";
import { GameButton, GameButtonLink } from "@/components/GameButton";
import { GameStatusBadge } from "@/components/GameStatusBadge";
import { IFSPLogo } from "@/components/IFSPLogo";
import { QuestionCard } from "@/components/QuestionCard";
import { RaceTrack } from "@/components/RaceTrack";
import { Ranking } from "@/components/Ranking";
import { SessionCodeCard } from "@/components/SessionCodeCard";
import { StatCard } from "@/components/StatCard";
import { Timer } from "@/components/Timer";
import { GameAppShell } from "@/components/game/GameAppShell";
import { GameTabs } from "@/components/game/GameTabs";
import { GameTopBar } from "@/components/game/GameTopBar";
import { GameWindow } from "@/components/game/GameWindow";
import { TeacherPlayerControls } from "@/components/game/TeacherPlayerControls";
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
  const [mobileTab, setMobileTab] = useState<"race" | "players" | "controls">("race");
  const { state, setState, error } = useGameState(code);

  const sessionUrl = useMemo(() => {
    if (!code || typeof window === "undefined") return "";
    return `${window.location.origin}/sessao/${code}`;
  }, [code]);

  const screenUrl = useMemo(() => {
    if (!code || typeof window === "undefined") return "";
    return `${window.location.origin}/telao/${code}`;
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
    if (data.state) setState(data.state);
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

  async function setEntryLock(locked: boolean) {
    if (!code) return;
    const response = await fetch(`/api/sessions/${code}/entries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locked })
    });
    const data = (await response.json()) as ApiResponse;
    if (!data.ok) {
      setMessage(data.message ?? "Não foi possível alterar as entradas.");
      return;
    }
    if (data.state) setState(data.state);
    setMessage(locked ? "Novas entradas bloqueadas." : "Novas entradas liberadas.");
  }

  async function playerAction(playerId: string, action: "kick" | "reset-score") {
    if (!code) return;
    const response = await fetch(`/api/sessions/${code}/players/${playerId}/${action}`, { method: "POST" });
    const data = (await response.json()) as ApiResponse;
    if (!data.ok) {
      setMessage(data.message ?? "Ação não realizada.");
      return;
    }
    if (data.state) setState(data.state);
    setMessage(action === "kick" ? "Aluno removido da corrida." : "Pontuação zerada.");
  }

  async function copyText(value: string, label: string) {
    if (!value || typeof navigator === "undefined") return;
    await navigator.clipboard.writeText(value);
    setMessage(`${label} copiado!`);
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/professor/login");
  }

  const controlsPanel = (
    <div className="grid min-h-0 gap-3 overflow-y-auto pr-1">
      <section className="rounded-[1.5rem] border-2 border-white/15 bg-white p-4 text-green-950 shadow-[0_6px_0_rgba(0,0,0,.22)]">
        <label className="block text-xs font-black uppercase text-green-800" htmlFor="rounds">
          Perguntas
        </label>
        <select
          id="rounds"
          value={totalRounds}
          onChange={(event) => setTotalRounds(Number(event.target.value))}
          className="mt-2 h-12 w-full rounded-2xl border-4 border-green-950 bg-white px-3 font-black"
        >
          {[5, 10, 15, 20].map((rounds) => (
            <option key={rounds} value={rounds}>
              {rounds} perguntas
            </option>
          ))}
        </select>
        <GameButton className="mt-3 w-full" variant="green" onClick={createNewSession} disabled={loading}>
          {loading ? "Criando..." : "Criar corrida"}
        </GameButton>
      </section>

      {state ? (
        <>
          <SessionCodeCard code={state.session.code} sessionUrl={sessionUrl} />
          <GameButtonLink href={`/telao/${state.session.code}`} variant="primary" className="w-full" target="_blank">
            Abrir telão
          </GameButtonLink>
          <div className="grid grid-cols-2 gap-2">
            <GameButton variant="white" className="min-h-12 px-3 text-xs" onClick={() => void copyText(screenUrl, "Link do telão")}>
              Copiar telão
            </GameButton>
            <GameButton variant="white" className="min-h-12 px-3 text-xs" onClick={() => void copyText(state.session.code, "Código")}>
              Copiar código
            </GameButton>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <GameButton className="px-3" variant="green" onClick={() => sessionAction("start")} disabled={state.players.length < 1 || state.session.status === "running"}>
              {state.session.status === "paused" ? "Continuar" : "Iniciar"}
            </GameButton>
            <GameButton className="px-3" variant="white" onClick={() => sessionAction("pause")} disabled={state.session.status !== "running"}>
              Pausar
            </GameButton>
            <GameButton className="px-3" variant="white" onClick={() => sessionAction("reset")}>
              Reiniciar
            </GameButton>
            <GameButton className="px-3" variant="red" onClick={() => sessionAction("finish")}>
              Encerrar
            </GameButton>
          </div>
          <GameButton className="w-full" variant={state.session.entries_locked ? "green" : "white"} onClick={() => void setEntryLock(!state.session.entries_locked)}>
            {state.session.entries_locked ? "Liberar entradas" : "Bloquear entradas"}
          </GameButton>
        </>
      ) : (
        <div className="rounded-[1.5rem] border-2 border-white/15 bg-green-950/65 p-4 text-white">
          <p className="text-2xl font-black">Crie uma corrida</p>
          <p className="mt-2 font-semibold text-white/72">Libere o código e chame a turma.</p>
        </div>
      )}
      {message || error ? <p className="rounded-2xl bg-flagYellow p-3 font-black text-green-950">{message || error}</p> : null}
    </div>
  );

  const racePanel = state ? (
    <div className="flex min-h-0 flex-col gap-3 overflow-hidden">
      <div className="grid grid-cols-[1fr_auto] items-start gap-3">
        <QuestionCard question={state.question} status={state.session.status} />
        <Timer endsAt={state.session.question_ends_at} />
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard label="Status" value={state.session.status === "running" ? "Correndo" : state.session.status === "waiting" ? "Largada" : state.session.status === "paused" ? "Pausada" : "Fim"} />
        <StatCard label="Pergunta" value={state.session.current_round ? `${state.session.current_round}/${state.session.total_rounds}` : "0"} />
        <StatCard label="Alunos" value={state.players.length} />
        <StatCard label="Nível" value={state.question?.difficulty ?? "-"} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto rounded-[1.7rem] bg-asphalt p-3 shadow-soft">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-white">
          <strong>{state.session.current_round ? `Pergunta ${state.session.current_round} de ${state.session.total_rounds}` : "A pista espera a turma"}</strong>
          <GameStatusBadge status={state.session.status} />
        </div>
        <RaceTrack players={state.ranking} totalRounds={state.session.total_rounds} />
      </div>
    </div>
  ) : (
    <div className="grid h-full place-items-center rounded-[1.7rem] bg-asphalt p-5 text-center shadow-soft">
      <EmptyState eyebrow="Pronto" title="A pista está vazia">
        <p>Escolha as perguntas e crie uma corrida.</p>
      </EmptyState>
    </div>
  );

  const playersPanel = (
    <div className="grid min-h-0 gap-3 overflow-y-auto pr-1">
      <section className="rounded-[1.5rem] border-2 border-white/15 bg-white p-4 text-green-950 shadow-[0_6px_0_rgba(0,0,0,.2)]">
        <h2 className="mb-3 text-xl font-black">Alunos</h2>
        <div className="grid gap-2">
          {state?.players.length ? (
            state.players.map((player) => (
              <TeacherPlayerControls
                key={player.id}
                player={player}
                onKick={(target) => {
                  if (window.confirm("Remover este aluno da corrida?")) void playerAction(target.id, "kick");
                }}
                onResetScore={(target) => void playerAction(target.id, "reset-score")}
              />
            ))
          ) : (
            <p className="rounded-2xl bg-green-50 p-4 font-bold text-green-900/70">Nenhum aluno entrou ainda.</p>
          )}
        </div>
      </section>
      <section className="rounded-[1.5rem] border-2 border-white/15 bg-white p-4 text-green-950 shadow-[0_6px_0_rgba(0,0,0,.2)]">
        <h2 className="mb-3 text-xl font-black">Ranking da turma</h2>
        <Ranking players={state?.ranking ?? []} compact />
      </section>
    </div>
  );

  return (
    <GameAppShell>
      <GameWindow className="max-w-[1400px]">
        <GameTopBar
          title="Sala do professor"
          subtitle={state ? `${state.session.code} · ${state.session.status === "waiting" ? "Aguardando largada" : state.session.status}` : "Crie uma corrida e chame a turma"}
          left={<IFSPLogo variant="white" compact className="hidden sm:inline-flex" />}
          right={
            <div className="flex items-center gap-2">
              <GameButtonLink href="/sobre" variant="white" className="hidden min-h-11 rounded-2xl border-2 px-4 py-2 text-xs sm:inline-flex">
                Sobre
              </GameButtonLink>
              <GameButton variant="white" className="min-h-11 rounded-2xl border-2 px-4 py-2 text-xs" onClick={logout}>
                Sair
              </GameButton>
            </div>
          }
        />

        <div className="mt-3 lg:hidden">
          <GameTabs
            value={mobileTab}
            onChange={setMobileTab}
            items={[
              { value: "race", label: "Corrida" },
              { value: "players", label: "Alunos" },
              { value: "controls", label: "Controle" }
            ]}
          />
        </div>

        <div className="mt-3 grid min-h-0 flex-1 gap-3 overflow-hidden lg:grid-cols-[0.86fr_1.55fr_1fr]">
          <aside className={`${mobileTab === "controls" ? "block" : "hidden"} min-h-0 lg:block`}>{controlsPanel}</aside>
          <section className={`${mobileTab === "race" ? "block" : "hidden"} min-h-0 lg:block`}>{racePanel}</section>
          <aside className={`${mobileTab === "players" ? "block" : "hidden"} min-h-0 lg:block`}>{playersPanel}</aside>
        </div>
      </GameWindow>
    </GameAppShell>
  );
}
