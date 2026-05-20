# Corrida das Expressões

Jogo educativo multiplayer de matemática para EJA. A experiência é parecida com Kahoot, mas a visualização principal é uma corrida: cada acerto faz o carrinho do aluno avançar.

## Arquitetura

- Next.js App Router + TypeScript
- Tailwind CSS
- Supabase Postgres + Supabase Realtime
- Autenticação simples de professor por cookie assinado
- Alunos entram sem conta, apenas com código da sessão e nome
- Compatível com Vercel, sem servidor Socket.io persistente

## Variáveis de ambiente

Crie um arquivo `.env.local` baseado em `.env.example`:

```bash
PROFESSOR_EMAIL=professor@example.com
PROFESSOR_PASSWORD=troque-esta-senha
AUTH_SECRET=troque-por-uma-frase-longa-e-aleatoria

NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
```

Nunca exponha `SUPABASE_SERVICE_ROLE_KEY` no front-end. Na Vercel, ela deve ficar apenas em Environment Variables.

## Supabase

1. Crie um projeto no Supabase.
2. Abra **SQL Editor**.
3. Execute o arquivo `supabase/schema.sql`.
4. Em **Project Settings > API**, copie:
   - Project URL
   - anon public key
   - service_role key
5. Preencha o `.env.local` e depois as variáveis na Vercel.

As tabelas criadas são:

- `sessions`
- `players`
- `questions`
- `answers`

O Realtime é habilitado para `sessions`, `players` e `answers`.

## Rodar localmente

```bash
npm install
npm run dev
```

Abra:

```text
http://localhost:3000
```

Scripts úteis:

```bash
npm run lint
npm run build
npm run start
```

## Como usar em sala

1. Abra a URL do jogo.
2. Clique em **Sou professor**.
3. Faça login com o e-mail e senha do `.env`.
4. Crie uma sessão e escolha 5, 10, 15 ou 20 rodadas.
5. Abra o **modo telão** e projete para a turma.
6. Os alunos abrem a URL no celular.
7. Eles digitam o código da sessão.
8. Depois digitam o nome.
9. O professor inicia a corrida.
10. Os alunos respondem as expressões.
11. A pista e o ranking atualizam em tempo real.

## Deploy na Vercel

1. Suba o projeto para o GitHub.
2. Na Vercel, clique em **Add New Project**.
3. Escolha o repositório.
4. Configure as variáveis de ambiente:
   - `PROFESSOR_EMAIL`
   - `PROFESSOR_PASSWORD`
   - `AUTH_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Deploy.

Não use Vercel como servidor Socket.io. Este projeto usa rotas serverless para ações e Supabase Realtime para atualização das telas.

## GitHub

```bash
git init
git add .
git commit -m "feat: create corrida das expressoes web app"
git branch -M main
git remote add origin URL_DO_REPOSITORIO
git push -u origin main
```

## Limitações atuais

- Existe um único login de professor por variáveis de ambiente.
- Não há painel histórico de sessões antigas.
- A segurança é suficiente para protótipo real de aula, mas não é um sistema multiusuário completo.
- A chave `service_role` é usada somente nas rotas serverless para manter as regras simples.

## Próximos passos

- Adicionar histórico de partidas por professor.
- Permitir seleção de dificuldade.
- Adicionar leitura em voz alta das expressões.
- Melhorar relatórios de desempenho da turma.

# igormatematica
