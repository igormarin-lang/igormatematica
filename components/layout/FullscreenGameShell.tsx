import type { ReactNode } from "react";

export function FullscreenGameShell({
  children,
  className = "",
  contentClassName = ""
}: {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <main className={`game-mobile-bg h-[100dvh] overflow-hidden text-white ${className}`}>
      <div className={`mx-auto flex h-full w-full max-w-[1440px] flex-col px-4 py-4 sm:px-5 lg:px-6 ${contentClassName}`}>{children}</div>
    </main>
  );
}
