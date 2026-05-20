import type { Difficulty, Question } from "@/types/game";

type GeneratedQuestion = Pick<Question, "expression" | "difficulty"> & {
  correct_answer: number;
};

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateQuestion(): GeneratedQuestion {
  const type = rand(1, 8);
  let a = 0;
  let b = 0;
  let c = 0;
  let difficulty: Difficulty = "facil";

  if (type === 1) {
    a = rand(2, 20);
    b = rand(1, 15);
    return { expression: `${a} + ${b}`, correct_answer: a + b, difficulty };
  }

  if (type === 2) {
    a = rand(8, 28);
    b = rand(1, a - 1);
    return { expression: `${a} - ${b}`, correct_answer: a - b, difficulty };
  }

  if (type === 3) {
    a = rand(2, 10);
    b = rand(2, 9);
    difficulty = a * b > 45 ? "medio" : "facil";
    return { expression: `${a} × ${b}`, correct_answer: a * b, difficulty };
  }

  if (type === 4) {
    b = rand(2, 9);
    const answer = rand(2, 10);
    a = b * answer;
    return { expression: `${a} ÷ ${b}`, correct_answer: answer, difficulty: "medio" };
  }

  if (type === 5) {
    a = rand(2, 12);
    b = rand(2, 6);
    c = rand(2, 5);
    return { expression: `${a} + ${b} × ${c}`, correct_answer: a + b * c, difficulty: "medio" };
  }

  if (type === 6) {
    b = rand(2, 6);
    const divisionAnswer = rand(2, 8);
    a = b * divisionAnswer;
    c = rand(2, 12);
    return { expression: `${a} ÷ ${b} + ${c}`, correct_answer: divisionAnswer + c, difficulty: "medio" };
  }

  if (type === 7) {
    a = rand(2, 7);
    b = rand(2, 6);
    c = rand(1, 12);
    return { expression: `${a} × ${b} + ${c}`, correct_answer: a * b + c, difficulty: "medio" };
  }

  a = rand(2, 10);
  b = rand(2, 8);
  c = rand(2, 4);
  return { expression: `(${a} + ${b}) × ${c}`, correct_answer: (a + b) * c, difficulty: "dificil" };
}

export function generateQuestions(totalRounds: number) {
  return Array.from({ length: totalRounds }, (_, index) => ({
    ...generateQuestion(),
    round_number: index + 1
  }));
}
