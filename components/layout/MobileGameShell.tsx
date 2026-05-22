import type { ReactNode } from "react";

export function MobileGameShell({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return <main className={`game-mobile-bg h-[100dvh] overflow-hidden px-4 py-4 text-white sm:px-5 ${className}`}>{children}</main>;
}
