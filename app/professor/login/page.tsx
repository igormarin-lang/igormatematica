"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/Button";
import { IFSPLogo } from "@/components/IFSPLogo";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = (await response.json()) as { ok: boolean; message?: string };
    setLoading(false);

    if (!data.ok) {
      setMessage(data.message ?? "Não foi possível entrar.");
      return;
    }

    router.push("/professor/dashboard");
  }

  return (
    <main className="academic-bg grid min-h-screen place-items-center px-5 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white shadow-soft ring-1 ring-white/10 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="speed-lines flex flex-col justify-between p-8 text-white sm:p-10">
        <div>
          <IFSPLogo compact className="mb-8 w-max" />
          <p className="text-sm font-black uppercase text-flagYellow">Área do professor</p>
          <h1 className="mt-3 text-5xl font-black leading-none">Painel da corrida</h1>
          <p className="mt-4 max-w-md font-semibold text-white/75">Crie a sessão, projete o telão e acompanhe a turma em tempo real.</p>
        </div>
        <div className="mt-10 rounded-[1.75rem] bg-white/10 p-5 ring-1 ring-white/10">
          <p className="text-xs font-black uppercase text-flagYellow">Protótipo acadêmico</p>
          <p className="mt-2 font-semibold text-white/80">Pensado para EJA, com botões grandes, ranking claro e visual de corrida.</p>
        </div>
      </div>
      <form onSubmit={login} className="p-6 sm:p-8 lg:p-10">
        <p className="text-sm font-black uppercase text-raceRed">Login único</p>
        <h2 className="mt-2 text-4xl font-black text-slate-950">Entrar</h2>
        <label className="mt-7 block font-black" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 h-14 w-full rounded-2xl border-2 border-slate-200 px-4 outline-none focus:border-ifGreen"
        />
        <label className="mt-5 block font-black" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-14 w-full rounded-2xl border-2 border-slate-200 px-4 outline-none focus:border-ifGreen"
        />
        <Button className="mt-7 w-full min-h-14" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar no painel"}
        </Button>
        {message ? <p className="mt-4 rounded-xl bg-red-50 p-3 font-bold text-raceRed">{message}</p> : null}
        <div className="mt-6 flex flex-wrap gap-4">
          <ButtonLink href="/" variant="ghost" className="min-h-0 px-0 py-0">
            Voltar ao início
          </ButtonLink>
          <ButtonLink href="/sobre" variant="ghost" className="min-h-0 px-0 py-0 text-ifGreen">
            Sobre o projeto
          </ButtonLink>
        </div>
      </form>
      </section>
    </main>
  );
}
