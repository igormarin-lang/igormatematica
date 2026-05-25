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
      className={`grid h-11 w-11 place-items-center rounded-xl border-[3px] border-green-950 bg-white text-lg font-black text-green-950 shadow-[0_4px_0_rgba(0,0,0,.25)] transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none sm:h-12 sm:w-12 sm:rounded-2xl sm:border-4 sm:text-xl sm:shadow-[0_5px_0_rgba(0,0,0,.25)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
