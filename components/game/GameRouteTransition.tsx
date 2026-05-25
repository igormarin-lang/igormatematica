"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GameLoadingScreen } from "@/components/game/GameLoadingScreen";

const loadingMessages = ["Preparando a pista...", "Alinhando os carrinhos...", "Carregando sala..."];

function isInternalNavigation(target: EventTarget | null) {
  if (!(target instanceof Element)) return false;
  const anchor = target.closest("a");
  if (!anchor) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  if (anchor.getAttribute("target") === "_blank") return false;

  try {
    const url = new URL(href, window.location.href);
    return url.origin === window.location.origin && url.href !== window.location.href;
  } catch {
    return false;
  }
}

export function startGameRouteTransition() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("corrida-route-loading"));
}

export function GameRouteTransition() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    setActive(false);
  }, [pathname]);

  useEffect(() => {
    if (!active) return;
    const timeout = window.setTimeout(() => setActive(false), 4500);
    return () => window.clearTimeout(timeout);
  }, [active]);

  useEffect(() => {
    const start = () => {
      setMessageIndex((current) => (current + 1) % loadingMessages.length);
      setActive(true);
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (isInternalNavigation(event.target)) start();
    };

    window.addEventListener("corrida-route-loading", start);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("corrida-route-loading", start);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-green-950/92 p-4 text-white backdrop-blur-sm">
      <div className="w-full max-w-md">
        <GameLoadingScreen text={loadingMessages[messageIndex]} />
      </div>
    </div>
  );
}
