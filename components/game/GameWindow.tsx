import type { ReactNode } from "react";

export function GameWindow({
  children,
  className = "",
  compact = false
}: {
  children: ReactNode;
  className?: string;
  compact?: boolean;
}) {
  return (
    <section
      className={`game-window relative flex h-full w-full max-w-[1280px] flex-col overflow-hidden rounded-[2rem] border-4 border-green-950/90 bg-green-800/78 shadow-[0_16px_0_rgba(0,0,0,.34),0_28px_72px_rgba(0,0,0,.38)] ring-2 ring-white/18 backdrop-blur md:h-[min(760px,calc(100dvh-32px))] ${
        compact ? "p-3 sm:p-4" : "p-4 sm:p-5"
      } ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,rgba(250,204,21,.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,.08),transparent_36%)]" />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">{children}</div>
    </section>
  );
}

