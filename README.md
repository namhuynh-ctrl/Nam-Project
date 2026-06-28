# Quiz Intelligence

Next.js 16 + Supabase + Gemini quiz builder/player prototype.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
NEXT_PUBLIC_ENABLE_PIN_LOGIN=false
ENABLE_PROTOTYPE_CLAIM=false
```

`SUPABASE_SERVICE_ROLE_KEY` is required by `/api/submit-attempt` so grading happens on the server without exposing `answers.is_correct` to the player.

3. Apply Supabase schema/RLS:

```text
supabase/migrations/202606290001_core_schema_rls.sql
supabase/migrations/202606290002_public_answers_view.sql
supabase/migrations/202606290003_remove_prototype_policies.sql
```

You can run it through Supabase SQL Editor or your Supabase CLI workflow.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Verification

```bash
npm run lint
npm run build
```

Both commands should pass before deploying.

## Deploy to Vercel

The repo includes `vercel.json` for the standard Next.js build on Vercel.

1. Create/import the project on Vercel.
2. Set these Environment Variables for Production, Preview, and Development as needed:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
GEMINI_API_KEY=...
NEXT_PUBLIC_ENABLE_PIN_LOGIN=false
ENABLE_PROTOTYPE_CLAIM=false
```

3. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Do not expose it with a `NEXT_PUBLIC_` prefix.
4. Confirm Supabase production hardening is done:
   - `202606290001_core_schema_rls.sql`
   - `202606290002_public_answers_view.sql`
   - `202606290003_remove_prototype_policies.sql`
5. Run a local final check:

```bash
npm run lint
npm run build
```

6. Deploy through the Vercel dashboard, or with the Vercel CLI:

```bash
npx vercel
npx vercel --prod
```

After deployment, smoke test teacher login, dashboard, analytics, CSV export, public join, public quiz play, and quiz submission.

## Current Backend Notes

- Teacher login supports Supabase Auth email/password. The legacy PIN mode remains as a prototype fallback and maps to `creator-1`.
- Authenticated teachers can claim prototype-owned data from `/api/claim-prototype-data`, moving `creator-1` courses/quizzes to their Supabase user id.
- `NEXT_PUBLIC_ENABLE_PIN_LOGIN=true` is required to show the legacy PIN fallback.
- `ENABLE_PROTOTYPE_CLAIM=true` is required to enable the claim endpoint. Keep it `false` after migration.
- Analytics and CSV export APIs require a Supabase Auth Bearer token and verify that the teacher owns the quiz.
- Player reads quiz payloads from `/api/public-quiz/[quizId]`, which excludes `is_correct`.
- Player submits attempts to `/api/submit-attempt`.
- `/api/submit-attempt` uses the Supabase service role on the server to read correct answers, calculate score, save `attempts`, and save per-question `responses`.
- Teachers can export quiz attempt results as CSV from `/api/export-quiz/[quizId]`.
- Teachers can inspect per-question analytics from `/course/[courseId]/analytics/[quizId]`, backed by `/api/quiz-analytics/[quizId]`.
- `public_answers` is kept as a DB-level safe view for future public/client use, but the player no longer depends on it.
- The migration includes transitional RLS policies for the current prototype creator id `creator-1`. Remove those policies after replacing the local PIN teacher login with Supabase Auth.
