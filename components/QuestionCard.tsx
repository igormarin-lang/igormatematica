import type { PublicQuestion } from "@/types/game";

export function QuestionCard({ question, status }: { question: PublicQuestion | null; status: string }) {
  return (
    <div className="w-full rounded-[1.35rem] border-[3px] border-green-950 bg-white p-3 text-green-950 shadow-[0_5px_0_rgba(0,0,0,.22)] backdrop-blur sm:rounded-[1.7rem] sm:border-4 sm:p-5 sm:shadow-[0_7px_0_rgba(0,0,0,.22)]">
      <p className="inline-flex rounded-full border-2 border-green-950 bg-flagYellow px-3 py-1 text-[11px] font-black uppercase text-green-950 sm:text-sm">
        {question ? `Nível ${question.difficulty}` : status === "waiting" ? "Sala de espera" : "Pergunta"}
      </p>
      <h2 className="mt-2 text-[clamp(2rem,11vw,3rem)] font-black leading-none sm:mt-3 sm:text-5xl md:text-6xl">
        {question?.expression ?? "Aguardando largada"}
      </h2>
    </div>
  );
}
