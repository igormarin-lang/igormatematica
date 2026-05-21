import type { ReactNode } from "react";

export function EmptyState({
  eyebrow = "Corrida das Expressões",
  title,
  children
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-white/85 p-7 shadow-soft ring-1 ring-slate-200">
      <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-ifGreen/10" />
      <div className="absolute -bottom-10 left-8 h-24 w-24 rotate-12 rounded-3xl bg-raceRed/10" />
      <div className="relative">
        <p className="text-xs font-black uppercase text-raceRed">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">{title}</h2>
        <div className="mt-3 text-base font-semibold leading-7 text-slate-600">{children}</div>
      </div>
    </div>
  );
}

