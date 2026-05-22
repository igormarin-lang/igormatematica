"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CarPreview3D } from "@/components/CarPreview3D";
import { GameButton, GameButtonLink } from "@/components/GameButton";
import { GameInput } from "@/components/GameInput";
import { IFSPLogo } from "@/components/IFSPLogo";
import { GameAppShell } from "@/components/game/GameAppShell";
import { GameIconButton } from "@/components/game/GameIconButton";
import { GameModal } from "@/components/game/GameModal";
import { GameTopBar } from "@/components/game/GameTopBar";
import { GameWindow } from "@/components/game/GameWindow";
import { RoomBrowser } from "@/components/game/RoomBrowser";
import { sanitizeCode } from "@/lib/session";

export default function HomePage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [pilotName, setPilotName] = useState("");
  const [modal, setModal] = useState<"rooms" | "how" | null>(null);

  useEffect(() => {
    setPilotName(window.localStorage.getItem("corrida-pilot-name") ?? "");
  }, []);

  function enterRace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanCode = sanitizeCode(code);
    window.localStorage.setItem("corrida-pilot-name", pilotName.trim());
    if (cleanCode.length === 4) router.push(`/sessao/${cleanCode}`);
  }

  return (
    <GameAppShell>
      <GameWindow>
        <GameTopBar
          subtitle="Resolva. Acelere. Vença."
          left={
            <GameIconButton label="Como jogar" onClick={() => setModal("how")}>
              ?
            </GameIconButton>
          }
          right={
            <GameIconButton label="Salas disponíveis" onClick={() => setModal("rooms")}>
              ≡
            </GameIconButton>
          }
        />

        <div className="mt-4 grid min-h-0 flex-1 gap-4 overflow-hidden lg:grid-cols-[0.9fr_0.82fr_0.9fr]">
          <section className="flex min-h-0 flex-col rounded-[1.8rem] border-2 border-white/15 bg-green-950/58 p-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,.08)]">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-black uppercase text-flagYellow">Seu piloto</p>
              <IFSPLogo variant="white" compact className="hidden sm:inline-flex" />
            </div>
            <div className="mt-3 min-h-0 flex-1">
              <CarPreview3D color="#2f9e41" model="turbo" sticker="if" playerName={pilotName || "Piloto"} size="md" />
            </div>
            <div className="mt-3">
              <label className="mb-2 block text-sm font-black uppercase text-white/82" htmlFor="pilot-name">
                Nome de piloto
              </label>
              <GameInput
                id="pilot-name"
                value={pilotName}
                onChange={(event) => setPilotName(event.target.value)}
                maxLength={24}
                placeholder="Seu nome"
                className="h-14 text-lg normal-case tracking-normal"
              />
            </div>
          </section>

          <section className="flex min-h-0 flex-col justify-center gap-3 rounded-[1.8rem] border-2 border-white/15 bg-white/12 p-4 backdrop-blur">
            <form onSubmit={enterRace} className="grid gap-3">
              <label className="text-center text-sm font-black uppercase text-flagYellow" htmlFor="session-code">
                Código da sala
              </label>
              <GameInput
                id="session-code"
                value={code}
                onChange={(event) => setCode(sanitizeCode(event.target.value))}
                placeholder="AB12"
                maxLength={4}
                aria-label="Código da sala"
                className="h-20 text-4xl uppercase tracking-widest"
              />
              <GameButton className="w-full text-lg" type="submit" icon="🏁" disabled={sanitizeCode(code).length !== 4}>
                Jogar
              </GameButton>
            </form>

            <GameButtonLink href="/professor/login" variant="green" icon="▣" className="w-full">
              Criar sala
            </GameButtonLink>
            <GameButton type="button" variant="white" icon="≡" className="w-full" onClick={() => setModal("rooms")}>
              Salas
            </GameButton>
          </section>

          <aside className="hidden min-h-0 flex-col rounded-[1.8rem] border-2 border-white/15 bg-green-950/58 p-4 lg:flex">
            <p className="text-xs font-black uppercase text-flagYellow">Como jogar</p>
            <h2 className="mt-1 text-3xl font-black">Acelere com respostas certas</h2>
            <div className="mt-4 grid gap-3 overflow-y-auto pr-1">
              {[
                ["1", "Digite o código da sala."],
                ["2", "Monte seu carrinho."],
                ["3", "Responda as expressões."],
                ["4", "Quem acerta mais chega mais longe."]
              ].map(([number, text]) => (
                <div key={number} className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-flagYellow text-lg font-black text-green-950">{number}</span>
                  <p className="font-black text-white">{text}</p>
                </div>
              ))}
            </div>
            <GameButtonLink href="/sobre" variant="white" icon="i" className="mt-auto w-full">
              Sobre
            </GameButtonLink>
          </aside>
        </div>

        <footer className="mt-3 flex shrink-0 items-center justify-center gap-3 text-xs font-black uppercase text-white/55">
          <button type="button" onClick={() => setModal("how")} className="lg:hidden">
            Como jogar
          </button>
          <span className="lg:hidden">•</span>
          <GameButtonLink href="/sobre" variant="white" className="min-h-9 rounded-xl border-2 px-3 py-1 text-xs lg:hidden">
            Sobre
          </GameButtonLink>
        </footer>

        <GameModal open={modal === "rooms"} title="Salas disponíveis" onClose={() => setModal(null)}>
          <RoomBrowser />
        </GameModal>

        <GameModal open={modal === "how"} title="Como jogar" onClose={() => setModal(null)}>
          <div className="grid gap-3">
            {["Digite o código da sala.", "Escolha nome, carrinho e cor.", "Responda cada pergunta uma vez.", "Acertou? Seu carrinho avança.", "No fim, vence quem somar mais pontos."].map((step, index) => (
              <div key={step} className="flex items-center gap-3 rounded-2xl bg-white p-3 text-green-950">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-flagYellow text-lg font-black">{index + 1}</span>
                <p className="font-black">{step}</p>
              </div>
            ))}
          </div>
        </GameModal>
      </GameWindow>
    </GameAppShell>
  );
}
