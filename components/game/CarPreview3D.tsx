"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";
import { CarPreviewFallback2D } from "@/components/game/CarPreviewFallback2D";
import { safeCarColor, safeCarModel, stickerLabel } from "@/lib/studentCustomization";
import type { CarModel } from "@/types/game";

type PreviewSize = "sm" | "md" | "lg" | "large";

type CarPreview3DProps = {
  color?: string | null;
  model?: string | null;
  sticker?: string | null;
  isCelebrating?: boolean;
  isActive?: boolean;
  size?: PreviewSize;
  playerName?: string | null;
  celebration?: string | null;
};

const CanvasPreview = dynamic(() => import("@/components/game/CarPreviewCanvas").then((mod) => mod.CarPreviewCanvas), {
  ssr: false,
  loading: () => <div className="grid h-full min-h-40 place-items-center text-sm font-black text-white/70">Carregando garagem 3D...</div>
});

const modelLabel: Record<CarModel, string> = {
  classic: "Clássico",
  formula: "Fórmula",
  kart: "Kart",
  future: "Futurista",
  futuristic: "Futurista",
  mini: "Turbo",
  turbo: "Turbo"
};

class PreviewErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export function CarPreview3D({ color, model, sticker, isCelebrating = false, isActive = true, size = "lg", playerName, celebration }: CarPreview3DProps) {
  const carColor = safeCarColor(color);
  const carModel = safeCarModel(model);
  const heightClass = size === "sm" ? "min-h-40 sm:min-h-56" : size === "md" ? "min-h-56 sm:min-h-72" : "min-h-64 sm:min-h-[23rem]";
  const canvasClass = size === "sm" ? "h-32 sm:h-[18.5rem]" : size === "md" ? "h-48 sm:h-[18.5rem]" : "h-56 sm:h-[18.5rem]";
  const label = modelLabel[carModel] ?? "Clássico";

  return (
    <div className={`relative overflow-hidden rounded-[1.75rem] border-2 border-white/15 bg-green-950 p-3 text-white shadow-soft sm:rounded-[2.5rem] sm:p-5 ${heightClass}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(250,204,21,.22),transparent_24%),radial-gradient(circle_at_50%_48%,rgba(85,201,107,.28),transparent_42%),linear-gradient(145deg,#052e16,#03170a_64%,#000)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute left-3 top-3 z-10 rounded-2xl border border-white/15 bg-white/10 px-3 py-1.5 sm:left-5 sm:top-5 sm:px-4 sm:py-2">
        <p className="text-[10px] font-black uppercase tracking-wide text-flagYellow">Seu carro na corrida</p>
        <p className="text-sm font-black">{playerName || "Seu carrinho"}</p>
      </div>
      <div className="absolute right-3 top-3 z-10 hidden rounded-2xl border border-white/15 bg-white/10 px-3 py-1.5 text-right sm:right-5 sm:top-5 sm:block sm:px-4 sm:py-2">
        <p className="text-[10px] font-black uppercase tracking-wide text-flagYellow">Modelo</p>
        <p className="text-sm font-black">{label}</p>
      </div>

      <div className={`relative z-0 pt-11 sm:pt-12 ${canvasClass}`}>
        <PreviewErrorBoundary fallback={<CarPreviewFallback2D color={color} model={model} sticker={sticker} />}>
          <CanvasPreview color={carColor} model={carModel} sticker={sticker} isCelebrating={isCelebrating} isActive={isActive} />
        </PreviewErrorBoundary>
      </div>

      <div className="relative z-10 mt-2 flex flex-wrap items-center justify-center gap-2">
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase text-white/80">Cor ativa</span>
        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-black uppercase text-white/80">Adesivo {stickerLabel(sticker)}</span>
        {isCelebrating ? <span className="rounded-full bg-flagYellow px-3 py-1.5 text-xs font-black uppercase text-green-950">{celebration ?? "🎉"} Boost</span> : null}
      </div>
    </div>
  );
}
