import { MiniRaceCar2D } from "@/components/game/MiniRaceCar2D";

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
  return <MiniRaceCar2D color={color} model={model} sticker={sticker} className={className} />;
}
