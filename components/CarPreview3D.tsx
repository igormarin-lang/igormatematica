import { CarPreview3D as GameCarPreview3D } from "@/components/game/CarPreview3D";

export function CarPreview3D({
  color,
  model,
  sticker,
  celebration,
  success = false,
  isActive = true,
  playerName,
  size = "lg"
}: {
  color?: string | null;
  model?: string | null;
  sticker?: string | null;
  celebration?: string | null;
  success?: boolean;
  isActive?: boolean;
  playerName?: string | null;
  size?: "sm" | "md" | "lg" | "large";
}) {
  return (
    <GameCarPreview3D
      color={color}
      model={model}
      sticker={sticker}
      celebration={celebration}
      isCelebrating={success}
      isActive={isActive}
      playerName={playerName}
      size={size}
    />
  );
}
