"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/Button";
import { IFSPLogo } from "@/components/IFSPLogo";
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
    <main className="academic-bg min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-2.5rem)] w-full max-w-[1500px] overflow-hidden rounded-[2rem] bg-green-950/80 shadow-soft ring-1 ring-white/10 backdrop-blur sm:rounded-[2.5rem] lg:grid-cols-[0.92fr_1.08fr]">
        <div className="flex flex-col justify-center p-5 text-white sm:p-10 lg:p-14">
          <IFSPLogo compact className="mb-7 w-max" />
          <div className="flex flex-wrap gap-2">
            {["Jogo ao vivo", "Para sala de aula", "EJA", "Matemática"].map((badge) => (
              <span key={badge} className="rounded-full bg-white/12 px-3 py-1.5 text-xs font-black uppercase text-white shadow-sm ring-1 ring-white/15">
                {badge}
              </span>
            ))}
          </div>
          <p className="mt-8 text-sm font-black uppercase text-flagYellow">Projeto educacional • Matemática em tempo real</p>
          <h1 className="mt-3 text-[3.2rem] font-black leading-[0.9] text-white sm:text-7xl xl:text-8xl">
            Corrida das Expressões
          </h1>
          <p className="mt-5 max-w-2xl text-base font-semibold leading-7 text-white/75 sm:text-lg">
            Uma corrida matemática para a turma resolver expressões, acompanhar o ranking e aprender em ritmo de jogo.
          </p>
          <form onSubmit={enterRace} className="mt-8 rounded-[2rem] bg-white p-4 shadow-soft ring-1 ring-slate-200 sm:p-5">
            <label className="block text-base font-black text-slate-800 sm:text-lg" htmlFor="session-code">
              Digite o código da sessão
            </label>
            <input
              id="session-code"
              value={code}
              onChange={(event) => setCode(sanitizeCode(event.target.value))}
              placeholder="AB12"
              maxLength={4}
              aria-label="Digite o código da sessão"
              className="mt-3 h-20 w-full rounded-[1.5rem] border-4 border-slate-200 bg-slate-50 px-5 text-center text-4xl font-black uppercase tracking-widest outline-none transition focus:border-ifGreen focus:bg-white sm:h-24 sm:text-5xl"
            />
            <Button className="mt-4 w-full text-lg sm:min-h-16" type="submit" disabled={sanitizeCode(code).length !== 4}>
              Entrar na corrida
            </Button>
          </form>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <ButtonLink href="/professor/login" variant="ghost" className="min-h-0 px-0 py-0 text-white">
              Sou professor
            </ButtonLink>
            <ButtonLink href="/sobre" variant="ghost" className="min-h-0 px-0 py-0 text-flagYellow">
              Sobre o projeto
            </ButtonLink>
          </div>
          <p className="mt-8 text-sm font-bold text-white/60">Projeto acadêmico de matemática — Corrida das Expressões</p>
        </div>

        <div className="speed-lines relative flex min-h-[420px] items-center p-5 sm:p-8 lg:min-h-full">
          <div className="absolute inset-x-8 top-8 flex justify-between text-6xl font-black text-white/10" aria-hidden="true">
            <span>+</span>
            <span>×</span>
            <span>÷</span>
          </div>
          <div className="relative w-full">
            <div className="mb-5 flex items-center justify-between rounded-[1.5rem] bg-white/10 p-4 text-white ring-1 ring-white/10">
              <div>
                <p className="text-xs font-black uppercase text-flagYellow">Placar da turma</p>
                <strong className="text-2xl font-black">Rodada 3 de 10</strong>
              </div>
              <span className="grid h-16 w-16 place-items-center rounded-2xl bg-flagYellow text-xl font-black text-slate-950">18s</span>
            </div>
            <div className="grid gap-4">
              {["Ana", "Joao", "Maria", "Carlos"].map((name, index) => (
                <div key={name} className="race-lane relative h-20 overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 sm:h-24">
                  <span className="absolute left-4 top-3 max-w-[45%] truncate font-black text-white">{name}</span>
                  <span className="absolute right-14 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-black text-slate-900">{[8, 7, 5, 4][index]} pts</span>
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-ifGreen/45 to-flagYellow/25" style={{ width: `${[82, 68, 48, 34][index]}%` }} />
                  <span className="absolute bottom-2 text-5xl drop-shadow-lg" style={{ left: `${[72, 58, 40, 27][index]}%` }}>
                    🏎️
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
