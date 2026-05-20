"use client";

import { useEffect, useState } from "react";

export function Timer({ endsAt, fallback = 20 }: { endsAt: string | null; fallback?: number }) {
  const [seconds, setSeconds] = useState(fallback);

  useEffect(() => {
    const tick = () => {
      if (!endsAt) {
        setSeconds(fallback);
        return;
      }

      setSeconds(Math.max(0, Math.ceil((new Date(endsAt).getTime() - Date.now()) / 1000)));
    };

    tick();
    const interval = window.setInterval(tick, 250);
    return () => window.clearInterval(interval);
  }, [endsAt, fallback]);

  return (
    <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-flagYellow text-xl font-black text-slate-900 shadow-soft ring-4 ring-white sm:h-20 sm:w-20 sm:rounded-full sm:text-2xl">
      {seconds}s
    </div>
  );
}
