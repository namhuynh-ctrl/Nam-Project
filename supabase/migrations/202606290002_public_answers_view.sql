-- Repair/ensure the public answer-choice view exists.
-- This view intentionally excludes answers.is_correct.

drop view if exists public.public_answers;

create view public.public_answers as
select
  a.id,
  a.question_id,
  a.content
from public.answers a
join public.questions qn on qn.id = a.question_id
join public.quizzes qz on qz.id = qn.quiz_id
where qz.status = 'published';

grant select on public.public_answers to anon, authenticated;
