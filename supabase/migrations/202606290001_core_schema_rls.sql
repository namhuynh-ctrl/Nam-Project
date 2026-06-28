-- Core schema and RLS policies for Quiz Intelligence.
-- Apply this migration in Supabase before enabling production traffic.

create extension if not exists pgcrypto;

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  code text not null unique,
  creator_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.course_members (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  student_id text not null,
  student_name varchar(20) not null,
  pin_code varchar(4) not null,
  created_at timestamptz not null default now(),
  unique (course_id, student_id),
  unique (course_id, student_name)
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  creator_id text not null,
  course_id uuid references public.courses(id) on delete set null,
  title text not null,
  timer_minutes integer not null default 15 check (timer_minutes > 0),
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  type text not null check (type in ('multiple_choice', 'true_false')),
  content text not null,
  points integer not null default 10 check (points > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  content text not null,
  is_correct boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  student_id text not null,
  display_name varchar(20) not null,
  score integer not null default 0,
  max_score integer not null default 10,
  raw_score integer not null default 0,
  raw_max_score integer not null default 0,
  duration_seconds integer not null default 0,
  attempt_number integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.responses (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references public.attempts(id) on delete cascade,
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  student_id text not null,
  question_id uuid not null references public.questions(id) on delete cascade,
  answer_id uuid not null references public.answers(id) on delete restrict,
  created_at timestamptz not null default now()
);

create index if not exists idx_courses_code on public.courses (lower(code));
create index if not exists idx_quizzes_course_id on public.quizzes (course_id);
create index if not exists idx_questions_quiz_id on public.questions (quiz_id);
create index if not exists idx_answers_question_id on public.answers (question_id);
create index if not exists idx_attempts_quiz_student on public.attempts (quiz_id, student_id);
create index if not exists idx_responses_attempt_id on public.responses (attempt_id);

alter table public.attempts add column if not exists display_name varchar(20) not null default 'Thí sinh';
alter table public.attempts add column if not exists max_score integer not null default 10;
alter table public.attempts add column if not exists raw_score integer not null default 0;
alter table public.attempts add column if not exists raw_max_score integer not null default 0;
alter table public.attempts add column if not exists attempt_number integer not null default 1;

alter table public.courses enable row level security;
alter table public.course_members enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.answers enable row level security;
alter table public.attempts enable row level security;
alter table public.responses enable row level security;

drop policy if exists "public can read courses by code" on public.courses;
create policy "public can read courses by code"
on public.courses for select
to anon, authenticated
using (true);

drop policy if exists "creators manage own courses" on public.courses;
create policy "creators manage own courses"
on public.courses for all
to authenticated
using (creator_id = auth.uid()::text)
with check (creator_id = auth.uid()::text);

-- Transitional policy for the current local prototype, which uses a PIN and
-- fixed creator_id instead of Supabase Auth. Remove after wiring real Auth.
drop policy if exists "prototype creator manages fixed courses" on public.courses;
create policy "prototype creator manages fixed courses"
on public.courses for all
to anon, authenticated
using (creator_id = 'creator-1')
with check (creator_id = 'creator-1');

drop policy if exists "students can join courses" on public.course_members;
create policy "students can join courses"
on public.course_members for insert
to anon, authenticated
with check (
  char_length(trim(student_name)) between 2 and 20
  and pin_code ~ '^[0-9]{4}$'
);

drop policy if exists "students can read course members for login" on public.course_members;
create policy "students can read course members for login"
on public.course_members for select
to anon, authenticated
using (true);

drop policy if exists "public can read published quizzes" on public.quizzes;
create policy "public can read published quizzes"
on public.quizzes for select
to anon, authenticated
using (status = 'published');

drop policy if exists "creators manage own quizzes" on public.quizzes;
create policy "creators manage own quizzes"
on public.quizzes for all
to authenticated
using (creator_id = auth.uid()::text)
with check (creator_id = auth.uid()::text);

drop policy if exists "prototype creator manages fixed quizzes" on public.quizzes;
create policy "prototype creator manages fixed quizzes"
on public.quizzes for all
to anon, authenticated
using (creator_id = 'creator-1')
with check (creator_id = 'creator-1');

drop policy if exists "public can read published quiz questions" on public.questions;
create policy "public can read published quiz questions"
on public.questions for select
to anon, authenticated
using (
  exists (
    select 1 from public.quizzes q
    where q.id = questions.quiz_id
    and q.status = 'published'
  )
);

drop policy if exists "creators manage own questions" on public.questions;
create policy "creators manage own questions"
on public.questions for all
to authenticated
using (
  exists (
    select 1 from public.quizzes q
    where q.id = questions.quiz_id
    and q.creator_id = auth.uid()::text
  )
)
with check (
  exists (
    select 1 from public.quizzes q
    where q.id = questions.quiz_id
    and q.creator_id = auth.uid()::text
  )
);

drop policy if exists "prototype creator manages fixed questions" on public.questions;
create policy "prototype creator manages fixed questions"
on public.questions for all
to anon, authenticated
using (
  exists (
    select 1 from public.quizzes q
    where q.id = questions.quiz_id
    and q.creator_id = 'creator-1'
  )
)
with check (
  exists (
    select 1 from public.quizzes q
    where q.id = questions.quiz_id
    and q.creator_id = 'creator-1'
  )
);

-- Do not grant anon SELECT on public.answers. Use public_answers for player payloads
-- and server-side service role routes for grading.
drop policy if exists "creators manage own answers" on public.answers;
create policy "creators manage own answers"
on public.answers for all
to authenticated
using (
  exists (
    select 1
    from public.questions qn
    join public.quizzes qz on qz.id = qn.quiz_id
    where qn.id = answers.question_id
    and qz.creator_id = auth.uid()::text
  )
)
with check (
  exists (
    select 1
    from public.questions qn
    join public.quizzes qz on qz.id = qn.quiz_id
    where qn.id = answers.question_id
    and qz.creator_id = auth.uid()::text
  )
);

drop policy if exists "prototype creator manages fixed answers" on public.answers;
create policy "prototype creator manages fixed answers"
on public.answers for all
to anon, authenticated
using (
  exists (
    select 1
    from public.questions qn
    join public.quizzes qz on qz.id = qn.quiz_id
    where qn.id = answers.question_id
    and qz.creator_id = 'creator-1'
  )
)
with check (
  exists (
    select 1
    from public.questions qn
    join public.quizzes qz on qz.id = qn.quiz_id
    where qn.id = answers.question_id
    and qz.creator_id = 'creator-1'
  )
);

create or replace view public.public_answers as
select
  a.id,
  a.question_id,
  a.content
from public.answers a
join public.questions qn on qn.id = a.question_id
join public.quizzes qz on qz.id = qn.quiz_id
where qz.status = 'published';

grant select on public.public_answers to anon, authenticated;

drop policy if exists "public can read attempts" on public.attempts;
create policy "public can read attempts"
on public.attempts for select
to anon, authenticated
using (true);

drop policy if exists "public can insert attempts through api fallback" on public.attempts;
create policy "public can insert attempts through api fallback"
on public.attempts for insert
to anon, authenticated
with check (false);

drop policy if exists "public can read own responses by attempt context" on public.responses;
create policy "public can read own responses by attempt context"
on public.responses for select
to authenticated
using (false);

drop policy if exists "public cannot insert responses directly" on public.responses;
create policy "public cannot insert responses directly"
on public.responses for insert
to anon, authenticated
with check (false);
