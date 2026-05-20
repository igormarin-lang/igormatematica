import type { PublicQuestion } from "@/types/game";

export function QuestionCard({ question, status }: { question: PublicQuestion | null; status: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-200">
      <p className="text-sm font-black uppercase text-raceRed">
        {question ? `Nível ${question.difficulty}` : status === "waiting" ? "Sala de espera" : "Pergunta"}
      </p>
      <h2 className="mt-2 text-4xl font-black leading-none text-slate-950 sm:text-6xl">
        {question?.expression ?? "Aguardando início"}
      </h2>
    </div>
  );
}
