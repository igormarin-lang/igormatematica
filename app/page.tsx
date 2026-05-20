"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/Button";
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
    <main className="grid min-h-screen place-items-center px-4 py-5 sm:px-6 sm:py-10">
      <section className="w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-slate-200 sm:rounded-[2.5rem]">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-5 sm:p-10 lg:p-14">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-black uppercase text-raceRed ring-1 ring-red-100">
              <span className="h-2 w-2 rounded-full bg-raceRed" />
              Jogo de matemática ao vivo
            </div>
            <h1 className="mt-5 text-[3.15rem] font-black leading-[0.92] text-slate-950 sm:text-7xl lg:text-8xl">
              Corrida das Expressões
            </h1>
            <p className="mt-5 max-w-xl text-base font-semibold leading-7 text-slate-600 sm:text-lg">
              Entre com o código da sessão e acelere resolvendo expressões simples.
            </p>
            <form onSubmit={enterRace} className="mt-8 rounded-[1.75rem] bg-slate-50 p-4 ring-1 ring-slate-200 sm:p-5">
              <label className="block text-base font-black text-slate-800 sm:text-lg" htmlFor="session-code">
                Digite o código da sessão
              </label>
              <input
                id="session-code"
                value={code}
                onChange={(event) => setCode(sanitizeCode(event.target.value))}
                placeholder="AB12"
                maxLength={4}
                className="mt-3 h-20 w-full rounded-[1.5rem] border-4 border-slate-200 bg-white px-5 text-center text-4xl font-black uppercase tracking-widest outline-none transition focus:border-raceRed focus:bg-white sm:h-24 sm:text-5xl"
              />
              <Button className="mt-4 w-full text-lg sm:min-h-16" type="submit" disabled={sanitizeCode(code).length !== 4}>
                Entrar na corrida
              </Button>
            </form>
            <div className="mt-6 text-center sm:text-left">
              <ButtonLink href="/professor/login" variant="ghost" className="min-h-0 px-0 py-0">
                Sou professor
              </ButtonLink>
            </div>
          </div>
          <div className="speed-lines p-5 sm:p-10">
            <div className="grid h-full min-h-[300px] content-center gap-4 sm:min-h-[430px] sm:gap-5">
              {["Ana", "Joao", "Maria"].map((name, index) => (
                <div key={name} className="race-lane relative h-20 overflow-hidden rounded-[1.75rem] ring-1 ring-white/10 sm:h-28">
                  <span className="absolute left-4 top-3 max-w-[45%] truncate font-black text-white">{name}</span>
                  <span className="absolute bottom-2 text-4xl drop-shadow-lg sm:text-6xl" style={{ left: `${12 + index * 23}%` }}>
                    🏎️
                  </span>
                  <span className="checkered absolute bottom-0 right-0 top-0 w-10 opacity-90 sm:w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
