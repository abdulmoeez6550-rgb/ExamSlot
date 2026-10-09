-- ExamSlot server-side business rules
-- Run after 202610090001_init_schema.sql
-- All rules are enforced here, in the database, so they cannot be bypassed
-- from the client.

-- ---------------------------------------------------------------------------
-- helper: current student's id (raises when the account is not a student)
-- ---------------------------------------------------------------------------
create or replace function public.current_student_id()
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  select id into v_id from public.students where profile_id = (select auth.uid());
  if v_id is null then
    raise exception 'No student profile is linked to this account.';
  end if;
  return v_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- course rules: max 6 courses, no changes once the date sheet is locked.
-- Locks the student row so concurrent assignment inserts cannot both observe
-- a count of 6 and commit 7 rows.
-- ---------------------------------------------------------------------------
create or replace function public.enforce_course_rules()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_id uuid := coalesce(new.student_id, old.student_id);
begin
  perform 1 from public.students where id = v_student_id for update;

  if not found then
    -- Student row already gone: this row is being removed by a cascade
    -- delete, nothing left to protect.
    return coalesce(new, old);
  end if;

  if exists (select 1 from public.date_sheets where student_id = v_student_id) then
    raise exception 'The date sheet is already locked; course assignments cannot be changed.';
  end if;

  if tg_op = 'INSERT' and (
    select count(*) from public.student_courses where student_id = v_student_id
  ) > 6 then
    raise exception 'A student can be assigned at most 6 courses.';
  end if;

  return coalesce(new, old);
end;
$$;

create trigger trg_course_rules
  after insert or update or delete on public.student_courses
  for each row execute function public.enforce_course_rules();

-- ---------------------------------------------------------------------------
-- branch selection: allowed once, then only with an approved single-use unlock
-- ---------------------------------------------------------------------------
create or replace function public.select_student_branch(p_branch_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student public.students%rowtype;
  v_consume boolean := false;
begin
  select * into v_student
    from public.students
   where profile_id = (select auth.uid())
   for update;

  if not found then
    raise exception 'No student profile is linked to this account.';
  end if;

  if not exists (select 1 from public.branches where id = p_branch_id) then
    raise exception 'The selected branch does not exist.';
  end if;

  if exists (select 1 from public.date_sheets where student_id = v_student.id) then
    raise exception 'Your date sheet is already locked. Branch cannot be changed.';
  end if;

  if v_student.branch_id is null then
    v_consume := false; -- first branch selection is free
  elsif v_student.branch_change_credits > 0 then
    v_consume := true; -- consume one single-use unlock
  else
    raise exception 'Your branch is already locked. Submit a change request to request a new branch.';
  end if;

  update public.students
     set branch_id = p_branch_id,
         branch_change_credits = branch_change_credits - case when v_consume then 1 else 0 end
   where id = v_student.id;
end;
$$;

-- ---------------------------------------------------------------------------
-- exam slot selection: only assigned courses, no overlapping exams,
-- changeable until the date sheet is locked
-- ---------------------------------------------------------------------------
create or replace function public.select_exam_slot(p_course_id uuid, p_slot_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_id uuid := public.current_student_id();
  v_slot public.exam_slots%rowtype;
begin
  -- Serialize with save_date_sheet / other selections on the student row,
  -- THEN check the lock, so no selection can slip in after the save.
  perform 1 from public.students where id = v_student_id for update;

  if exists (select 1 from public.date_sheets where student_id = v_student_id) then
    raise exception 'Your date sheet is already locked. Contact the admin to request changes.';
  end if;

  if not exists (
    select 1 from public.student_courses
     where student_id = v_student_id and course_id = p_course_id
  ) then
    raise exception 'This course is not assigned to you.';
  end if;

  select * into v_slot from public.exam_slots where id = p_slot_id;
  if not found then
    raise exception 'Exam slot not found.';
  end if;

  if v_slot.course_id <> p_course_id then
    raise exception 'This exam slot does not belong to the selected course.';
  end if;

  if v_slot.slot_date < current_date then
    raise exception 'Cannot select an exam slot in the past.';
  end if;

  -- Full time-range overlap test (not just equal start times):
  -- two ranges conflict when each starts before the other ends.
  if exists (
    select 1
      from public.student_exam_selections s
     where s.student_id = v_student_id
       and s.course_id <> p_course_id
       and s.exam_date = v_slot.slot_date
       and s.start_time < v_slot.end_time
       and v_slot.start_time < s.end_time
  ) then
    raise exception 'This exam slot overlaps with another exam you have already selected.';
  end if;

  insert into public.student_exam_selections
    (student_id, course_id, slot_id, exam_date, start_time, end_time)
  values
    (v_student_id, p_course_id, v_slot.id, v_slot.slot_date, v_slot.start_time, v_slot.end_time)
  on conflict (student_id, course_id)
  do update
     set slot_id = excluded.slot_id,
         exam_date = excluded.exam_date,
         start_time = excluded.start_time,
         end_time = excluded.end_time,
         created_at = now();
exception
  -- Fallback for any race the pre-check could not see: the gist exclusion
  -- constraint rejects overlapping ranges regardless of start times.
  when exclusion_violation then
    raise exception 'This exam slot overlaps with another exam you have already selected.';
end;
$$;

-- ---------------------------------------------------------------------------
-- date sheet: atomic, one-time save and lock
-- ---------------------------------------------------------------------------
create or replace function public.save_date_sheet()
returns public.date_sheets
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_id uuid := public.current_student_id();
  v_count int;
  v_selected int;
  v_sheet public.date_sheets%rowtype;
begin
  -- Lock the student row first: serializes against branch selection,
  -- slot selection, course assignment triggers and date-sheet unlocks, so
  -- concurrent requests can never interleave between the checks below and
  -- the insert.
  perform 1 from public.students where id = v_student_id for update;

  if exists (select 1 from public.date_sheets where student_id = v_student_id) then
    raise exception 'Your date sheet has already been saved and locked.';
  end if;

  if not exists (select 1 from public.students where id = v_student_id and branch_id is not null) then
    raise exception 'Select your branch before saving the date sheet.';
  end if;

  select count(*) into v_count
    from public.student_courses
   where student_id = v_student_id;

  if v_count < 4 then
    raise exception 'You need at least 4 assigned courses before saving the date sheet (you have %).', v_count;
  end if;
  if v_count > 6 then
    raise exception 'A student cannot have more than 6 assigned courses.';
  end if;

  select count(*)
    into v_selected
    from public.student_exam_selections s
    join public.student_courses sc
      on sc.student_id = s.student_id
     and sc.course_id = s.course_id
   where s.student_id = v_student_id;

  if v_selected <> v_count then
    raise exception 'Select an exam slot for every assigned course before saving (% of % selected).', v_selected, v_count;
  end if;

  if exists (
    select 1
      from public.student_exam_selections a
      join public.student_exam_selections b
        on a.student_id = b.student_id
       and a.id < b.id
       and a.exam_date = b.exam_date
       and a.start_time < b.end_time
       and b.start_time < a.end_time
     where a.student_id = v_student_id
  ) then
    raise exception 'Two selected exams overlap. Fix the conflict before saving.';
  end if;

  insert into public.date_sheets (student_id, slot_count)
  values (v_student_id, v_count)
  returning * into v_sheet;

  return v_sheet;
exception
  when unique_violation then
    raise exception 'Your date sheet has already been saved and locked.';
end;
$$;

-- ---------------------------------------------------------------------------
-- change requests: reviewed exactly once (SELECT ... FOR UPDATE re-reads the
-- committed status, so a concurrent double-approve cannot grant credits
-- twice). Approval grants exactly one single-use credit of the request's
-- type: branch_change -> branch_change_credits,
--      date_sheet_change -> date_sheet_change_credits.
-- ---------------------------------------------------------------------------
create or replace function public.review_change_request(
  p_request_id uuid,
  p_approve boolean,
  p_note text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.change_requests%rowtype;
begin
  if not public.is_admin() then
    raise exception 'Only an administrator can review change requests.';
  end if;

  select * into v_request
    from public.change_requests
   where id = p_request_id
   for update;

  if not found then
    raise exception 'Change request not found.';
  end if;

  if v_request.status <> 'pending' then
    raise exception 'This request has already been reviewed.';
  end if;

  update public.change_requests
     set status = case when p_approve then 'approved' else 'rejected' end,
         admin_note = p_note,
         reviewed_by = (select auth.uid()),
         reviewed_at = now()
   where id = p_request_id;

  if p_approve then
    if v_request.request_type = 'branch_change' then
      update public.students
         set branch_change_credits = branch_change_credits + 1
       where id = v_request.student_id;
    else
      update public.students
         set date_sheet_change_credits = date_sheet_change_credits + 1
       where id = v_request.student_id;
    end if;
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- date-sheet unlock: consumes exactly one credit granted by an approved
-- date_sheet_change request, then removes the lock row so the student can
-- edit selections and save again. The unique(student_id) constraint is never
-- a permanent block: the row is deleted here, and re-saving inserts a fresh
-- one. Concurrent unlocks are serialized on the date-sheet row, and the
-- credits >= 0 check stops a double-spend.
-- ---------------------------------------------------------------------------
create or replace function public.unlock_date_sheet()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_student_id uuid := public.current_student_id();
begin
  perform 1 from public.date_sheets where student_id = v_student_id for update;

  if not found then
    raise exception 'You have no saved date sheet to unlock.';
  end if;

  update public.students
     set date_sheet_change_credits = date_sheet_change_credits - 1
   where id = v_student_id
     and date_sheet_change_credits > 0;

  if not found then
    raise exception 'You do not have an approved date-sheet change. Submit a change request and wait for admin approval.';
  end if;

  delete from public.date_sheets where student_id = v_student_id;
end;
$$;
