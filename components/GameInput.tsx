import type { InputHTMLAttributes } from "react";

export function GameInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-14 w-full rounded-[1.15rem] border-[3px] border-green-950 bg-white px-4 text-center text-xl font-black text-green-950 shadow-[0_5px_0_rgba(0,0,0,0.18)] outline-none transition placeholder:text-green-900/35 focus:border-flagYellow focus:ring-4 focus:ring-flagYellow/35 disabled:bg-slate-100 disabled:text-slate-500 sm:h-16 sm:rounded-[1.35rem] sm:border-4 sm:text-2xl sm:shadow-[0_6px_0_rgba(0,0,0,0.18)] ${className}`}
      {...props}
    />
  );
}
