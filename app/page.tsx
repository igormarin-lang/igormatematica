"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Car2D } from "@/components/Car2D";
import { GameButton, GameButtonLink } from "@/components/GameButton";
import { GameInput } from "@/components/GameInput";
import { IFSPLogo } from "@/components/IFSPLogo";
import { StudentHeroCar } from "@/components/StudentHeroCar";
import { sanitizeCode } from "@/lib/session";

export default function HomePage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  function enterRace(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanCode = sanitizeCode(code);
    if (cleanCode.length === 4) {
      router.push(`/sessao/${cleanCode}`);
    }
  }

  return (
    <main className="game-mobile-bg h-[100dvh] overflow-hidden px-4 py-4 text-white sm:px-6 lg:px-8">
      <section className="mx-auto grid h-full w-full max-w-[1500px] overflow-hidden rounded-[2.2rem] border-2 border-white/15 bg-green-950/45 shadow-soft backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex min-h-0 flex-col overflow-y-auto p-5 sm:p-8 lg:p-12">
          <div className="flex items-center justify-between gap-3">
            <GameButtonLink href="/sobre" icon="☰" variant="white" className="min-h-12 w-14 px-0 py-0" aria-label="Abrir informações">
              <span className="sr-only">Menu</span>
            </GameButtonLink>
            <IFSPLogo compact className="scale-90" />
            <GameButtonLink href="/sobre" icon="?" variant="white" className="min-h-12 w-14 px-0 py-0" aria-label="Sobre o projeto">
              <span className="sr-only">Sobre</span>
            </GameButtonLink>
          </div>

          <div className="mt-7 flex flex-wrap justify-center gap-2 sm:justify-start">
            {["Jogo ao vivo", "Para sala de aula", "EJA", "Matemática"].map((badge) => (
              <span key={badge} className="rounded-full bg-white/12 px-3 py-1.5 text-xs font-black uppercase text-white shadow-sm ring-1 ring-white/15">
                {badge}
              </span>
            ))}
          </div>

          <div className="mt-8 text-center sm:text-left">
          <h1 className="game-title text-[3.4rem] font-black leading-[0.86] sm:text-7xl xl:text-8xl">
            Corrida das Expressões
          </h1>
          <p className="mt-5 text-sm font-black uppercase tracking-wide text-white">
            Matemática ao vivo na sala de aula
          </p>
          </div>

          <div className="mt-8 lg:hidden">
            <StudentHeroCar color="#2f9e41" model="future" sticker="plus" editable />
          </div>

          <form onSubmit={enterRace} className="mt-8 rounded-[2rem] bg-white p-4 shadow-soft ring-1 ring-slate-200 sm:p-5">
            <label className="block text-base font-black text-slate-800 sm:text-lg" htmlFor="session-code">
              Digite o código da sessão
            </label>
            <GameInput
              id="session-code"
              value={code}
              onChange={(event) => setCode(sanitizeCode(event.target.value))}
              placeholder="AB12"
              maxLength={4}
              aria-label="Digite o código da sessão"
              className="mt-3 h-20 text-4xl uppercase tracking-widest sm:h-24 sm:text-5xl"
            />
            <GameButton className="mt-5 w-full text-lg sm:min-h-16" type="submit" icon="🏁" disabled={sanitizeCode(code).length !== 4}>
              Jogar
            </GameButton>
          </form>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <GameButtonLink href="/professor/login" variant="green" icon="▣">
              Sou professor
            </GameButtonLink>
            <GameButtonLink href="/sobre" variant="white" icon="i">
              Sobre o projeto
            </GameButtonLink>
          </div>
          <p className="mt-auto pt-8 text-center text-sm font-bold text-white/60 sm:text-left">Protótipo acadêmico · IFSP</p>
        </div>

        <div className="speed-lines relative hidden min-h-0 items-center overflow-hidden p-5 sm:p-8 lg:flex">
          <div className="absolute inset-x-8 top-8 flex justify-between text-6xl font-black text-white/10" aria-hidden="true">
            <span>+</span>
            <span>×</span>
            <span>÷</span>
          </div>
          <div className="relative w-full">
            <div className="mb-8 hidden lg:block">
              <StudentHeroCar color="#2f9e41" model="future" sticker="plus" editable />
            </div>
            <div className="mb-5 flex items-center justify-between rounded-[1.5rem] bg-white/10 p-4 text-white ring-1 ring-white/10">
              <div>
                <p className="text-xs font-black uppercase text-flagYellow">Placar da turma</p>
                <strong className="text-2xl font-black">Pergunta 3 de 10</strong>
              </div>
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-flagYellow text-xl font-black text-slate-950">18s</span>
            </div>
            <div className="grid gap-4">
              {["Ana", "Joao", "Maria", "Carlos"].map((name, index) => (
                <div key={name} className="race-lane relative h-20 overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 sm:h-24">
                  <span className="absolute left-4 top-3 max-w-[45%] truncate font-black text-white">{name}</span>
                  <span className="absolute right-14 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-900">{[8, 7, 5, 4][index]} pts</span>
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-ifGreen/45 to-flagYellow/25" style={{ width: `${[82, 68, 48, 34][index]}%` }} />
                  <span className="absolute bottom-3 drop-shadow-lg" style={{ left: `${[72, 58, 40, 27][index]}%` }}>
                    <Car2D color={["#2f9e41", "#2563eb", "#f97316", "#ec4899"][index]} model={index === 1 ? "formula" : index === 2 ? "kart" : "turbo"} sticker={index === 0 ? "if" : "star"} className="scale-125" />
                  </span>
                  <span className="checkered absolute bottom-0 right-0 top-0 w-12 opacity-90" />
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-[1.5rem] bg-white p-5 shadow-soft">
              <p className="text-xs font-black uppercase text-raceRed">Expressão atual</p>
              <strong className="mt-1 block text-5xl font-black text-slate-950">8 + 4 × 2</strong>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
