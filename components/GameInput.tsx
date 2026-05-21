import type { InputHTMLAttributes } from "react";

export function GameInput({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`h-16 w-full rounded-[1.35rem] border-4 border-green-950 bg-white px-4 text-center text-2xl font-black text-green-950 shadow-[0_6px_0_rgba(0,0,0,0.18)] outline-none transition placeholder:text-green-900/35 focus:border-flagYellow focus:ring-4 focus:ring-flagYellow/35 disabled:bg-slate-100 disabled:text-slate-500 ${className}`}
      {...props}
    />
  );
}
