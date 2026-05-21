import { safeCarColor, safeCarModel, stickerLabel } from "@/lib/studentCustomization";

export function CarPreviewFallback2D({ color, model, sticker }: { color?: string | null; model?: string | null; sticker?: string | null }) {
  const carColor = safeCarColor(color);
  const carModel = safeCarModel(model);
  const sleek = carModel === "formula" || carModel === "futuristic" || carModel === "future";
  const compact = carModel === "turbo" || carModel === "mini" || carModel === "kart";

  return (
    <div className="grid h-full min-h-64 place-items-center">
      <div className="relative h-44 w-80">
        <div className="absolute bottom-0 left-6 right-6 h-12 rounded-[50%] bg-black/30 blur-xl" />
        <div
          className={`absolute bottom-14 left-8 right-8 h-20 border-[8px] border-green-950 shadow-2xl ${
            sleek ? "rounded-[70px_110px_24px_24px]" : compact ? "rounded-[40px_50px_24px_24px]" : "rounded-[62px_78px_28px_28px]"
          }`}
          style={{ background: `linear-gradient(135deg, rgba(255,255,255,.42), transparent 34%), ${carColor}` }}
        />
        <div className="absolute bottom-24 left-32 h-16 w-28 rounded-t-[46px] rounded-b-2xl border-[7px] border-green-950 bg-cyan-100" />
        <div className="absolute bottom-[4.6rem] left-[8.8rem] rounded-xl border-4 border-green-950 bg-white px-3 py-1 text-xl font-black text-green-950">
          {stickerLabel(sticker)}
        </div>
        <div className="absolute bottom-10 left-16 h-16 w-16 rounded-full border-[14px] border-slate-300 bg-black" />
        <div className="absolute bottom-10 right-16 h-16 w-16 rounded-full border-[14px] border-slate-300 bg-black" />
      </div>
    </div>
  );
}
