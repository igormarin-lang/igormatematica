import { createServiceClient } from "@/lib/supabase/server";
import { generateQuestions } from "@/lib/mathQuestions";
import { buildGameState, createSessionCode, sanitizeCode, sanitizePlayerName } from "@/lib/session";
import { closeSession, isRoomActive, sessionExpiresAt, touchSessionActivity, updateSessionWithActivity } from "@/lib/sessionLifecycle";
import { normalizeStudentCustomization, playerToStudentCustomization, toPlayerColumns } from "@/lib/studentCustomization";
import type { Answer, GameState, Player, Question, Session } from "@/types/game";

const QUESTION_SECONDS = 20;

function ensureNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function isMissingColumn(error: { message?: string } | null | undefined, column: string) {
  return Boolean(error?.message?.includes(column) || error?.message?.includes("schema cache"));
}

async function uniqueSessionCode(supabase: ReturnType<typeof createServiceClient>) {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = createSessionCode();
    const { data } = await supabase.from("sessions").select("id").eq("code", code).maybeSingle();
    if (!data) return code;
  }

  throw new Error("Não foi possível gerar um código único.");
}

async function getSessionByCode(rawCode: string) {
  const supabase = createServiceClient();
  const code = sanitizeCode(rawCode);
  const { data: session, error } = await supabase.from("sessions").select("*").eq("code", code).maybeSingle<Session>();

  if (error) throw error;
  if (!session) throw new Error("Sessão não encontrada.");
  if (session.status !== "finished" && !isRoomActive(session)) {
    await closeSession(supabase, session.id, "inactive");
    throw new Error("Sala expirada por inatividade.");
  }
  return session;
}

export async function createSession(totalRounds: number) {
  const supabase = createServiceClient();
  const rounds = [5, 10, 15, 20].includes(totalRounds) ? totalRounds : 10;
  const code = await uniqueSessionCode(supabase);
  const now = new Date();

  let { data: session, error } = await supabase
    .from("sessions")
    .insert({
      code,
      total_rounds: rounds,
      status: "waiting",
      current_round: 0,
      entries_locked: false,
      last_activity_at: now.toISOString(),
      expires_at: sessionExpiresAt("waiting", now).toISOString(),
      ended_at: null,
      close_reason: null
    })
    .select("*")
    .single<Session>();

  if (
    isMissingColumn(error, "entries_locked") ||
    isMissingColumn(error, "last_activity_at") ||
    isMissingColumn(error, "expires_at") ||
    isMissingColumn(error, "ended_at") ||
    isMissingColumn(error, "close_reason")
  ) {
    const fallback = await supabase
      .from("sessions")
      .insert({ code, total_rounds: rounds, status: "waiting", current_round: 0 })
      .select("*")
      .single<Session>();
    session = fallback.data;
    error = fallback.error;
  }

  if (error) throw error;
  if (!session) throw new Error("Não foi possível criar a sessão.");

  const questions = generateQuestions(rounds).map((question) => ({
    ...question,
    session_id: session.id
  }));

  const { error: questionError } = await supabase.from("questions").insert(questions);
  if (questionError) throw questionError;

  return session;
}

export async function getStateByCode(rawCode: string): Promise<GameState> {
  const session = await getSessionByCode(rawCode);
  await autoAdvanceIfNeeded(session);
  return getStateBySessionId(session.id);
}

export async function getStateBySessionId(sessionId: string): Promise<GameState> {
  const supabase = createServiceClient();
  const { data: session, error } = await supabase.from("sessions").select("*").eq("id", sessionId).single<Session>();
  if (error) throw error;

  const [
    { data: players, error: playerError },
    { data: question, error: questionError },
    { data: answers, error: answerError },
    { data: allAnswers, error: allAnswerError }
  ] = await Promise.all([
    supabase.from("players").select("*").eq("session_id", session.id).order("joined_at").returns<Player[]>(),
    session.current_round > 0
      ? supabase
          .from("questions")
          .select("id, session_id, round_number, expression, difficulty")
          .eq("session_id", session.id)
          .eq("round_number", session.current_round)
          .maybeSingle<Question>()
      : Promise.resolve({ data: null, error: null }),
    session.current_round > 0
      ? supabase
          .from("answers")
          .select("*")
          .eq("session_id", session.id)
          .eq("round_number", session.current_round)
          .returns<Answer[]>()
      : Promise.resolve({ data: [], error: null }),
    supabase.from("answers").select("*").eq("session_id", session.id).returns<Answer[]>()
  ]);

  if (playerError) throw playerError;
  if (questionError) throw questionError;
  if (answerError) throw answerError;
  if (allAnswerError) throw allAnswerError;

  return buildGameState({
    session,
    players: players ?? [],
    question: question ?? null,
    answers: answers ?? [],
    allAnswers: allAnswers ?? []
  });
}

export async function joinSession(
  rawCode: string,
  rawName: string,
  customization: {
    carColor?: string;
    carModel?: string;
    carSticker?: string;
    celebrationEmoji?: string;
    studentTheme?: string;
  } = {}
) {
  const supabase = createServiceClient();
  const code = sanitizeCode(rawCode);
  const name = sanitizePlayerName(rawName);

  if (!name) throw new Error("Digite seu nome.");
  const normalizedCustomization = normalizeStudentCustomization({ ...customization, name });

  const { data: session, error } = await supabase.from("sessions").select("*").eq("code", code).maybeSingle<Session>();
  if (error) throw error;
  if (!session) throw new Error("Código da sessão não encontrado.");
  if (session.status === "finished") throw new Error("A corrida já terminou.");
  if (!isRoomActive(session)) {
    await closeSession(supabase, session.id, "inactive");
    throw new Error("Sala expirada por inatividade.");
  }
  if (session.status === "paused") throw new Error("A corrida está pausada pelo professor.");
  if (session.status === "running" && session.entries_locked) {
    throw new Error("A corrida já começou. Peça ao professor para liberar sua entrada.");
  }

  let { data: player, error: playerError } = await supabase
    .from("players")
    .insert({
      session_id: session.id,
      name,
      ...toPlayerColumns(normalizedCustomization),
      status: "active"
    })
    .select("*")
    .single<Player>();

  if (playerError && isMissingColumn(playerError, "status") && !isMissingColumn(playerError, "car_color")) {
    const fallback = await supabase
      .from("players")
      .insert({
        session_id: session.id,
        name,
        ...toPlayerColumns(normalizedCustomization)
      })
      .select("*")
      .single<Player>();
    player = fallback.data;
    playerError = fallback.error;
  }

  if (playerError && isMissingColumn(playerError, "car_color")) {
    const fallback = await supabase.from("players").insert({ session_id: session.id, name }).select("*").single<Player>();
    player = fallback.data;
    playerError = fallback.error;
  }

  if (playerError) throw playerError;
  if (!player) throw new Error("Não foi possível criar o aluno.");
  await touchSessionActivity(supabase, session);
  return player;
}

export async function startSession(rawCode: string) {
  const supabase = createServiceClient();
  const code = sanitizeCode(rawCode);
  const state = await getStateByCode(code);

  if (state.players.length < 1) throw new Error("É preciso ter pelo menos 1 aluno.");
  if (state.session.status === "finished") throw new Error("Esta sessão já foi finalizada.");

  const now = new Date();
  const endsAt = new Date(now.getTime() + QUESTION_SECONDS * 1000);
  const nextRound = state.session.current_round > 0 ? state.session.current_round : 1;

  await updateSessionWithActivity(
    supabase,
    state.session.id,
    {
      status: "running",
      current_round: nextRound,
      question_started_at: now.toISOString(),
      question_ends_at: endsAt.toISOString()
    },
    "running"
  );
  return getStateBySessionId(state.session.id);
}

export async function pauseSession(rawCode: string) {
  const supabase = createServiceClient();
  const state = await getStateByCode(rawCode);
  await updateSessionWithActivity(supabase, state.session.id, { status: "paused" }, "paused");
  return getStateBySessionId(state.session.id);
}

export async function resetSession(rawCode: string) {
  const supabase = createServiceClient();
  const state = await getStateByCode(rawCode);
  const questions = generateQuestions(state.session.total_rounds).map((question) => ({
    ...question,
    session_id: state.session.id
  }));

  await supabase.from("answers").delete().eq("session_id", state.session.id);
  await supabase.from("questions").delete().eq("session_id", state.session.id);
  const resetPlayers = await supabase.from("players").update({ score: 0, position: 0, status: "active" }).eq("session_id", state.session.id);
  if (isMissingColumn(resetPlayers.error, "status")) {
    await supabase.from("players").update({ score: 0, position: 0 }).eq("session_id", state.session.id);
  } else if (resetPlayers.error) {
    throw resetPlayers.error;
  }
  await supabase.from("questions").insert(questions);
  const now = new Date();

  let { error } = await supabase
    .from("sessions")
    .update({
      status: "waiting",
      current_round: 0,
      winner_player_id: null,
      question_started_at: null,
      question_ends_at: null,
      entries_locked: false,
      last_activity_at: now.toISOString(),
      expires_at: sessionExpiresAt("waiting", now).toISOString(),
      ended_at: null,
      close_reason: null
    })
    .eq("id", state.session.id);

  if (
    isMissingColumn(error, "entries_locked") ||
    isMissingColumn(error, "last_activity_at") ||
    isMissingColumn(error, "expires_at") ||
    isMissingColumn(error, "ended_at") ||
    isMissingColumn(error, "close_reason")
  ) {
    const fallback = await supabase
      .from("sessions")
      .update({
        status: "waiting",
        current_round: 0,
        winner_player_id: null,
        question_started_at: null,
        question_ends_at: null
      })
      .eq("id", state.session.id);
    error = fallback.error;
  }

  if (error) throw error;
  return getStateBySessionId(state.session.id);
}

export async function finishSession(rawCode: string) {
  const supabase = createServiceClient();
  const state = await getStateByCode(rawCode);
  const winner = state.ranking[0] ?? null;
  await closeSession(supabase, state.session.id, "finished", { winner_player_id: winner?.id ?? null });
  return getStateBySessionId(state.session.id);
}

export async function submitAnswer(rawCode: string, playerId: string, value: unknown) {
  const supabase = createServiceClient();
  const state = await getStateByCode(rawCode);

  if (state.session.status !== "running" || !state.question) throw new Error("Aguarde a próxima pergunta.");
  if (new Date(state.session.question_ends_at ?? 0).getTime() < Date.now()) {
    return { correct: false, points: 0, correctAnswer: null, state: await advanceRound(rawCode) };
  }

  const answer = ensureNumber(value, Number.NaN);
  if (!Number.isInteger(answer)) throw new Error("Digite apenas números inteiros.");

  const player = state.players.find((item) => item.id === playerId);
  if (!player) throw new Error("Aluno não encontrado nesta sessão.");
  if ((player.status ?? "active") !== "active") throw new Error("Você foi removido da corrida pelo professor.");
  if (player.answered_current_round) throw new Error("Você já respondeu esta pergunta.");

  const { data: privateQuestion, error: questionError } = await supabase
    .from("questions")
    .select("*")
    .eq("id", state.question.id)
    .single<Question>();

  if (questionError) throw questionError;

  const isCorrect = answer === privateQuestion.correct_answer;
  const secondsLeft = Math.max(0, Math.ceil((new Date(state.session.question_ends_at ?? 0).getTime() - Date.now()) / 1000));
  const bonus = isCorrect && secondsLeft >= 14 ? 1 : 0;
  const points = isCorrect ? 1 + bonus : 0;
  const nextPosition = Math.min(state.session.total_rounds, player.position + (isCorrect ? 1 : 0));
  const nextScore = player.score + points;

  const { error: answerError } = await supabase.from("answers").insert({
    session_id: state.session.id,
    player_id: player.id,
    question_id: state.question.id,
    round_number: state.session.current_round,
    answer,
    is_correct: isCorrect,
    points_awarded: points
  });

  if (answerError) throw answerError;

  if (isCorrect || points > 0) {
    const { error: playerError } = await supabase
      .from("players")
      .update({ score: nextScore, position: nextPosition })
      .eq("id", player.id);
    if (playerError) throw playerError;
  }

  await touchSessionActivity(supabase, state.session);
  const updatedState = await getStateBySessionId(state.session.id);
  if (updatedState.answeredCount >= updatedState.players.length) {
    await advanceRound(rawCode);
  }

  return { correct: isCorrect, points, correctAnswer: privateQuestion.correct_answer, state: await getStateBySessionId(state.session.id) };
}

export async function advanceRound(rawCode: string) {
  const supabase = createServiceClient();
  const session = await getSessionByCode(rawCode);
  const state = await getStateBySessionId(session.id);

  if (state.session.status !== "running") return state;

  if (state.session.current_round >= state.session.total_rounds) {
    return finishSession(rawCode);
  }

  const now = new Date();
  const endsAt = new Date(now.getTime() + QUESTION_SECONDS * 1000);
  await updateSessionWithActivity(
    supabase,
    state.session.id,
    {
      current_round: state.session.current_round + 1,
      question_started_at: now.toISOString(),
      question_ends_at: endsAt.toISOString()
    },
    "running"
  );
  return getStateBySessionId(state.session.id);
}

export async function autoAdvanceIfNeeded(session: Session) {
  if (session.status !== "running" || !session.question_ends_at) return;
  if (new Date(session.question_ends_at).getTime() > Date.now()) return;
  await advanceRound(session.code);
}

export async function updatePlayerCustomization(
  rawCode: string,
  playerId: string,
  customization: {
    carColor?: string;
    carModel?: string;
    carSticker?: string;
    celebrationEmoji?: string;
    studentTheme?: string;
  }
) {
  const supabase = createServiceClient();
  const state = await getStateByCode(rawCode);
  const player = [...state.players, ...state.removedPlayers].find((item) => item.id === playerId);

  if (!player) throw new Error("Aluno não encontrado nesta sessão.");
  if ((player.status ?? "active") !== "active") throw new Error("Você foi removido da corrida pelo professor.");
  if (state.session.status !== "waiting") throw new Error("A personalização fica bloqueada depois da largada.");

  const normalizedCustomization = normalizeStudentCustomization(
    { name: player.name, ...customization },
    playerToStudentCustomization(player)
  );

  const { error } = await supabase
    .from("players")
    .update(toPlayerColumns(normalizedCustomization))
    .eq("id", player.id)
    .eq("session_id", state.session.id);

  if (error) throw error;
  await touchSessionActivity(supabase, state.session);
  return getStateBySessionId(state.session.id);
}

export async function setEntriesLocked(rawCode: string, locked: boolean) {
  const supabase = createServiceClient();
  const state = await getStateByCode(rawCode);
  await updateSessionWithActivity(supabase, state.session.id, { entries_locked: locked }, state.session.status);
  return getStateBySessionId(state.session.id);
}

export async function kickPlayer(rawCode: string, playerId: string) {
  const supabase = createServiceClient();
  const state = await getStateByCode(rawCode);
  const { error } = await supabase
    .from("players")
    .update({ status: "kicked" })
    .eq("id", playerId)
    .eq("session_id", state.session.id);
  if (error) throw error;
  await touchSessionActivity(supabase, state.session);
  return getStateBySessionId(state.session.id);
}

export async function resetPlayerScore(rawCode: string, playerId: string) {
  const supabase = createServiceClient();
  const state = await getStateByCode(rawCode);
  await supabase.from("answers").delete().eq("session_id", state.session.id).eq("player_id", playerId);
  const { error } = await supabase
    .from("players")
    .update({ score: 0, position: 0 })
    .eq("id", playerId)
    .eq("session_id", state.session.id);
  if (error) throw error;
  await touchSessionActivity(supabase, state.session);
  return getStateBySessionId(state.session.id);
}
