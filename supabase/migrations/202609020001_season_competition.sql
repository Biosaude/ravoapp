-- Shared leaderboard contract for deployment with Supabase. The app keeps using
-- local persistence until NEXT_PUBLIC_SUPABASE_URL is configured.
create table if not exists public.players (id uuid primary key references auth.users on delete cascade, nickname text unique not null, avatar_url text, created_at timestamptz default now());
create table if not exists public.seasons (id text primary key, status text not null check(status in ('DRAFT','ACTIVE','FINISHED','RESULTS_PUBLISHED')), prize jsonb not null default '{}', winner_id uuid references public.players);
create table if not exists public.mission_results (player_id uuid references public.players, season_id text references public.seasons, mission_id text not null, attempts int not null check(attempts>0), hints_used int not null check(hints_used between 0 and 3), duration_ms int not null check(duration_ms>=0), score int not null check(score>=0), completed_at timestamptz default now(), primary key(player_id,season_id,mission_id));
create table if not exists public.season_scores (player_id uuid references public.players, season_id text references public.seasons, score int not null default 0, missions int not null default 0, no_hint int not null default 0, errors int not null default 0, duration_ms bigint not null default 0, primary key(player_id,season_id));
create table if not exists public.achievements (player_id uuid references public.players, season_id text references public.seasons, achievement text not null, awarded_at timestamptz default now(), primary key(player_id,season_id,achievement));
alter table public.players enable row level security; alter table public.seasons enable row level security; alter table public.mission_results enable row level security; alter table public.season_scores enable row level security; alter table public.achievements enable row level security;
create policy "public profiles readable" on public.players for select using(true);
create policy "owner updates profile" on public.players for update using(auth.uid()=id);
create policy "published seasons readable" on public.seasons for select using(status in ('ACTIVE','FINISHED','RESULTS_PUBLISHED'));
create policy "scores readable" on public.season_scores for select using(true);
create policy "achievements readable" on public.achievements for select using(true);
-- No INSERT/UPDATE policy exists for scores/results: clients cannot submit score.
-- A service-role Edge Function must validate mission id, season ACTIVE status,
-- attempts/time/hints, calculate score, insert once, and atomically aggregate.
