import { ButtonLink } from "@/components/Button";

export default function AboutPage() {
  return (
    <main className="academic-bg min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <section className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-[1400px] overflow-hidden rounded-[2.5rem] bg-white/80 shadow-soft ring-1 ring-slate-200 backdrop-blur lg:grid-cols-[0.8fr_1.2fr]">
        <div className="speed-lines flex flex-col justify-between p-8 text-white sm:p-10">
          <div>
            <p className="text-sm font-black uppercase text-flagYellow">IFSP / Trabalho acadêmico</p>
            <h1 className="mt-3 text-5xl font-black leading-none sm:text-6xl">Sobre o projeto</h1>
            <p className="mt-5 max-w-md font-semibold leading-7 text-white/75">
              Corrida das Expressões é um protótipo educacional para transformar exercícios de matemática em uma experiência coletiva, visual e participativa.
            </p>
          </div>
          <div className="mt-8 grid gap-3">
            {["EJA", "Gamificação", "Matemática", "Tempo real"].map((item) => (
              <span key={item} className="rounded-full bg-white/10 px-4 py-3 text-sm font-black uppercase ring-1 ring-white/10">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid content-center gap-6 p-6 sm:p-10">
          <article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-slate-950">Objetivo educacional</h2>
            <p className="mt-3 font-semibold leading-7 text-slate-600">
              Apoiar a prática de expressões matemáticas simples com feedback rápido, competição saudável e acompanhamento visual da participação da turma.
            </p>
          </article>
          <article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-slate-950">Público-alvo</h2>
            <p className="mt-3 font-semibold leading-7 text-slate-600">
              O projeto foi pensado para estudantes da EJA, priorizando botões grandes, linguagem direta, bom contraste e uso simples pelo celular.
            </p>
          </article>
          <article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-2xl font-black text-slate-950">Tecnologias usadas</h2>
            <p className="mt-3 font-semibold leading-7 text-slate-600">
              Next.js, TypeScript, Tailwind CSS, Supabase e Vercel. O professor cria uma sessão, os alunos entram por código e o ranking atualiza em tempo real.
            </p>
          </article>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/" variant="primary">
              Entrar na corrida
            </ButtonLink>
            <ButtonLink href="/professor/login" variant="quiet">
              Área do professor
            </ButtonLink>
          </div>
        </div>
      </section>
    </main>
  );
}

