export function StatCard({ label, value, tone = "light" }: { label: string; value: string | number; tone?: "light" | "dark" }) {
  return (
    <div
      className={
        tone === "dark"
          ? "rounded-[1.5rem] bg-white/10 p-4 text-white ring-1 ring-white/10"
          : "rounded-[1.5rem] bg-white p-4 text-slate-950 shadow-sm ring-1 ring-slate-200"
      }
    >
      <strong className="block text-2xl font-black leading-none sm:text-3xl">{value}</strong>
      <span className={tone === "dark" ? "mt-1 block text-sm font-bold text-white/70" : "mt-1 block text-sm font-bold text-slate-500"}>
        {label}
      </span>
    </div>
  );
}

