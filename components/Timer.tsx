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
    <div className="grid h-20 w-20 place-items-center rounded-full bg-flagYellow text-2xl font-black text-slate-900 shadow-soft">
      {seconds}s
    </div>
  );
}
