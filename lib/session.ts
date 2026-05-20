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
  return [...players].sort((a, b) => b.position - a.position || b.score - a.score || a.name.localeCompare(b.name));
}

export function buildGameState(args: {
  session: Session;
  players: Player[];
  question: Question | null;
  answers: Answer[];
}): GameState {
  const answeredPlayerIds = new Set(args.answers.map((answer) => answer.player_id));
  const players = args.players.map((player) => ({
    ...player,
    answered_current_round: answeredPlayerIds.has(player.id)
  }));
  const ranking = sortPlayers(players);
  const winner = args.session.winner_player_id
    ? players.find((player) => player.id === args.session.winner_player_id) ?? null
    : args.session.status === "finished"
      ? ranking[0] ?? null
      : null;

  return {
    session: args.session,
    players,
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
    answeredCount: args.answers.length,
    winner
  };
}
