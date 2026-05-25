"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Car2D } from "@/components/Car2D";
import { CarPreview3D } from "@/components/CarPreview3D";
import { GameButton } from "@/components/GameButton";
import { GameInput } from "@/components/GameInput";
import { GamePanel } from "@/components/GamePanel";
import { GameStatusBadge } from "@/components/GameStatusBadge";
import { QuestionCard } from "@/components/QuestionCard";
import { RaceTrack2D } from "@/components/RaceTrack2D";
import { Ranking } from "@/components/Ranking";
import { StatCard } from "@/components/StatCard";
import { StudentCustomizer, type StudentCustomization } from "@/components/StudentCustomizer";
import { Timer } from "@/components/Timer";
import { GameAppShell } from "@/components/game/GameAppShell";
import { GameTopBar } from "@/components/game/GameTopBar";
import { GameWindow } from "@/components/game/GameWindow";
import { GameHeaderCompact } from "@/components/layout/GameHeaderCompact";
import { defaultStudentCustomization, normalizeStudentCustomization, playerToStudentCustomization } from "@/lib/studentCustomization";
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

type StateResponse = {
  ok: boolean;
  state?: GameState;
  message?: string;
};

const customizationStorageKey = "corrida-student-customization";

export function PlayerSession({ code }: { code: string }) {
  const [name, setName] = useState("");
  const [customization, setCustomization] = useState<StudentCustomization>(defaultStudentCustomization);
  const [playerId, setPlayerId] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState<{ text: string; type: "idle" | "correct" | "wrong" | "info" }>({ text: "", type: "idle" });
  const [loading, setLoading] = useState(false);
  const [savingCar, setSavingCar] = useState(false);
  const [editingWaiting, setEditingWaiting] = useState(false);
  const { state, setState, error } = useGameState(code);
  const storageKey = useMemo(() => `corrida-player-${code}`, [code]);
  const customizationRef = useRef<StudentCustomization>(defaultStudentCustomization);

  const persistLocalCustomization = useCallback((nextValue: Partial<StudentCustomization>) => {
    const normalized = normalizeStudentCustomization(nextValue);
    customizationRef.current = normalized;
    setCustomization(normalized);
    setName(normalized.name);
    window.localStorage.setItem(customizationStorageKey, JSON.stringify(normalized));
    if (normalized.name) window.localStorage.setItem("corrida-pilot-name", normalized.name);
    return normalized;
  }, []);

  useEffect(() => {
    const savedPlayerId = window.localStorage.getItem(storageKey);
    if (savedPlayerId) setPlayerId(savedPlayerId);
  }, [storageKey]);

  useEffect(() => {
    const savedCustomization = window.localStorage.getItem(customizationStorageKey);
    if (savedCustomization) {
      try {
        const parsed = JSON.parse(savedCustomization) as Partial<StudentCustomization>;
        persistLocalCustomization(parsed);
        return;
      } catch {
        window.localStorage.removeItem(customizationStorageKey);
      }
    }

    const savedName = window.localStorage.getItem("corrida-pilot-name");
    if (!savedName) return;
    persistLocalCustomization({ ...defaultStudentCustomization, name: savedName });
  }, [persistLocalCustomization]);

  const me = state?.players.find((player) => player.id === playerId) ?? null;
  const removedMe = state?.removedPlayers.find((player) => player.id === playerId) ?? null;
  const myRank = state?.ranking.findIndex((player) => player.id === playerId) ?? -1;
  const canAnswer = Boolean(state?.session.status === "running" && me && !me.answered_current_round);
  const progress = state && me ? Math.min(1, me.position / state.session.total_rounds) : 0;
  const myCustomization = me ? playerToStudentCustomization(me, customization) : customization;
  const displayMe = me
    ? {
        ...me,
        car_color: myCustomization.carColor,
        car_model: myCustomization.carModel,
        car_sticker: myCustomization.carSticker,
        celebration_emoji: myCustomization.celebrationEmoji,
        student_theme: myCustomization.studentTheme
      }
    : null;

  useEffect(() => {
    if (!me || editingWaiting) return;
    const remoteHasCustomization =
      me.car_color !== undefined ||
      me.car_model !== undefined ||
      me.car_sticker !== undefined ||
      me.celebration_emoji !== undefined ||
      me.student_theme !== undefined;

    if (!remoteHasCustomization) {
      setName(me.name);
      return;
    }

    persistLocalCustomization(playerToStudentCustomization(me, customizationRef.current));
  }, [
    editingWaiting,
    me,
    persistLocalCustomization
  ]);

  useEffect(() => {
    if (!state || !playerId || me || removedMe) return;
    window.localStorage.removeItem(storageKey);
    setPlayerId("");
  }, [me, playerId, removedMe, state, storageKey]);

  async function join(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "idle" });
    const submittedCustomization = normalizeStudentCustomization({ ...customization, name: customization.name || name });

    const response = await fetch(`/api/sessions/${code}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submittedCustomization)
    });
    const data = (await response.json()) as JoinResponse;
    setLoading(false);

    if (!data.ok || !data.player || !data.state) {
      setMessage({ text: data.message ?? "Não foi possível entrar.", type: "wrong" });
      return;
    }

    window.localStorage.setItem(storageKey, data.player.id);
    window.localStorage.setItem("corrida-last-session-code", code);
    setPlayerId(data.player.id);
    setState(data.state);
    persistLocalCustomization(playerToStudentCustomization(data.player, submittedCustomization));
    setEditingWaiting(false);
  }

  async function saveCar() {
    if (!me) return;
    setSavingCar(true);
    setMessage({ text: "", type: "idle" });
    const submittedCustomization = normalizeStudentCustomization(customization);
    const response = await fetch(`/api/sessions/${code}/players/${me.id}/customization`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submittedCustomization)
    });
    const data = (await response.json()) as StateResponse;
    setSavingCar(false);

    if (!data.ok || !data.state) {
      setMessage({ text: data.message ?? "Não foi possível salvar o carrinho.", type: "wrong" });
      return;
    }

    setState(data.state);
    persistLocalCustomization(submittedCustomization);
    setEditingWaiting(false);
    setMessage({ text: "Carrinho atualizado!", type: "correct" });
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
        ? { text: `Boa! Você acertou. ${myCustomization.celebrationEmoji} +${data.points} ponto(s).`, type: "correct" }
        : { text: `Quase! Tente na próxima. ${data.correctAnswer !== null && data.correctAnswer !== undefined ? `Resposta correta: ${data.correctAnswer}.` : ""}`, type: "wrong" }
    );
    if (data.state) setState(data.state);
  }

  if (removedMe) {
    return (
      <GameAppShell>
        <GameWindow compact className="max-w-2xl">
          <div className="m-auto max-w-xl rounded-[2rem] border-2 border-white/15 bg-white p-6 text-center text-green-950 shadow-soft">
          <h1 className="text-3xl font-black">Você foi removido da corrida pelo professor.</h1>
          <p className="mt-3 font-bold text-slate-600">Fale com o professor se precisar entrar novamente.</p>
          <Link href="/" className="mt-6 inline-flex rounded-2xl bg-ifGreen px-5 py-3 font-black text-white">
            Voltar ao início
          </Link>
          </div>
        </GameWindow>
      </GameAppShell>
    );
  }

  if (!me) {
    return (
      <GameAppShell>
        <GameWindow>
          <div className="flex shrink-0 items-center justify-between gap-3">
            <Link href="/" className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-black text-ifGreen shadow-sm ring-1 ring-slate-200">
              Trocar código
            </Link>
            <span className="rounded-full bg-green-950/80 px-4 py-2 text-sm font-black text-flagYellow">Sessão {code}</span>
          </div>
          <StudentCustomizer
            value={customization}
            onChange={(next) => {
              persistLocalCustomization(next);
            }}
            onSubmit={() => {
              void join();
            }}
            loading={loading}
            message={message.text || error}
            title="Crie seu piloto"
            subtitle="Em poucos passos, escolha nome, carrinho, cor e comemoração."
          />
        </GameWindow>
      </GameAppShell>
    );
  }

  if (state?.session.status === "waiting") {
    if (!editingWaiting) {
      return (
        <GameAppShell>
          <GameWindow>
            <GameHeaderCompact
              title="Seu carrinho está pronto"
              subtitle="Aguardando largada"
              right={<span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase text-flagYellow">Sessão {code}</span>}
            />

            <div className="mt-4 grid min-h-0 flex-1 gap-4 overflow-y-auto lg:grid-cols-[0.95fr_1.05fr] lg:overflow-hidden">
              <div className="min-h-0">
                <CarPreview3D
                  color={myCustomization.carColor}
                  model={myCustomization.carModel}
                  sticker={myCustomization.carSticker}
                  celebration={myCustomization.celebrationEmoji}
                  playerName={me.name}
                  size="large"
                />
              </div>

              <div className="flex min-h-0 flex-col gap-4 overflow-y-auto rounded-[2rem] border-2 border-white/15 bg-green-950/80 p-4 shadow-soft sm:p-5">
                <div className="text-center lg:text-left">
                  <p className="text-sm font-black uppercase text-flagYellow">A pista espera a turma</p>
                  <h1 className="mt-2 text-3xl font-black sm:text-5xl">Aguardando o professor iniciar</h1>
                  <p className="mt-2 font-semibold text-white/75">Seu carrinho está pronto na largada. Você pode personalizar enquanto a corrida ainda não começou.</p>
                </div>

                <GameButton className="w-full" type="button" icon="✎" onClick={() => setEditingWaiting(true)}>
                  Editar carrinho
                </GameButton>

                {message.text || error ? (
                  <p className={`rounded-2xl p-3 text-center font-black ${message.type === "correct" ? "bg-green-100 text-ifGreen" : "bg-orange-50 text-raceRed"}`}>
                    {message.text || error}
                  </p>
                ) : null}

                <GamePanel tone="dark" className="mt-auto">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-black text-flagYellow">Pista de espera</h2>
                    <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase">Sessão {code}</span>
                  </div>
                  <RaceTrack2D players={displayMe ? [displayMe] : []} totalRounds={state.session.total_rounds} variant="compact" />
                </GamePanel>
              </div>
            </div>
          </GameWindow>
        </GameAppShell>
      );
    }

    return (
      <GameAppShell>
        <GameWindow>
          <div className="rounded-[2rem] border-2 border-white/15 bg-green-950/80 p-5 text-center shadow-soft">
            <p className="text-sm font-black uppercase text-flagYellow">Aguardando largada</p>
            <h1 className="mt-2 text-3xl font-black sm:text-5xl">Seu carrinho está pronto na largada.</h1>
            <p className="mt-2 font-semibold text-white/75">Personalize enquanto o professor inicia a corrida.</p>
          </div>
          <StudentCustomizer
            value={customization}
            onChange={(next) => {
              persistLocalCustomization(next);
            }}
            onSubmit={() => void saveCar()}
            loading={savingCar}
            message={message.text || error}
            title="Ajuste seu carro"
            subtitle="Você pode mudar cor, modelo, adesivo, emoji e tema até a largada."
            submitLabel="Salvar carrinho"
            loadingLabel="Salvando..."
            lockName
            onCancel={() => setEditingWaiting(false)}
          />
        </GameWindow>
      </GameAppShell>
    );
  }

  return (
    <GameAppShell>
      <GameWindow>
        <GameTopBar
          title="Corrida das Expressões"
          subtitle={state?.session.current_round ? `Pergunta ${state.session.current_round} de ${state.session.total_rounds}` : "Corrida em andamento"}
          left={<span className="rounded-full bg-white/10 px-3 py-2 text-xs font-black uppercase text-flagYellow">{code}</span>}
          right={<Timer endsAt={state?.session.question_ends_at ?? null} />}
        />
      <section className="mt-4 grid min-h-0 flex-1 gap-4 overflow-hidden lg:grid-cols-[0.72fr_1fr]">
        <div className="hidden min-h-0 space-y-4 overflow-y-auto pr-1 lg:block">
          <CarPreview3D
            color={myCustomization.carColor}
            model={myCustomization.carModel}
            sticker={myCustomization.carSticker}
            celebration={myCustomization.celebrationEmoji}
            success={message.type === "correct"}
            playerName={me.name}
            size="md"
          />

          <div className="rounded-[2rem] border-2 border-white/15 bg-green-950/82 p-4 text-white shadow-soft sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-black uppercase text-flagYellow">Sessão {code}</p>
                <h1 className="truncate text-3xl font-black">{me.name}</h1>
              </div>
              <Timer endsAt={state?.session.question_ends_at ?? null} />
            </div>
            <div className="mt-4 race-lane relative h-28 overflow-hidden rounded-[1.5rem] border-2 border-white/15 ring-1 ring-white/10">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-pitGreen/50 to-flagYellow/30 transition-all" style={{ width: `${progress * 100}%` }} />
              <span className="absolute bottom-5 drop-shadow-lg transition-all duration-700" style={{ left: `calc(12px + ${progress * 100}% - ${progress * 66}px)` }}>
                <Car2D color={myCustomization.carColor} model={myCustomization.carModel} sticker={myCustomization.carSticker} className="scale-125" />
              </span>
              <span className="absolute left-4 top-4 text-sm font-black text-white">Sua pista</span>
              <span className="checkered absolute bottom-0 right-0 top-0 w-12" />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {state ? <GameStatusBadge status={state.session.status} /> : null}
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase text-white/80">
                Pergunta {state?.session.current_round || 0} de {state?.session.total_rounds ?? "-"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatCard label="posição" value={myRank + 1 || "-"} />
            <StatCard label="pontos" value={me.score} />
            <StatCard label="acertos" value={me.correct_answers} />
          </div>

          {state?.ranking.length ? (
            <GamePanel tone="dark" className="hidden lg:block">
              <h2 className="mb-3 text-xl font-black text-flagYellow">Pista da turma</h2>
              <RaceTrack2D players={state.ranking} totalRounds={state.session.total_rounds} variant="compact" />
            </GamePanel>
          ) : null}
        </div>

        <div className="flex min-h-0 flex-col gap-3 overflow-y-auto pr-1">
          <div className="rounded-[1.5rem] border-2 border-white/15 bg-green-950/82 p-3 text-white shadow-soft lg:hidden">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase text-flagYellow">Sessão {code}</p>
                <h1 className="truncate text-xl font-black">{me.name}</h1>
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase">
                {myRank + 1 || "-"}º · {me.score} pts
              </span>
            </div>
            <div className="mt-3 race-lane relative h-20 overflow-hidden rounded-[1.25rem] border-2 border-white/15">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-pitGreen/50 to-flagYellow/30 transition-all" style={{ width: `${progress * 100}%` }} />
              <span className="absolute bottom-3 drop-shadow-lg transition-all duration-700" style={{ left: `calc(10px + ${progress * 100}% - ${progress * 58}px)` }}>
                <Car2D color={myCustomization.carColor} model={myCustomization.carModel} sticker={myCustomization.carSticker} className="scale-105" />
              </span>
              <span className="checkered absolute bottom-0 right-0 top-0 w-10" />
            </div>
          </div>
          <QuestionCard question={state?.question ?? null} status={state?.session.status ?? "waiting"} />

          <form onSubmit={sendAnswer} className="rounded-[2rem] border-2 border-green-950/15 bg-white p-5 text-green-950 shadow-soft backdrop-blur">
            <label className="font-black uppercase" htmlFor="answer">
              Sua resposta
            </label>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
              <GameInput
                id="answer"
                type="number"
                inputMode="numeric"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                disabled={!canAnswer}
                placeholder="0"
                aria-label="Digite sua resposta"
                className="min-w-0 text-3xl sm:text-left"
              />
              <GameButton className="min-h-16" type="submit" icon="➜" disabled={!canAnswer}>
                {me.answered_current_round ? "Resposta enviada" : "Responder"}
              </GameButton>
            </div>
            <p
              className={`mt-4 min-h-7 rounded-[1.4rem] border-4 p-4 text-center text-lg font-black ${
                message.type === "correct"
                  ? "border-green-950 bg-green-100 text-ifGreen"
                  : message.type === "wrong"
                    ? "border-raceRed bg-orange-50 text-raceRed"
                    : "border-green-950/15 bg-blue-50 text-raceBlue"
              }`}
            >
              {message.text ||
                (state?.session.status === "paused"
                  ? "Corrida pausada pelo professor."
                  : me.answered_current_round
                    ? "Resposta enviada. Aguarde a próxima pergunta."
                    : "Seu carrinho está pronto na largada.")}
            </p>
          </form>

          {state?.session.status === "finished" ? (
            <div className="confetti rounded-[2rem] bg-green-50 p-5 text-green-950 ring-1 ring-green-100">
              <h2 className="text-2xl font-black text-green-800">Fim da corrida</h2>
              <p className="mt-1 font-bold text-green-900">Vencedor: {state.winner?.name ?? "turma"}</p>
              <div className="mt-4">
                <Ranking players={state.ranking} compact />
              </div>
            </div>
          ) : null}
        </div>
      </section>
      </GameWindow>
    </GameAppShell>
  );
}
