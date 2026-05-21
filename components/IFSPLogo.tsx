import Image from "next/image";

type IFSPLogoProps = {
  variant?: "color" | "white";
  compact?: boolean;
  className?: string;
};

export function IFSPLogo({ variant = "color", compact = false, className = "" }: IFSPLogoProps) {
  const src =
    variant === "white"
      ? "/brand/ifsp-simplificada-horizontal-branca.png"
      : "/brand/ifsp-simplificada-horizontal.png";

  return (
    <div
      className={`inline-flex items-center rounded-2xl ${
        variant === "white" ? "bg-transparent" : "bg-white p-2.5 shadow-sm ring-1 ring-slate-200"
      } ${className}`}
    >
      <Image
        src={src}
        alt="Instituto Federal de São Paulo"
        width={351}
        height={124}
        className={`${compact ? "h-10 sm:h-12" : "h-12 sm:h-14"} w-auto object-contain`}
        priority={variant === "white"}
      />
    </div>
  );
}
