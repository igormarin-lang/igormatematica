import { Car2D } from "@/components/Car2D";
import { safeCarColor } from "@/lib/studentCustomization";

export function StudentHeroCar({
  color,
  model,
  sticker,
  editable = false,
  compact = false,
  className = ""
}: {
  color?: string | null;
  model?: string | null;
  sticker?: string | null;
  editable?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const carColor = safeCarColor(color);

  return (
    <div
      className={`relative mx-auto grid ${compact ? "h-40 w-40" : "h-56 w-56"} place-items-center rounded-full border-[7px] border-green-950 bg-green-100 shadow-[0_0_0_6px_rgba(255,255,255,.92),0_14px_0_rgba(0,0,0,.24)] ${className}`}
    >
      <div
        className="absolute inset-3 rounded-full"
        style={{
          background: `radial-gradient(circle at 34% 22%, rgba(255,255,255,.86), transparent 20%), linear-gradient(135deg, #dcfce7, ${carColor})`
        }}
      />
      <div className="absolute -left-4 top-8 grid grid-cols-2 gap-1.5 opacity-80" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className="h-4 w-4 rounded bg-white/80" />
        ))}
      </div>
      <Car2D color={color} model={model} sticker={sticker} className={compact ? "scale-[1.55]" : "scale-[2.1]"} />
      {editable ? (
        <span className="absolute -right-3 bottom-5 grid h-16 w-16 place-items-center rounded-[1.35rem] border-4 border-green-950 bg-flagYellow text-2xl shadow-[0_6px_0_rgba(0,0,0,.25)]">
          ✎
        </span>
      ) : null}
    </div>
  );
}
