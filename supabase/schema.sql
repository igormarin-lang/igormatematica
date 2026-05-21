create extension if not exists "pgcrypto";

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status text not null default 'waiting' check (status in ('waiting', 'running', 'paused', 'finished')),
  total_rounds integer not null default 10 check (total_rounds in (5, 10, 15, 20)),
  current_round integer not null default 0,
  question_started_at timestamptz,
  question_ends_at timestamptz,
  winner_player_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.players (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  name text not null,
  score integer not null default 0,
  position integer not null default 0,
  car_color text default '#2f9e41',
  car_model text default 'classic',
  car_sticker text default 'star',
  celebration_emoji text default '🎉',
  student_theme text default 'if-green',
  joined_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  round_number integer not null,
  expression text not null,
  correct_answer integer not null,
  difficulty text not null check (difficulty in ('facil', 'medio', 'dificil')),
  unique (session_id, round_number)
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.sessions(id) on delete cascade,
  player_id uuid not null references public.players(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  round_number integer not null,
  answer integer not null,
  is_correct boolean not null,
  points_awarded integer not null default 0,
  answered_at timestamptz not null default now(),
  unique (player_id, question_id)
);

alter table public.sessions enable row level security;
alter table public.players enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;

drop policy if exists "public read sessions" on public.sessions;
create policy "public read sessions"
on public.sessions for select
to anon, authenticated
using (true);

drop policy if exists "public read players" on public.players;
create policy "public read players"
on public.players for select
to anon, authenticated
using (true);

drop policy if exists "public read safe questions" on public.questions;
drop policy if exists "public read questions" on public.questions;

drop policy if exists "public read answers" on public.answers;
create policy "public read answers"
on public.answers for select
to anon, authenticated
using (true);

drop policy if exists "prototype write sessions" on public.sessions;
create policy "prototype write sessions"
on public.sessions for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "prototype write players" on public.players;
create policy "prototype write players"
on public.players for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "prototype write questions" on public.questions;
create policy "prototype write questions"
on public.questions for all
to anon, authenticated
using (true)
with check (true);

drop policy if exists "prototype write answers" on public.answers;
create policy "prototype write answers"
on public.answers for all
to anon, authenticated
using (true)
with check (true);

create index if not exists players_session_id_idx on public.players(session_id);
create index if not exists questions_session_round_idx on public.questions(session_id, round_number);
create index if not exists answers_session_round_idx on public.answers(session_id, round_number);

do $$
begin
  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'sessions'
  ) then
    alter publication supabase_realtime add table public.sessions;
  end if;

  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'players'
  ) then
    alter publication supabase_realtime add table public.players;
  end if;

  if not exists (
    select 1 from pg_publication_tables where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'answers'
  ) then
    alter publication supabase_realtime add table public.answers;
  end if;
end $$;
