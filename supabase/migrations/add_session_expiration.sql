alter table sessions add column if not exists last_activity_at timestamptz default now();
alter table sessions add column if not exists expires_at timestamptz;
alter table sessions add column if not exists ended_at timestamptz;
alter table sessions add column if not exists close_reason text;

update sessions
set
  last_activity_at = coalesce(last_activity_at, created_at),
  expires_at = coalesce(
    expires_at,
    case
      when status = 'waiting' then coalesce(last_activity_at, created_at) + interval '30 minutes'
      when status in ('running', 'paused') then coalesce(last_activity_at, created_at) + interval '60 minutes'
      else coalesce(ended_at, last_activity_at, created_at)
    end
  );

alter table players add column if not exists car_color text default '#2f9e41';
alter table players add column if not exists car_model text default 'classic';
alter table players add column if not exists car_sticker text default 'star';
alter table players add column if not exists celebration_emoji text default '🎉';
alter table players add column if not exists student_theme text default 'if-green';
alter table players add column if not exists status text default 'active';

create index if not exists sessions_status_activity_idx on sessions(status, last_activity_at);
create index if not exists sessions_expires_at_idx on sessions(expires_at);
