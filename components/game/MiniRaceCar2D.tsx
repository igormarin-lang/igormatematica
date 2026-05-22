import { memo } from "react";
import { safeCarColor, safeCarModel, stickerLabel } from "@/lib/studentCustomization";

function MiniRaceCar2DBase({ color, model, sticker, className = "" }: { color?: string | null; model?: string | null; sticker?: string | null; className?: string }) {
  const carColor = safeCarColor(color);
  const carModel = safeCarModel(model);
  const formula = carModel === "formula" || carModel === "futuristic" || carModel === "future";
  const compact = carModel === "kart" || carModel === "turbo" || carModel === "mini";

  return (
    <span className={`relative block h-12 ${compact ? "w-[4.6rem]" : "w-[5.4rem]"} transition-transform duration-500 ${className}`} aria-hidden="true">
      {formula ? <span className="absolute -right-1 bottom-5 h-5 w-5 rounded-r-full border-[3px] border-green-950" style={{ backgroundColor: carColor }} /> : null}
      <span
        className={`absolute bottom-2 left-1 right-1 h-8 border-[3px] border-green-950 shadow-lg ${
          formula ? "rounded-[32px_46px_14px_14px]" : compact ? "rounded-[18px_22px_12px_12px]" : "rounded-[22px_30px_12px_12px]"
        }`}
        style={{ background: `linear-gradient(135deg, rgba(255,255,255,.45), transparent 34%), ${carColor}` }}
      />
      <span className="absolute left-[38%] top-0 h-7 w-8 rounded-t-2xl rounded-b-lg border-[3px] border-green-950 bg-cyan-100" />
      <span className="absolute left-[42%] top-5 z-10 text-xs font-black text-green-950">{stickerLabel(sticker)}</span>
      <span className="absolute bottom-0 left-3 h-5 w-5 rounded-full border-[5px] border-slate-300 bg-slate-950" />
      <span className="absolute bottom-0 right-3 h-5 w-5 rounded-full border-[5px] border-slate-300 bg-slate-950" />
      <span className="absolute bottom-4 left-0 h-2 w-3 rounded-full bg-flagYellow" />
    </span>
  );
}

export const MiniRaceCar2D = memo(MiniRaceCar2DBase);
MiniRaceCar2D.displayName = "MiniRaceCar2D";
