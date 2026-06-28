-- Production hardening: remove prototype creator_id fallback policies.
-- Run this only after prototype data has been claimed by a real Supabase Auth user.

drop policy if exists "prototype creator manages fixed courses" on public.courses;
drop policy if exists "prototype creator manages fixed quizzes" on public.quizzes;
drop policy if exists "prototype creator manages fixed questions" on public.questions;
drop policy if exists "prototype creator manages fixed answers" on public.answers;
