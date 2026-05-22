import type { PublicQuestion } from "@/types/game";

export function QuestionCard({ question, status }: { question: PublicQuestion | null; status: string }) {
  return (
    <div className="w-full rounded-[1.7rem] border-4 border-green-950 bg-white p-4 text-green-950 shadow-[0_7px_0_rgba(0,0,0,.22)] backdrop-blur sm:p-5">
      <p className="inline-flex rounded-full border-2 border-green-950 bg-flagYellow px-3 py-1 text-xs font-black uppercase text-green-950 sm:text-sm">
        {question ? `Nível ${question.difficulty}` : status === "waiting" ? "Sala de espera" : "Pergunta"}
      </p>
      <h2 className="mt-3 text-3xl font-black leading-none sm:text-5xl md:text-6xl">
        {question?.expression ?? "Aguardando largada"}
      </h2>
    </div>
  );
}
