import type { ReactNode } from "react";

export function GameHeaderCompact({
  title,
  subtitle,
  right,
  className = ""
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`flex min-h-14 items-center justify-between gap-3 rounded-[1.5rem] border-2 border-white/15 bg-green-950/80 px-4 py-3 text-white shadow-soft ${className}`}>
      <div className="min-w-0">
        {subtitle ? <p className="truncate text-[11px] font-black uppercase tracking-wide text-flagYellow">{subtitle}</p> : null}
        <h1 className="truncate text-xl font-black leading-tight sm:text-2xl">{title}</h1>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </header>
  );
}
