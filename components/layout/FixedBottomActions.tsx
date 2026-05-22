import type { ReactNode } from "react";

export function FixedBottomActions({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`sticky bottom-0 z-20 -mx-5 mt-auto border-t border-green-950/10 bg-white/96 px-5 py-4 backdrop-blur ${className}`}>
      {children}
    </div>
  );
}
