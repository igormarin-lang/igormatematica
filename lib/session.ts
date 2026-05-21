import type { Answer, GameState, Player, PlayerWithAnswered, Question, Session } from "@/types/game";

const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function createSessionCode() {
  return Array.from({ length: 4 }, () => ROOM_ALPHABET[Math.floor(Math.random() * ROOM_ALPHABET.length)]).join("");
}

export function sanitizeCode(code: string) {
  return code.trim().toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
}

export function sanitizePlayerName(name: string) {
  return name.trim().replace(/\s+/g, " ").slice(0, 24);
}

export function sortPlayers(players: PlayerWithAnswered[]) {
  return [...players].sort((a, b) => b.score - a.score || b.correct_answers - a.correct_answers || a.name.localeCompare(b.name));
}

export function buildGameState(args: {
  session: Session;
  players: Player[];
  question: Question | null;
  answers: Answer[];
  allAnswers?: Answer[];
}): GameState {
  const answeredPlayerIds = new Set(args.answers.map((answer) => answer.player_id));
  const correctByPlayer = new Map<string, number>();
  for (const answer of args.allAnswers ?? args.answers) {
    if (answer.is_correct) {
      correctByPlayer.set(answer.player_id, (correctByPlayer.get(answer.player_id) ?? 0) + 1);
    }
  }
  const allPlayers = args.players.map((player) => ({
    ...player,
    status: player.status ?? "active",
    answered_current_round: answeredPlayerIds.has(player.id),
    correct_answers: correctByPlayer.get(player.id) ?? 0
  }));
  const players = allPlayers.filter((player) => (player.status ?? "active") === "active");
  const removedPlayers = allPlayers.filter((player) => (player.status ?? "active") !== "active");
  const activePlayerIds = new Set(players.map((player) => player.id));
  const activeAnsweredCount = args.answers.filter((answer) => activePlayerIds.has(answer.player_id)).length;
  const ranking = sortPlayers(players);
  const winner = args.session.winner_player_id
    ? players.find((player) => player.id === args.session.winner_player_id) ?? null
    : args.session.status === "finished"
      ? ranking[0] ?? null
      : null;

  return {
    session: args.session,
    players,
    removedPlayers,
    question: args.question
      ? {
          id: args.question.id,
          session_id: args.question.session_id,
          round_number: args.question.round_number,
          expression: args.question.expression,
          difficulty: args.question.difficulty
        }
      : null,
    ranking,
    answeredCount: activeAnsweredCount,
    winner
  };
}
