-- ExamSlot: students table
-- Run this in the Supabase SQL editor.
-- Admin write access goes through the Next.js server using the service role
-- key, which bypasses RLS. RLS below blocks anonymous/public access.

create extension if not exists "pgcrypto";

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  student_id text not null unique,
  full_name text not null,
  email text not null unique,
  program text,
  semester text,
  status text not null default 'active' check (status in ('active', 'inactive', 'pending')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists students_student_id_idx on public.students (student_id);
create index if not exists students_email_idx on public.students (email);

alter table public.students enable row level security;

-- Authenticated users (once real auth exists) may read their own records via a
-- future policy. For now, no anon/authenticated policy is granted on purpose.
-- The Next.js server uses the service role key for admin CRUD.

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists students_set_updated_at on public.students;
create trigger students_set_updated_at
  before update on public.students
  for each row execute function public.set_updated_at();
