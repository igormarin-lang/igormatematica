export type GameStatus = "waiting" | "running" | "paused" | "finished";
export type Difficulty = "facil" | "medio" | "dificil";
export type CarModel = "classic" | "formula" | "kart" | "future" | "mini";
export type StudentTheme = "if-green" | "neon" | "classroom" | "arcade" | "minimal";

export type Session = {
  id: string;
  code: string;
  status: GameStatus;
  total_rounds: number;
  current_round: number;
  question_started_at: string | null;
  question_ends_at: string | null;
  winner_player_id: string | null;
  created_at: string;
};

export type Player = {
  id: string;
  session_id: string;
  name: string;
  score: number;
  position: number;
  car_color: string | null;
  car_model: CarModel | string | null;
  car_sticker: string | null;
  celebration_emoji: string | null;
  student_theme: StudentTheme | string | null;
  joined_at: string;
};

export type Question = {
  id: string;
  session_id: string;
  round_number: number;
  expression: string;
  correct_answer?: number;
  difficulty: Difficulty;
};

export type Answer = {
  id: string;
  session_id: string;
  player_id: string;
  question_id: string;
  round_number: number;
  answer: number;
  is_correct: boolean;
  points_awarded: number;
  answered_at: string;
};

export type PublicQuestion = Omit<Question, "correct_answer">;

export type PlayerWithAnswered = Player & {
  answered_current_round: boolean;
};

export type GameState = {
  session: Session;
  players: PlayerWithAnswered[];
  question: PublicQuestion | null;
  ranking: PlayerWithAnswered[];
  answeredCount: number;
  winner: Player | null;
};
