"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { GameStatusBadge } from "@/components/GameStatusBadge";
import { QuestionCard } from "@/components/QuestionCard";
import { Ranking } from "@/components/Ranking";
import { StatCard } from "@/components/StatCard";
import { Timer } from "@/components/Timer";
import { useGameState } from "@/lib/useGameState";
import type { GameState, Player } from "@/types/game";

type JoinResponse = {
  ok: boolean;
  player?: Player;
  state?: GameState;
  message?: string;
};

type AnswerResponse = {
  ok: boolean;
  correct?: boolean;
  points?: number;
  correctAnswer?: number | null;
  state?: GameState;
  message?: string;
};

export function PlayerSession({ code }: { code: string }) {
  const [name, setName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "idle" | "correct" | "wrong" | "info" }>({ text: "", type: "idle" });
  const [loading, setLoading] = useState(false);
  const { state, setState, error } = useGameState(code);
  const storageKey = useMemo(() => `corrida-player-${code}`, [code]);

  useEffect(() => {
    const savedPlayerId = window.localStorage.getItem(storageKey);
    if (savedPlayerId) setPlayerId(savedPlayerId);
  }, [storageKey]);

  const me = state?.players.find((player) => player.id === playerId) ?? null;
  const myRank = state?.ranking.findIndex((player) => player.id === playerId) ?? -1;
  const canAnswer = Boolean(state?.session.status === "running" && me && !me.answered_current_round);
  const progress = state && me ? Math.min(1, me.position / state.session.total_rounds) : 0;

  async function join(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "idle" });

    const response = await fetch(`/api/sessions/${code}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    const data = (await response.json()) as JoinResponse;
    setLoading(false);

    if (!data.ok || !data.player || !data.state) {
      setMessage({ text: data.message ?? "Não foi possível entrar.", type: "wrong" });
      return;
    }

    window.localStorage.setItem(storageKey, data.player.id);
    setPlayerId(data.player.id);
    setState(data.state);
  }

  async function sendAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!answer.trim()) return;
    const response = await fetch(`/api/sessions/${code}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId, answer: Number(answer) })
    });
    const data = (await response.json()) as AnswerResponse;
    setAnswer("");

    if (!data.ok) {
      setMessage({ text: data.message ?? "Não foi possível responder.", type: "wrong" });
      return;
    }

    setMessage(
      data.correct
        ? { text: `Você acertou! +${data.points} ponto(s). Resposta enviada.`, type: "correct" }
        : { text: `Você errou! ${data.correctAnswer !== null && data.correctAnswer !== undefined ? `Resposta correta: ${data.correctAnswer}.` : "Tente a próxima."}`, type: "wrong" }
    );
    if (data.state) setState(data.state);
  }

  if (!me) {
    return (
      <main className="academic-bg grid min-h-screen place-items-center px-4 py-5 sm:px-5 sm:py-10">
        <form onSubmit={join} className="w-full max-w-lg overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-slate-200">
          <div className="speed-lines p-5 text-white">
            <Link href="/" className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-black">
              Trocar código
            </Link>
            <p className="mt-8 text-sm font-black uppercase text-flagYellow">Sessão {code}</p>
            <h1 className="mt-2 text-5xl font-black leading-none">Seu nome</h1>
          </div>
          <div className="p-5 sm:p-7">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={24}
              placeholder="Ex.: Ana"
              aria-label="Digite seu nome"
              className="h-16 w-full rounded-2xl border-2 border-slate-200 px-4 text-xl font-bold outline-none focus:border-ifGreen"
            />
            <Button className="mt-5 w-full sm:min-h-16" type="submit" disabled={loading || name.trim().length < 2}>
              {loading ? "Entrando..." : "Entrar na corrida"}
            </Button>
            {message.text || error ? <p className="mt-4 rounded-xl bg-red-50 p-3 font-bold text-raceRed">{message.text || error}</p> : null}
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="academic-bg min-h-screen px-4 py-4 sm:py-6">
      <section className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1280px] gap-5 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-5">
        <div className="rounded-[2rem] bg-slate-950 p-4 text-white shadow-soft sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase text-flagYellow">Sessão {code}</p>
              <h1 className="truncate text-3xl font-black">{me.name}</h1>
            </div>
            <Timer endsAt={state?.session.question_ends_at ?? null} />
          </div>
          <div className="mt-4 race-lane relative h-28 overflow-hidden rounded-[1.5rem] ring-1 ring-white/10">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-pitGreen/50 to-flagYellow/30 transition-all" style={{ width: `${progress * 100}%` }} />
            <span className="absolute bottom-3 text-5xl drop-shadow-lg transition-all" style={{ left: `calc(12px + ${progress * 100}% - ${progress * 66}px)` }}>
              🏎️
            </span>
            <span className="absolute left-4 top-4 text-sm font-black text-white">Sua pista</span>
            <span className="checkered absolute bottom-0 right-0 top-0 w-12" />
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {state ? <GameStatusBadge status={state.session.status} /> : null}
            <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase text-white/80">
              Rodada {state?.session.current_round || 0} de {state?.session.total_rounds ?? "-"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <StatCard label="posição" value={myRank + 1 || "-"} />
          <StatCard label="pontos" value={me.score} />
        </div>
        </div>

        <div className="space-y-5">
        <QuestionCard question={state?.question ?? null} status={state?.session.status ?? "waiting"} />

        <form onSubmit={sendAnswer} className="rounded-[2rem] bg-white/95 p-5 shadow-soft ring-1 ring-slate-200 backdrop-blur">
          <label className="font-black" htmlFor="answer">
            Sua resposta
          </label>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              id="answer"
              type="number"
              inputMode="numeric"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              disabled={!canAnswer}
              placeholder="0"
              aria-label="Digite sua resposta"
              className="h-16 min-w-0 rounded-2xl border-2 border-slate-200 px-4 text-center text-3xl font-black outline-none focus:border-ifGreen disabled:bg-slate-100 sm:text-left"
            />
            <Button className="min-h-16" type="submit" disabled={!canAnswer}>
              {me.answered_current_round ? "Resposta enviada" : "Responder"}
            </Button>
          </div>
          <p
            className={`mt-4 min-h-7 rounded-2xl p-3 font-black ${
              message.type === "correct"
                ? "bg-green-50 text-ifGreen"
                : message.type === "wrong"
                  ? "bg-red-50 text-raceRed"
                  : "bg-blue-50 text-raceBlue"
            }`}
          >
            {message.text ||
              (state?.session.status === "paused"
                ? "A corrida está pausada pelo professor."
                : state?.session.status === "waiting"
                  ? "Aguardando o professor iniciar."
                  : me.answered_current_round
                    ? "Resposta enviada. Aguarde a próxima rodada."
                    : "Leia com calma e envie sua resposta.")}
          </p>
        </form>

        {state?.session.status === "finished" ? (
          <div className="confetti rounded-[2rem] bg-green-50 p-5 ring-1 ring-green-100">
            <h2 className="text-2xl font-black text-green-800">Vencedor: {state.winner?.name ?? "turma"}</h2>
            <div className="mt-4">
              <Ranking players={state.ranking} compact />
            </div>
          </div>
        ) : null}
        </div>
      </section>
    </main>
  );
}
