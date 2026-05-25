import type { ReactNode } from "react";

export function FixedBottomActions({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`sticky bottom-0 z-20 -mx-3 mt-auto border-t border-green-950/10 bg-white/96 px-3 py-2 backdrop-blur sm:-mx-5 sm:px-5 sm:py-4 ${className}`}>
      {children}
    </div>
  );
}
