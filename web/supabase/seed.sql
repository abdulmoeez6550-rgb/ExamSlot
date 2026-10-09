-- ExamSlot demo seed data
-- Run last, on a fresh project: 0001 -> 0002 -> seed.sql
-- Safe to re-run: every insert uses ON CONFLICT DO NOTHING (or a guard),
-- so a second run skips existing rows instead of failing.

-- ---------------------------------------------------------------------------
-- demo accounts (email/password auth, supported GoTrue seeding)
--   admin@examslot.local    / Admin@1234
--   student1@examslot.local / Student@123
--   student2@examslot.local / Student@123
--   student3@examslot.local / Student@123
--   student4@examslot.local / Student@123
--   student5@examslot.local / Student@123
-- ---------------------------------------------------------------------------
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
)
values
  ('00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'authenticated', 'authenticated',
   'admin@examslot.local', crypt('Admin@1234', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Demo Admin"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222221', 'authenticated', 'authenticated',
   'student1@examslot.local', crypt('Student@123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Ayesha Khan"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'authenticated', 'authenticated',
   'student2@examslot.local', crypt('Student@123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Bilal Ahmed"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222223', 'authenticated', 'authenticated',
   'student3@examslot.local', crypt('Student@123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Hina Raza"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222224', 'authenticated', 'authenticated',
   'student4@examslot.local', crypt('Student@123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Usman Tariq"}', now(), now()),
  ('00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222225', 'authenticated', 'authenticated',
   'student5@examslot.local', crypt('Student@123', gen_salt('bf')), now(),
   '{"provider":"email","providers":["email"]}', '{"full_name":"Fatima Noor"}', now(), now())
on conflict do nothing;

insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
select gen_random_uuid(), u.id,
       jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
       'email', u.id::text, now(), now(), now()
from auth.users u
where u.email in (
  'admin@examslot.local', 'student1@examslot.local', 'student2@examslot.local',
  'student3@examslot.local', 'student4@examslot.local', 'student5@examslot.local'
)
  and not exists (
    select 1 from auth.identities i where i.user_id = u.id and i.provider = 'email'
  );

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
insert into public.profiles (id, email, full_name, role)
values
  ('11111111-1111-1111-1111-111111111111', 'admin@examslot.local', 'Demo Admin', 'admin'),
  ('22222222-2222-2222-2222-222222222221', 'student1@examslot.local', 'Ayesha Khan', 'student'),
  ('22222222-2222-2222-2222-222222222222', 'student2@examslot.local', 'Bilal Ahmed', 'student'),
  ('22222222-2222-2222-2222-222222222223', 'student3@examslot.local', 'Hina Raza', 'student'),
  ('22222222-2222-2222-2222-222222222224', 'student4@examslot.local', 'Usman Tariq', 'student'),
  ('22222222-2222-2222-2222-222222222225', 'student5@examslot.local', 'Fatima Noor', 'student')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- branches
-- ---------------------------------------------------------------------------
insert into public.branches (id, code, name)
values
  ('33333333-3333-3333-3333-333333333301', 'CSE', 'Computer Science & Engineering'),
  ('33333333-3333-3333-3333-333333333302', 'BBA', 'Business Administration'),
  ('33333333-3333-3333-3333-333333333303', 'EEE', 'Electrical Engineering')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- courses
-- ---------------------------------------------------------------------------
insert into public.courses (id, code, title, credit_hours)
values
  ('44444444-4444-4444-4444-444444444401', 'CS101', 'Programming Fundamentals', 3),
  ('44444444-4444-4444-4444-444444444402', 'CS201', 'Data Structures', 3),
  ('44444444-4444-4444-4444-444444444403', 'MA101', 'Calculus', 3),
  ('44444444-4444-4444-4444-444444444404', 'PH101', 'Applied Physics', 2),
  ('44444444-4444-4444-4444-444444444405', 'EE201', 'Circuit Analysis', 3),
  ('44444444-4444-4444-4444-444444444406', 'BA101', 'Principles of Management', 3),
  ('44444444-4444-4444-4444-444444444407', 'CS301', 'Database Systems', 3),
  ('44444444-4444-4444-4444-444444444408', 'CS401', 'Web Engineering', 3)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- students: 5 total, every personal, guardian and academic field filled.
-- student1 (CSE selected + pending branch change request) -> locked-state demo
-- student4 (BBA selected)                                 -> second locked state
-- student2, student3, student5 (no branch yet)            -> one-time selection demo
-- ---------------------------------------------------------------------------
insert into public.students (
  id, profile_id, registration_no, branch_id,
  father_name, mother_name, guardian_name, guardian_relation, guardian_phone,
  date_of_birth, gender, cnic, phone, address, city,
  program, session, semester, section, admission_date,
  previous_qualification, previous_percentage
)
values
  ('66666666-6666-6666-6666-666666666601', '22222222-2222-2222-2222-222222222221',
   'LU-2026-0001', '33333333-3333-3333-3333-333333333301',
   'Imran Khan', 'Sana Khan', 'Imran Khan', 'father', '+92-300-1112223',
   '2004-05-14', 'female', '35202-1234567-8', '+92-321-1234567',
   '12 Garden Town', 'Lahore',
   'BS Computer Science', 'Fall 2026', 5, 'A', '2026-08-01',
   'Intermediate (FSc)', 88.50),
  ('66666666-6666-6666-6666-666666666602', '22222222-2222-2222-2222-222222222222',
   'LU-2026-0002', null,
   'Naveed Ahmed', 'Rukhsana Bibi', 'Naveed Ahmed', 'father', '+92-301-2223334',
   '2003-11-02', 'male', '35201-2345678-9', '+92-333-2223334',
   '45 Model Town', 'Lahore',
   'BS Business Administration', 'Fall 2026', 3, 'B', '2026-08-01',
   'Intermediate (ICS)', 79.00),
  ('66666666-6666-6666-6666-666666666603', '22222222-2222-2222-2222-222222222223',
   'LU-2026-0003', null,
   'Rashid Raza', 'Farah Raza', 'Rashid Raza', 'father', '+92-302-3334445',
   '2004-09-21', 'female', '35203-3456789-0', '+92-345-3334445',
   '78 Johar Town', 'Lahore',
   'BS Electrical Engineering', 'Fall 2026', 7, 'A', '2026-08-01',
   'Intermediate (Pre-Engineering)', 91.25),
  ('66666666-6666-6666-6666-666666666604', '22222222-2222-2222-2222-222222222224',
   'LU-2026-0004', '33333333-3333-3333-3333-333333333302',
   'Kamran Aslam', 'Nadia Aslam', 'Nadia Aslam', 'mother', '+92-303-4445556',
   '2002-12-09', 'male', '35201-4567890-1', '+92-361-4445556',
   '9 Model Square', 'Karachi',
   'BS Business Administration', 'Fall 2026', 5, 'A', '2026-08-01',
   'Intermediate (Commerce)', 73.40),
  ('66666666-6666-6666-6666-666666666605', '22222222-2222-2222-2222-222222222225',
   'LU-2026-0005', null,
   'Zafar Iqbal', 'Rabia Zafar', 'Zafar Iqbal', 'father', '+92-304-5556677',
   '2004-02-28', 'female', '35202-5678901-2', '+92-371-5556677',
   '33 Clifton Road', 'Karachi',
   'BS Computer Science', 'Fall 2026', 1, 'C', '2026-08-01',
   'Intermediate (Pre-Engineering)', 84.75)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- course assignments: 5 / 4 / 6 / 4 / 5 courses (4-6 rule window)
-- ---------------------------------------------------------------------------
insert into public.student_courses (student_id, course_id)
values
  ('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444401'),
  ('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444402'),
  ('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444403'),
  ('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444404'),
  ('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444407'),
  ('66666666-6666-6666-6666-666666666602', '44444444-4444-4444-4444-444444444406'),
  ('66666666-6666-6666-6666-666666666602', '44444444-4444-4444-4444-444444444403'),
  ('66666666-6666-6666-6666-666666666602', '44444444-4444-4444-4444-444444444404'),
  ('66666666-6666-6666-6666-666666666602', '44444444-4444-4444-4444-444444444401'),
  ('66666666-6666-6666-6666-666666666603', '44444444-4444-4444-4444-444444444401'),
  ('66666666-6666-6666-6666-666666666603', '44444444-4444-4444-4444-444444444402'),
  ('66666666-6666-6666-6666-666666666603', '44444444-4444-4444-4444-444444444405'),
  ('66666666-6666-6666-6666-666666666603', '44444444-4444-4444-4444-444444444407'),
  ('66666666-6666-6666-6666-666666666603', '44444444-4444-4444-4444-444444444408'),
  ('66666666-6666-6666-6666-666666666603', '44444444-4444-4444-4444-444444444403'),
  ('66666666-6666-6666-6666-666666666604', '44444444-4444-4444-4444-444444444406'),
  ('66666666-6666-6666-6666-666666666604', '44444444-4444-4444-4444-444444444403'),
  ('66666666-6666-6666-6666-666666666604', '44444444-4444-4444-4444-444444444401'),
  ('66666666-6666-6666-6666-666666666604', '44444444-4444-4444-4444-444444444404'),
  ('66666666-6666-6666-6666-666666666605', '44444444-4444-4444-4444-444444444401'),
  ('66666666-6666-6666-6666-666666666605', '44444444-4444-4444-4444-444444444402'),
  ('66666666-6666-6666-6666-666666666605', '44444444-4444-4444-4444-444444444407'),
  ('66666666-6666-6666-6666-666666666605', '44444444-4444-4444-4444-444444444408'),
  ('66666666-6666-6666-6666-666666666605', '44444444-4444-4444-4444-444444444403')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- exam slots: every course gets the same 7 sittings on future dates.
-- - The same date/time appears for DIFFERENT courses (parallel papers are
--   allowed; uniqueness is per course + date + start).
-- - Day +14 10:00-12:00 deliberately overlaps 09:00-11:00 so the overlap
--   rejection rule can be demonstrated live.
-- - The other sittings are pairwise non-overlapping, so any 4-6 courses can
--   always be scheduled conflict-free.
-- Guarded with WHERE NOT EXISTS: a second run does not duplicate sittings.
-- ---------------------------------------------------------------------------
insert into public.exam_slots (id, course_id, slot_date, start_time, end_time)
select gen_random_uuid(), c.id, v.slot_date, v.start_time, v.end_time
from public.courses c
cross join (values
  ((current_date + 14)::date, '09:00'::time, '11:00'::time),
  ((current_date + 14)::date, '10:00'::time, '12:00'::time),
  ((current_date + 14)::date, '12:00'::time, '14:00'::time),
  ((current_date + 15)::date, '09:00'::time, '11:00'::time),
  ((current_date + 15)::date, '14:00'::time, '16:00'::time),
  ((current_date + 16)::date, '09:00'::time, '11:00'::time),
  ((current_date + 16)::date, '12:00'::time, '14:00'::time)
) as v(slot_date, start_time, end_time)
where not exists (select 1 from public.exam_slots)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- one pending branch change request (student1: CSE -> EEE) for the
-- admin approval demo; approval grants a single-use branch unlock.
-- ---------------------------------------------------------------------------
insert into public.change_requests (id, student_id, request_type, from_branch_id, to_branch_id)
values
  ('55555555-5555-5555-5555-5555555555f1',
   '66666666-6666-6666-6666-666666666601',
   'branch_change',
   '33333333-3333-3333-3333-333333333301',
   '33333333-3333-3333-3333-333333333303')
on conflict do nothing;
