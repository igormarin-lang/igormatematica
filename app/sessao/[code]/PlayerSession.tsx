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
      <main className="grid min-h-screen place-items-center px-5 py-10">
        <form onSubmit={join} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200 sm:p-8">
          <Link href="/" className="font-black text-raceBlue">
            ← trocar código
          </Link>
          <p className="mt-6 text-sm font-black uppercase text-raceRed">Sessão {code}</p>
          <h1 className="mt-2 text-4xl font-black">Seu nome</h1>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={24}
            placeholder="Ex.: Ana"
            className="mt-6 h-16 w-full rounded-2xl border-2 border-slate-200 px-4 text-xl font-bold outline-none focus:border-raceRed"
          />
          <Button className="mt-5 w-full" type="submit" disabled={loading || name.trim().length < 2}>
            {loading ? "Entrando..." : "Entrar na corrida"}
          </Button>
          {message || error ? <p className="mt-4 rounded-xl bg-red-50 p-3 font-bold text-raceRed">{message || error}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-5">
      <section className="mx-auto max-w-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase text-raceRed">Sessão {code}</p>
            <h1 className="text-3xl font-black">{me.name}</h1>
          </div>
          <Timer endsAt={state?.session.question_ends_at ?? null} />
        </div>

        <QuestionCard question={state?.question ?? null} status={state?.session.status ?? "waiting"} />

        <form onSubmit={sendAnswer} className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-slate-200">
          <label className="font-black" htmlFor="answer">
            Sua resposta
          </label>
          <div className="mt-3 grid grid-cols-[1fr_auto] gap-3">
            <input
              id="answer"
              type="number"
              inputMode="numeric"
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              disabled={!canAnswer}
              placeholder="0"
              className="h-16 min-w-0 rounded-2xl border-2 border-slate-200 px-4 text-2xl font-black outline-none focus:border-raceRed disabled:bg-slate-100"
            />
            <Button type="submit" disabled={!canAnswer}>
              Responder
            </Button>
          </div>
          <p className="mt-4 min-h-7 font-black text-raceBlue">
            {message || (state?.session.status === "waiting" ? "Aguarde o professor iniciar." : "")}
          </p>
        </form>

        <div className="rounded-3xl bg-asphalt p-4 shadow-soft">
          <div className="race-lane relative h-20 overflow-hidden rounded-2xl">
            <div className="absolute inset-y-0 left-0 bg-pitGreen/35 transition-all" style={{ width: `${progress * 100}%` }} />
            <span className="absolute bottom-2 text-4xl transition-all" style={{ left: `calc(12px + ${progress * 100}% - ${progress * 58}px)` }}>
              🏎️
            </span>
            <span className="checkered absolute bottom-0 right-0 top-0 w-9" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
            <strong className="block text-3xl font-black">{myRank + 1 || "-"}</strong>
            <span className="font-bold text-slate-500">posição</span>
          </div>
          <div className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-slate-200">
            <strong className="block text-3xl font-black">{me.score}</strong>
            <span className="font-bold text-slate-500">pontos</span>
          </div>
        </div>

        {state?.session.status === "finished" ? (
          <div className="rounded-3xl bg-green-50 p-5 ring-1 ring-green-100">
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
