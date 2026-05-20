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
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <section className="w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-soft ring-1 ring-slate-200">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="p-6 sm:p-10 lg:p-14">
            <p className="text-sm font-black uppercase text-raceRed">Jogo de matemática ao vivo</p>
            <h1 className="mt-3 text-5xl font-black leading-none text-slate-950 sm:text-7xl">Corrida das Expressões</h1>
            <form onSubmit={enterRace} className="mt-9 space-y-4">
              <label className="block text-lg font-black text-slate-800" htmlFor="session-code">
                Digite o código da sessão
              </label>
              <input
                id="session-code"
                value={code}
                onChange={(event) => setCode(sanitizeCode(event.target.value))}
                placeholder="AB12"
                maxLength={4}
                className="h-20 w-full rounded-2xl border-4 border-slate-200 bg-slate-50 px-5 text-center text-4xl font-black uppercase tracking-widest outline-none transition focus:border-raceRed focus:bg-white"
              />
              <Button className="w-full text-lg" type="submit" disabled={sanitizeCode(code).length !== 4}>
                Entrar na corrida
              </Button>
            </form>
            <div className="mt-7">
              <ButtonLink href="/professor/login" variant="ghost" className="min-h-0 px-0 py-0">
                Sou professor
              </ButtonLink>
            </div>
          </div>
          <div className="bg-asphalt p-6 sm:p-10">
            <div className="grid h-full min-h-[360px] content-center gap-5">
              {["Ana", "Joao", "Maria"].map((name, index) => (
                <div key={name} className="race-lane relative h-24 overflow-hidden rounded-2xl">
                  <span className="absolute left-4 top-3 font-black text-white">{name}</span>
                  <span className="absolute bottom-3 text-5xl" style={{ left: `${14 + index * 21}%` }}>
                    🏎️
                  </span>
                  <span className="checkered absolute bottom-0 right-0 top-0 w-10 opacity-90" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
