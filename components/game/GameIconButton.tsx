import type { ButtonHTMLAttributes, ReactNode } from "react";

export function GameIconButton({
  children,
  label,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`grid h-12 w-12 place-items-center rounded-2xl border-4 border-green-950 bg-white text-xl font-black text-green-950 shadow-[0_5px_0_rgba(0,0,0,.25)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

