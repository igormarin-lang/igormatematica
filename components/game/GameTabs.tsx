"use client";

export function GameTabs<T extends string>({
  value,
  onChange,
  items
}: {
  value: T;
  onChange: (value: T) => void;
  items: Array<{ value: T; label: string }>;
}) {
  return (
    <div className="grid grid-cols-3 gap-2 rounded-[1.5rem] border-2 border-white/15 bg-green-950/40 p-1.5">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          onClick={() => onChange(item.value)}
          className={`rounded-[1.1rem] px-3 py-2 text-sm font-black uppercase transition ${
            value === item.value ? "bg-flagYellow text-green-950 shadow-[0_4px_0_rgba(0,0,0,.22)]" : "text-white/75 hover:bg-white/10"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

