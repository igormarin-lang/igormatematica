"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

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
    <main className="grid min-h-screen place-items-center px-5 py-10">
      <form onSubmit={login} className="w-full max-w-md rounded-3xl bg-white p-6 shadow-soft ring-1 ring-slate-200 sm:p-8">
        <p className="text-sm font-black uppercase text-raceRed">Área do professor</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Entrar</h1>
        <label className="mt-7 block font-black" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 h-14 w-full rounded-xl border-2 border-slate-200 px-4 outline-none focus:border-raceBlue"
        />
        <label className="mt-5 block font-black" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-14 w-full rounded-xl border-2 border-slate-200 px-4 outline-none focus:border-raceBlue"
        />
        <Button className="mt-7 w-full" type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar no painel"}
        </Button>
        {message ? <p className="mt-4 rounded-xl bg-red-50 p-3 font-bold text-raceRed">{message}</p> : null}
      </form>
    </main>
  );
}
