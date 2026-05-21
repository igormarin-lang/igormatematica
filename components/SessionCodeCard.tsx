"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { SessionCode } from "@/components/SessionCode";

function MiniQr({ code }: { code: string }) {
  const cells = useMemo(() => {
    const seed = code.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return Array.from({ length: 49 }, (_, index) => ((index * 7 + seed + Math.floor(index / 2)) % 5) < 2);
  }, [code]);

  return (
    <div className="grid aspect-square w-24 grid-cols-7 gap-1 rounded-2xl bg-white p-2 shadow-inner ring-1 ring-slate-200" aria-hidden="true">
      {cells.map((active, index) => (
        <span key={index} className={`rounded-[3px] ${active ? "bg-slate-950" : "bg-slate-100"}`} />
      ))}
    </div>
  );
}

export function SessionCodeCard({ code, sessionUrl }: { code: string; sessionUrl: string }) {
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  async function copy(value: string, type: "code" | "link") {
    await navigator.clipboard.writeText(value);
    setCopied(type);
    window.setTimeout(() => setCopied(null), 1800);
  }

  return (
    <div className="space-y-4 rounded-[2rem] bg-white p-4 shadow-soft ring-1 ring-slate-200">
      <SessionCode code={code} />
      <div className="flex items-center gap-4 rounded-[1.5rem] bg-slate-50 p-3 ring-1 ring-slate-200">
        <MiniQr code={code} />
        <div className="min-w-0">
          <p className="text-xs font-black uppercase text-slate-500">Entrada dos alunos</p>
          <p className="mt-1 truncate text-sm font-bold text-slate-700">{sessionUrl || "Link da sessão"}</p>
          <p className="mt-1 text-xs font-semibold text-slate-500">QR visual do protótipo; use o link ou código no celular.</p>
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
        <Button className="w-full" type="button" onClick={() => copy(code, "code")}>
          {copied === "code" ? "Código copiado!" : "Copiar código"}
        </Button>
        <Button className="w-full" type="button" variant="secondary" onClick={() => copy(sessionUrl, "link")} disabled={!sessionUrl}>
          {copied === "link" ? "Link copiado!" : "Copiar link"}
        </Button>
      </div>
    </div>
  );
}

