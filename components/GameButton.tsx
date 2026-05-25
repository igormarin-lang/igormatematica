import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

const variants = {
  primary: "bg-flagYellow text-green-950 border-green-950 shadow-[0_7px_0_rgba(0,0,0,0.28)]",
  green: "bg-ifGreen text-white border-green-950 shadow-[0_7px_0_rgba(0,0,0,0.28)]",
  white: "bg-white text-green-950 border-green-950 shadow-[0_7px_0_rgba(0,0,0,0.24)]",
  red: "bg-raceRed text-white border-green-950 shadow-[0_7px_0_rgba(0,0,0,0.28)]"
};

type Variant = keyof typeof variants;

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[1.15rem] border-[3px] px-4 py-2.5 text-center text-sm font-black uppercase transition hover:-translate-y-0.5 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0 disabled:active:translate-y-0 sm:min-h-14 sm:gap-3 sm:rounded-[1.4rem] sm:border-4 sm:px-6 sm:py-3 sm:text-base";

export function GameButton({
  icon,
  className = "",
  variant = "primary",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon?: ReactNode; variant?: Variant }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {icon ? <span className="text-xl leading-none">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
}

export function GameButtonLink({
  icon,
  className = "",
  variant = "white",
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; icon?: ReactNode; variant?: Variant }) {
  return (
    <Link className={`${base} ${variants[variant]} ${className}`} {...props}>
      {icon ? <span className="text-xl leading-none">{icon}</span> : null}
      <span>{children}</span>
    </Link>
  );
}
