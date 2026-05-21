import { safeCarColor, safeCarModel, stickerLabel } from "@/lib/studentCustomization";

export function CarPreview3D({
  color,
  model,
  sticker,
  celebration,
  success = false
}: {
  color?: string | null;
  model?: string | null;
  sticker?: string | null;
  celebration?: string | null;
  success?: boolean;
}) {
  const carColor = safeCarColor(color);
  const carModel = safeCarModel(model);

  return (
    <div className={`relative grid min-h-64 place-items-center overflow-hidden rounded-[2rem] p-6 ${success ? "confetti" : ""}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,158,65,.24),transparent_45%),linear-gradient(135deg,#020a05,#052e16)]" />
      <div className="absolute bottom-12 h-20 w-72 rounded-[50%] border border-white/15 bg-white/10 [transform:rotateX(68deg)]" />
      <div className="relative h-32 w-64 animate-[pulse_2.8s_ease-in-out_infinite] [perspective:900px]">
        <div className="absolute inset-0 [transform:rotateX(56deg)_rotateZ(-22deg)] [transform-style:preserve-3d]">
          <span
            className={`absolute bottom-9 left-7 right-6 h-14 border-4 border-white/80 shadow-2xl ${
              carModel === "formula" || carModel === "future" ? "rounded-[48px_70px_20px_20px]" : "rounded-[46px_54px_22px_22px]"
            }`}
            style={{ background: `linear-gradient(135deg, rgba(255,255,255,.28), transparent 32%), ${carColor}` }}
          />
          <span className="absolute left-24 top-5 h-14 w-20 rounded-t-[40px] rounded-b-xl bg-white/85 [transform:translateZ(28px)]" />
          <span className="absolute bottom-11 right-1 h-9 w-14 rounded-r-[34px] rounded-l-xl border-4 border-white/70" style={{ backgroundColor: carColor }} />
          <span className="absolute bottom-12 left-0 h-8 w-11 rounded-l-[30px] bg-slate-950" />
          <span className="absolute bottom-14 left-[116px] z-10 text-2xl font-black [transform:translateZ(34px)]">{stickerLabel(sticker)}</span>
          <span className="absolute bottom-4 left-12 h-10 w-10 rounded-full border-8 border-slate-400 bg-black [transform:translateZ(20px)]" />
          <span className="absolute bottom-4 right-12 h-10 w-10 rounded-full border-8 border-slate-400 bg-black [transform:translateZ(20px)]" />
        </div>
      </div>
      <span className="absolute right-5 top-5 rounded-full bg-white/15 px-4 py-2 text-2xl ring-1 ring-white/10">{celebration ?? "🎉"}</span>
    </div>
  );
}

