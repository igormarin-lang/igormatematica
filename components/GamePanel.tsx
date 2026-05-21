import type { ReactNode } from "react";

export function GamePanel({
  children,
  className = "",
  tone = "light"
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark" | "green";
}) {
  const toneClass =
    tone === "dark"
      ? "bg-green-950/88 text-white border-white/15"
      : tone === "green"
        ? "bg-green-100 text-green-950 border-green-950/20"
        : "bg-white text-green-950 border-green-950/15";

  return (
    <section className={`rounded-[2rem] border-2 p-5 shadow-soft backdrop-blur sm:p-6 ${toneClass} ${className}`}>
      {children}
    </section>
  );
}
