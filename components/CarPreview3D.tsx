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
  const sleek = carModel === "formula" || carModel === "future";
  const mini = carModel === "mini" || carModel === "kart";

  return (
    <div className={`relative grid min-h-72 place-items-center overflow-hidden rounded-[2.25rem] border-2 border-white/15 p-6 ${success ? "confetti" : ""}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(250,204,21,.22),transparent_28%),radial-gradient(circle_at_center,rgba(85,201,107,.32),transparent_48%),linear-gradient(135deg,#052e16,#03170a)]" />
      <div className="absolute right-5 top-5 grid h-16 w-16 place-items-center rounded-[1.35rem] border-4 border-green-950 bg-white/95 text-2xl shadow-[0_6px_0_rgba(0,0,0,.25)]">
        {celebration ?? "🎉"}
      </div>
      <div className="absolute bottom-12 h-24 w-80 rounded-[50%] border-2 border-white/20 bg-white/12 shadow-[0_22px_50px_rgba(0,0,0,.35)] [transform:rotateX(68deg)]" />
      <div className="relative h-40 w-72 animate-[pulse_2.8s_ease-in-out_infinite] [perspective:900px]">
        <div className="absolute inset-0 [transform:rotateX(56deg)_rotateZ(-20deg)] [transform-style:preserve-3d]">
          <span
            className={`absolute bottom-10 left-7 right-6 h-16 border-[5px] border-green-950 shadow-2xl ${
              sleek ? "rounded-[56px_86px_20px_20px]" : mini ? "rounded-[34px_38px_18px_18px]" : "rounded-[48px_60px_22px_22px]"
            }`}
            style={{ background: `linear-gradient(135deg, rgba(255,255,255,.42), transparent 34%), ${carColor}` }}
          />
          <span className="absolute left-24 top-6 h-14 w-24 rounded-t-[40px] rounded-b-xl border-4 border-green-950 bg-white [transform:translateZ(30px)]" />
          <span className="absolute bottom-12 right-0 h-10 w-16 rounded-r-[38px] rounded-l-xl border-4 border-green-950" style={{ backgroundColor: carColor }} />
          <span className="absolute bottom-14 left-1 h-9 w-12 rounded-l-[30px] border-4 border-green-950 bg-flagYellow" />
          <span className="absolute bottom-14 left-[122px] z-10 text-2xl font-black text-green-950 [transform:translateZ(36px)]">{stickerLabel(sticker)}</span>
          <span className="absolute bottom-4 left-12 h-12 w-12 rounded-full border-[10px] border-slate-300 bg-black [transform:translateZ(22px)]" />
          <span className="absolute bottom-4 right-12 h-12 w-12 rounded-full border-[10px] border-slate-300 bg-black [transform:translateZ(22px)]" />
        </div>
      </div>
    </div>
  );
}
