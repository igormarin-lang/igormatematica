import type { ReactNode } from "react";

export function GameTopBar({
  title = "Corrida das Expressões",
  subtitle,
  left,
  right,
  className = ""
}: {
  title?: string;
  subtitle?: string;
  left?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <header className={`grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-3 ${className}`}>
      <div className="flex min-w-11 items-center gap-2 sm:min-w-12">{left}</div>
      <div className="min-w-0 text-center">
        <h1 className="game-title truncate text-[clamp(0.9rem,3.6vw,1.1rem)] font-black leading-none sm:text-5xl">{title}</h1>
        {subtitle ? <p className="mt-1 truncate text-[0.62rem] font-black uppercase tracking-wide text-white/82 sm:text-sm">{subtitle}</p> : null}
      </div>
      <div className="flex min-w-11 items-center justify-end gap-2 sm:min-w-12">{right}</div>
    </header>
  );
}
