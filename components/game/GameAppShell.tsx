import type { ReactNode } from "react";

export function GameAppShell({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main className={`game-stage-bg game-stage-shell flex h-[100dvh] w-screen items-center justify-center overflow-hidden p-1.5 text-white sm:p-4 ${className}`}>
      {children}
    </main>
  );
}
