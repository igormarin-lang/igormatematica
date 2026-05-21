import type { PublicQuestion } from "@/types/game";

export function QuestionCard({ question, status }: { question: PublicQuestion | null; status: string }) {
  return (
    <div className="w-full rounded-[1.75rem] bg-white/95 p-5 shadow-soft ring-1 ring-slate-200 backdrop-blur sm:p-6">
      <p className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-black uppercase text-raceRed ring-1 ring-red-100 sm:text-sm">
        {question ? `Nível ${question.difficulty}` : status === "waiting" ? "Sala de espera" : "Pergunta"}
      </p>
      <h2 className="mt-2 text-4xl font-black leading-none text-slate-950 sm:text-6xl md:text-7xl">
        {question?.expression ?? "Aguardando início"}
      </h2>
    </div>
  );
}
