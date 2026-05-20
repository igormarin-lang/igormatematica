import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";

const base =
  "inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-center font-extrabold transition active:scale-[0.99] hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:active:scale-100";

const variants = {
  primary: "bg-raceRed text-white shadow-lg shadow-red-500/25",
  secondary: "bg-raceBlue text-white shadow-lg shadow-blue-900/15",
  quiet: "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200",
  ghost: "bg-transparent text-raceBlue underline-offset-4 hover:underline"
};

type Variant = keyof typeof variants;

export function Button({
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function ButtonLink({
  className = "",
  variant = "primary",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
