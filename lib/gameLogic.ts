import { createServiceClient } from "@/lib/supabase/server";
import { generateQuestions } from "@/lib/mathQuestions";
import { buildGameState, createSessionCode, sanitizeCode, sanitizePlayerName } from "@/lib/session";
import type { Answer, GameState, Player, Question, Session } from "@/types/game";

const QUESTION_SECONDS = 20;

function ensureNumber(value: unknown, fallback: number) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
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
  return session;
}

export async function createSession(totalRounds: number) {
  const supabase = createServiceClient();
  const rounds = [5, 10, 15, 20].includes(totalRounds) ? totalRounds : 10;
  const code = await uniqueSessionCode(supabase);

  const { data: session, error } = await supabase
    .from("sessions")
    .insert({ code, total_rounds: rounds, status: "waiting", current_round: 0 })
    .select("*")
    .single<Session>();

  if (error) throw error;

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

  const [{ data: players, error: playerError }, { data: question, error: questionError }, { data: answers, error: answerError }] =
    await Promise.all([
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
        : Promise.resolve({ data: [], error: null })
    ]);

  if (playerError) throw playerError;
  if (questionError) throw questionError;
  if (answerError) throw answerError;

  return buildGameState({
    session,
    players: players ?? [],
    question: question ?? null,
    answers: answers ?? []
  });
}

export async function joinSession(rawCode: string, rawName: string) {
  const supabase = createServiceClient();
  const code = sanitizeCode(rawCode);
  const name = sanitizePlayerName(rawName);

  if (!name) throw new Error("Digite seu nome.");

  const { data: session, error } = await supabase.from("sessions").select("*").eq("code", code).maybeSingle<Session>();
  if (error) throw error;
  if (!session) throw new Error("Código da sessão não encontrado.");
  if (session.status !== "waiting") throw new Error("A corrida já começou.");

  const { data: player, error: playerError } = await supabase
    .from("players")
    .insert({ session_id: session.id, name })
    .select("*")
    .single<Player>();

  if (playerError) throw playerError;
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

  const { error } = await supabase
    .from("sessions")
    .update({
      status: "running",
      current_round: nextRound,
      question_started_at: now.toISOString(),
      question_ends_at: endsAt.toISOString()
    })
    .eq("id", state.session.id);

  if (error) throw error;
  return getStateBySessionId(state.session.id);
}

export async function pauseSession(rawCode: string) {
  const supabase = createServiceClient();
  const state = await getStateByCode(rawCode);
  const { error } = await supabase.from("sessions").update({ status: "paused" }).eq("id", state.session.id);
  if (error) throw error;
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
  await supabase.from("players").update({ score: 0, position: 0 }).eq("session_id", state.session.id);
  await supabase.from("questions").insert(questions);

  const { error } = await supabase
    .from("sessions")
    .update({
      status: "waiting",
      current_round: 0,
      winner_player_id: null,
      question_started_at: null,
      question_ends_at: null
    })
    .eq("id", state.session.id);

  if (error) throw error;
  return getStateBySessionId(state.session.id);
}

export async function finishSession(rawCode: string) {
  const supabase = createServiceClient();
  const state = await getStateByCode(rawCode);
  const winner = state.ranking[0] ?? null;
  const { error } = await supabase
    .from("sessions")
    .update({
      status: "finished",
      winner_player_id: winner?.id ?? null,
      question_ends_at: null
    })
    .eq("id", state.session.id);

  if (error) throw error;
  return getStateBySessionId(state.session.id);
}

export async function submitAnswer(rawCode: string, playerId: string, value: unknown) {
  const supabase = createServiceClient();
  const state = await getStateByCode(rawCode);

  if (state.session.status !== "running" || !state.question) throw new Error("Aguarde a próxima pergunta.");
  if (new Date(state.session.question_ends_at ?? 0).getTime() < Date.now()) {
    return advanceRound(rawCode);
  }

  const answer = ensureNumber(value, Number.NaN);
  if (!Number.isInteger(answer)) throw new Error("Digite apenas números inteiros.");

  const player = state.players.find((item) => item.id === playerId);
  if (!player) throw new Error("Aluno não encontrado nesta sessão.");
  if (player.answered_current_round) throw new Error("Você já respondeu esta rodada.");

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
  const nextPosition = Math.min(state.session.total_rounds, player.position + points);
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

  if (points > 0) {
    const { error: playerError } = await supabase
      .from("players")
      .update({ score: nextScore, position: nextPosition })
      .eq("id", player.id);
    if (playerError) throw playerError;
  }

  if (nextPosition >= state.session.total_rounds) {
    const { error } = await supabase
      .from("sessions")
      .update({ status: "finished", winner_player_id: player.id, question_ends_at: null })
      .eq("id", state.session.id);
    if (error) throw error;
    return { correct: isCorrect, points, state: await getStateBySessionId(state.session.id) };
  }

  const updatedState = await getStateBySessionId(state.session.id);
  if (updatedState.answeredCount >= updatedState.players.length) {
    await advanceRound(rawCode);
  }

  return { correct: isCorrect, points, state: await getStateBySessionId(state.session.id) };
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
  const { error } = await supabase
    .from("sessions")
    .update({
      current_round: state.session.current_round + 1,
      question_started_at: now.toISOString(),
      question_ends_at: endsAt.toISOString()
    })
    .eq("id", state.session.id);

  if (error) throw error;
  return getStateBySessionId(state.session.id);
}

export async function autoAdvanceIfNeeded(session: Session) {
  if (session.status !== "running" || !session.question_ends_at) return;
  if (new Date(session.question_ends_at).getTime() > Date.now()) return;
  await advanceRound(session.code);
}
