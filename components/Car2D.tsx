import { safeCarColor, safeCarModel, stickerLabel } from "@/lib/studentCustomization";

export function Car2D({
  color,
  model,
  sticker,
  className = ""
}: {
  color?: string | null;
  model?: string | null;
  sticker?: string | null;
  className?: string;
}) {
  const carColor = safeCarColor(color);
  const carModel = safeCarModel(model);
  const isFormula = carModel === "formula" || carModel === "future";
  const isMini = carModel === "mini" || carModel === "kart";

  return (
    <span className={`relative block h-11 ${isMini ? "w-16" : "w-20"} ${className}`} aria-hidden="true">
      <span
        className={`absolute bottom-2 left-1 right-1 h-7 border-[3px] border-white/85 shadow-lg ${
          isFormula ? "rounded-[28px_40px_14px_14px]" : "rounded-[20px_28px_12px_12px]"
        }`}
        style={{ backgroundColor: carColor }}
      />
      <span className="absolute left-[38%] top-0 h-6 w-7 rounded-t-2xl rounded-b-md bg-white/85" />
      {isFormula ? <span className="absolute -right-1 bottom-4 h-5 w-5 rounded-r-full border-2 border-white/70" style={{ backgroundColor: carColor }} /> : null}
      <span className="absolute left-[43%] top-4 z-10 text-xs font-black">{stickerLabel(sticker)}</span>
      <span className="absolute bottom-0 left-3 h-4 w-4 rounded-full border-4 border-slate-400 bg-slate-950" />
      <span className="absolute bottom-0 right-3 h-4 w-4 rounded-full border-4 border-slate-400 bg-slate-950" />
    </span>
  );
}

