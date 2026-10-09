
# ExamSlot — OpenCode Project Instructions

## Project
ExamSlot — LoopVerse 3.0 Hackathon

Build a full-stack, responsive exam date sheet management system for a multi-branch virtual university.

## Technology
- Next.js App Router
- React and TypeScript
- Tailwind CSS
- pnpm
- Supabase PostgreSQL and Auth
- Vercel for deployment

## Team Responsibilities
Abdul:
- Database and authentication
- Backend APIs
- Business logic and validation
- Supabase integration
- Deployment

Teammate:
- Admin and student interfaces
- Forms, tables and navigation
- Responsive design
- Printable date sheet
- UI testing

## Critical Requirements
1. Admin manages branches, courses, students, assignments, exam slots and requests.
2. Students log in using email and password.
3. Each student must have 4 to 6 courses before creating a date sheet.
4. Students select their exam branch only once.
5. Students select one valid exam slot per assigned course.
6. Reject overlapping exams.
7. Date sheets can be saved only once unless an approved change unlocks them.
8. Admin can approve or reject change requests.
9. Search and pagination must run on the server.
10. Student information must be protected by role-based authorization.

## OpenCode Rules
- Inspect existing code before making changes.
- Use pnpm, not npm or yarn.
- Do not delete working functionality.
- Never expose Supabase secret keys.
- Do not create fake authentication.
- Enforce important rules on the backend.
- Use clear and reusable components.
- Avoid unnecessary dependencies.
- Keep the interface responsive at 360px.
- Do not modify files assigned to the other teammate without coordination.
- Explain files changed after every task.
- Run appropriate tests and report any errors.
- Work in small phases, not the entire project at once.

## GitHub
- main: stable integration branch
- abdul/core: backend development
- teammate/ui: frontend development

Commit tested changes frequently.

## Goal
Prioritize a fully functional, secure, demo-ready application before adding bonus features.
