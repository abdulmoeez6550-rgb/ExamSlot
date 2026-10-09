-- ExamSlot initial schema
-- Run order: 0001_init_schema.sql -> 0002_functions.sql -> ../seed.sql

create extension if not exists "pgcrypto";
create extension if not exists "btree_gist";

-- ---------------------------------------------------------------------------
-- profiles: one row per auth.users account, holds the role
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  full_name text not null default '',
  role text not null default 'student' check (role in ('admin', 'student')),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- branches
-- ---------------------------------------------------------------------------
create table public.branches (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z0-9-]{2,10}$'),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- courses: unique course codes
-- ---------------------------------------------------------------------------
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  code text not null unique check (code ~ '^[A-Z]{2,4}[0-9]{3}$'),
  title text not null,
  credit_hours int not null default 3 check (credit_hours between 1 and 6),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- students: personal, parent/guardian and academic fields
-- branch_change_credits      = single-use branch unlocks from approved requests
-- date_sheet_change_credits  = single-use date-sheet unlocks from approved
--                              requests (delete lock -> edit -> re-save)
-- ---------------------------------------------------------------------------
create table public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  registration_no text not null unique,
  branch_id uuid references public.branches (id) on delete restrict,
  branch_change_credits int not null default 0 check (branch_change_credits >= 0),
  date_sheet_change_credits int not null default 0 check (date_sheet_change_credits >= 0),
  -- personal
  father_name text not null default '',
  mother_name text not null default '',
  guardian_name text not null default '',
  guardian_relation text not null default 'father',
  guardian_phone text not null default '',
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other')),
  cnic text,
  phone text,
  address text,
  city text,
  -- academic
  program text not null default 'BS',
  session text not null default '',
  semester int not null default 1 check (semester between 1 and 12),
  section text,
  admission_date date,
  previous_qualification text,
  previous_percentage numeric(5, 2) check (previous_percentage between 0 and 100),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- student_courses: 4-6 courses per student (max enforced by trigger in 0002,
-- minimum checked when the date sheet is saved)
-- ---------------------------------------------------------------------------
create table public.student_courses (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete restrict,
  assigned_at timestamptz not null default now(),
  unique (student_id, course_id)
);

-- ---------------------------------------------------------------------------
-- exam_slots: a slot belongs to ONE course. Duplicate sittings are rejected
-- per course (course + date + start), while DIFFERENT courses may hold exams
-- at the same date/time (parallel papers).
-- ---------------------------------------------------------------------------
create table public.exam_slots (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete restrict,
  slot_date date not null,
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  check (end_time > start_time),
  unique (course_id, slot_date, start_time)
);

-- ---------------------------------------------------------------------------
-- student_exam_selections
-- exam_date/start_time/end_time mirror the slot so PostgreSQL can reject
-- overlapping exams for the same student with an exclusion constraint.
-- PostgreSQL has no built-in time range type, so same-day time overlap is
-- expressed as an int4range of seconds since midnight with '[)' bounds:
--   - 09:00-11:00 -> [32400, 39600)
--   - 11:00-13:00 -> [39600, 46800)   (adjacent exams do NOT conflict)
-- The student_id = term restricts conflicts to one student; different
-- students may take exams at overlapping times.
-- ---------------------------------------------------------------------------
create table public.student_exam_selections (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  course_id uuid not null references public.courses (id) on delete restrict,
  slot_id uuid not null references public.exam_slots (id) on delete restrict,
  exam_date date not null,
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  unique (student_id, course_id),
  unique (student_id, slot_id),
  exclude using gist (
    student_id with =,
    daterange(exam_date, exam_date, '[]') with &&,
    int4range(
      (extract(epoch from start_time))::integer,
      (extract(epoch from end_time))::integer,
      '[)'
    ) with &&
  )
);

-- ---------------------------------------------------------------------------
-- date_sheets: unique(student_id) makes saving a one-time operation
-- ---------------------------------------------------------------------------
create table public.date_sheets (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references public.students (id) on delete cascade,
  slot_count int not null check (slot_count between 4 and 6),
  locked_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- change_requests: student asks to change branch or unlock the date sheet;
-- admin approves/rejects (approval grants exactly one single-use credit)
-- ---------------------------------------------------------------------------
create table public.change_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  request_type text not null default 'branch_change'
    check (request_type in ('branch_change', 'date_sheet_change')),
  from_branch_id uuid references public.branches (id) on delete set null,
  to_branch_id uuid references public.branches (id) on delete restrict,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  admin_note text,
  reviewed_by uuid references public.profiles (id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  check (
    case request_type
      when 'branch_change' then
        to_branch_id is not null
        and to_branch_id is distinct from from_branch_id
      when 'date_sheet_change' then
        from_branch_id is null and to_branch_id is null
      else false
    end
  )
);

create unique index change_requests_one_pending
  on public.change_requests (student_id) where status = 'pending';

-- ---------------------------------------------------------------------------
-- indexes
-- ---------------------------------------------------------------------------
create index idx_students_branch on public.students (branch_id);
create index idx_student_courses_student on public.student_courses (student_id);
create index idx_selections_student on public.student_exam_selections (student_id);
create index idx_change_requests_student on public.change_requests (student_id);
create index idx_exam_slots_date on public.exam_slots (slot_date);
create index idx_exam_slots_course on public.exam_slots (course_id);

-- ---------------------------------------------------------------------------
-- keep mirrored slot times in sync when an admin edits a slot
-- ---------------------------------------------------------------------------
create or replace function public.sync_slot_times()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.student_exam_selections
     set exam_date = new.slot_date,
         start_time = new.start_time,
         end_time = new.end_time
   where slot_id = new.id;
  return new;
end;
$$;

create trigger trg_sync_slot_times
  after update of slot_date, start_time, end_time on public.exam_slots
  for each row execute function public.sync_slot_times();

-- ---------------------------------------------------------------------------
-- helper: is the current user an admin?
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- row level security: every table locked down
-- Writes happen through security definer functions (student) or the
-- service-role key on the server (admin). RLS is defense in depth.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.branches enable row level security;
alter table public.courses enable row level security;
alter table public.students enable row level security;
alter table public.student_courses enable row level security;
alter table public.exam_slots enable row level security;
alter table public.student_exam_selections enable row level security;
alter table public.date_sheets enable row level security;
alter table public.change_requests enable row level security;

-- No UPDATE/INSERT policy on profiles for clients: roles must only be
-- written by the service-role key from the server (admin account creation).
create policy profiles_select_own_or_admin on public.profiles
  for select to authenticated
  using (id = (select auth.uid()) or public.is_admin());

create policy branches_select on public.branches
  for select to authenticated using (true);

create policy branches_write_admin on public.branches
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy courses_select on public.courses
  for select to authenticated using (true);

create policy courses_write_admin on public.courses
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy students_select_own_or_admin on public.students
  for select to authenticated
  using (profile_id = (select auth.uid()) or public.is_admin());

create policy students_insert_admin on public.students
  for insert to authenticated with check (public.is_admin());

create policy students_update_admin on public.students
  for update to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy students_delete_admin on public.students
  for delete to authenticated using (public.is_admin());

create policy student_courses_select on public.student_courses
  for select to authenticated
  using (
    public.is_admin()
    or student_id in (select id from public.students where profile_id = (select auth.uid()))
  );

create policy student_courses_write_admin on public.student_courses
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy exam_slots_select on public.exam_slots
  for select to authenticated using (true);

create policy exam_slots_write_admin on public.exam_slots
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy selections_select on public.student_exam_selections
  for select to authenticated
  using (
    public.is_admin()
    or student_id in (select id from public.students where profile_id = (select auth.uid()))
  );

create policy selections_write_admin on public.student_exam_selections
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy date_sheets_select on public.date_sheets
  for select to authenticated
  using (
    public.is_admin()
    or student_id in (select id from public.students where profile_id = (select auth.uid()))
  );

create policy change_requests_select on public.change_requests
  for select to authenticated
  using (
    public.is_admin()
    or student_id in (select id from public.students where profile_id = (select auth.uid()))
  );

create policy change_requests_insert_own on public.change_requests
  for insert to authenticated
  with check (
    student_id in (select id from public.students where profile_id = (select auth.uid()))
    and status = 'pending'
    and reviewed_at is null
  );
