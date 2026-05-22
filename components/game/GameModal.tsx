"use client";

import type { ReactNode } from "react";
import { GameIconButton } from "@/components/game/GameIconButton";

export function GameModal({
  open,
  title,
  children,
  onClose
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 grid place-items-center bg-green-950/78 p-3 backdrop-blur-sm">
      <section className="game-window-in flex max-h-full w-full max-w-3xl flex-col overflow-hidden rounded-[2rem] border-4 border-green-950 bg-green-800 text-white shadow-[0_14px_0_rgba(0,0,0,.35)]">
        <header className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-white/15 bg-green-950/55 px-4 py-3">
          <h2 className="text-2xl font-black">{title}</h2>
          <GameIconButton label="Fechar" onClick={onClose} className="h-11 w-11">
            ×
          </GameIconButton>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      </section>
    </div>
  );
}

