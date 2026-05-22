import type { ReactNode } from "react";

export function ScrollAreaContent({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 ${className}`}>{children}</div>;
}
