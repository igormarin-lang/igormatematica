"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/Button";
import { QuestionCard } from "@/components/QuestionCard";
import { Ranking } from "@/components/Ranking";
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
  state?: GameState;
  message?: string;
};

export function PlayerSession({ code }: { code: string }) {
  const [name, setName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
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
    setMessage("");

    const response = await fetch(`/api/sessions/${code}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    const data = (await response.json()) as JoinResponse;
    setLoading(false);

    if (!data.ok || !data.player || !data.state) {
      setMessage(data.message ?? "Não foi possível entrar.");
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
      setMessage(data.message ?? "Não foi possível responder.");
      return;
    }

    setMessage(data.correct ? `Acertou! +${data.points} ponto(s).` : "Errou desta vez. Tente a próxima.");
    if (data.state) setState(data.state);
  }

  if (!me) {
    return (
      <main className="grid min-h-screen place-items-center px-4 py-5 sm:px-5 sm:py-10">
        <form onSubmit={join} className="w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-slate-200">
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
            className="h-16 w-full rounded-2xl border-2 border-slate-200 px-4 text-xl font-bold outline-none focus:border-raceRed"
          />
          <Button className="mt-5 w-full sm:min-h-16" type="submit" disabled={loading || name.trim().length < 2}>
            {loading ? "Entrando..." : "Entrar na corrida"}
          </Button>
          {message || error ? <p className="mt-4 rounded-xl bg-red-50 p-3 font-bold text-raceRed">{message || error}</p> : null}
          </div>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-4 sm:py-6">
      <section className="mx-auto max-w-xl space-y-5">
        <div className="rounded-[2rem] bg-slate-950 p-4 text-white shadow-soft sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase text-flagYellow">Sessão {code}</p>
              <h1 className="truncate text-3xl font-black">{me.name}</h1>
            </div>
            <Timer endsAt={state?.session.question_ends_at ?? null} />
          </div>
          <div className="mt-4 race-lane relative h-20 overflow-hidden rounded-[1.5rem] ring-1 ring-white/10">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-pitGreen/50 to-flagYellow/30 transition-all" style={{ width: `${progress * 100}%` }} />
            <span className="absolute bottom-2 text-4xl drop-shadow-lg transition-all" style={{ left: `calc(12px + ${progress * 100}% - ${progress * 58}px)` }}>
              🏎️
            </span>
            <span className="checkered absolute bottom-0 right-0 top-0 w-10" />
          </div>
        </div>

        <QuestionCard question={state?.question ?? null} status={state?.session.status ?? "waiting"} />

        <form onSubmit={sendAnswer} className="rounded-[2rem] bg-white p-5 shadow-soft ring-1 ring-slate-200">
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
              className="h-16 min-w-0 rounded-2xl border-2 border-slate-200 px-4 text-center text-3xl font-black outline-none focus:border-raceRed disabled:bg-slate-100 sm:text-left"
            />
            <Button className="min-h-16" type="submit" disabled={!canAnswer}>
              Responder
            </Button>
          </div>
          <p className="mt-4 min-h-7 font-black text-raceBlue">
            {message || (state?.session.status === "waiting" ? "Aguarde o professor iniciar." : "")}
          </p>
        </form>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[1.5rem] bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
            <strong className="block text-3xl font-black">{myRank + 1 || "-"}</strong>
            <span className="font-bold text-slate-500">posição</span>
          </div>
          <div className="rounded-[1.5rem] bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
            <strong className="block text-3xl font-black">{me.score}</strong>
            <span className="font-bold text-slate-500">pontos</span>
          </div>
        </div>

        {state?.session.status === "finished" ? (
          <div className="rounded-[2rem] bg-green-50 p-5 ring-1 ring-green-100">
            <h2 className="text-2xl font-black text-green-800">Vencedor: {state.winner?.name ?? "turma"}</h2>
            <div className="mt-4">
              <Ranking players={state.ranking} compact />
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
