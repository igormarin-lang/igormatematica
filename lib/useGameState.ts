"use client";

import { useCallback, useEffect, useState } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import type { GameState } from "@/types/game";

type ApiResponse = {
  ok: boolean;
  state?: GameState;
  message?: string;
};

export function useGameState(code: string, initialState?: GameState | null) {
  const [state, setState] = useState<GameState | null>(initialState ?? null);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!code) return;
    const response = await fetch(`/api/sessions/${code}/state`, { cache: "no-store" });
    const data = (await response.json()) as ApiResponse;

    if (!data.ok || !data.state) {
      setError(data.message ?? "Não foi possível carregar a sessão.");
      return;
    }

    setState(data.state);
    setError("");
  }, [code]);

  useEffect(() => {
    if (!code) return;
    void refresh();
    const interval = window.setInterval(refresh, 1500);
    const supabase = createBrowserClient();

    if (!supabase) {
      return () => window.clearInterval(interval);
    }

    let channel = supabase
      .channel(`corrida-${code}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "sessions" }, () => void refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "players" }, () => void refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "answers" }, () => void refresh())
      .subscribe();

    return () => {
      window.clearInterval(interval);
      void supabase.removeChannel(channel);
    };
  }, [code, refresh]);

  return { state, setState, error, refresh };
}
