alter table sessions add column if not exists entries_locked boolean not null default false;
alter table players add column if not exists status text not null default 'active';
