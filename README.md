# Daily Ahad website

## Setup

1. Install dependencies with `npm install`.
2. Create a Supabase project and run `supabase/setup.sql` in its SQL Editor. The script is safe to re-run.
3. In Supabase Authentication, disable **Allow new users to sign up**, then add and confirm your admin user. Any authenticated user can update site settings, so keep public signups disabled.
4. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (the project's publishable/anon key).
5. Add the newspaper cover image at `public/images/newspaper-cover.png`, or upload it later at `/admin/settings`.
6. Run `npm run dev`, then sign in at `/admin/login`. Set the WhatsApp number in international format using digits only (for example `923001234567`). It starts empty, so the public WhatsApp button remains disabled until a valid number is saved.
7. Run `npm run build` before deployment. On Vercel, set the same two `VITE_` variables; `vercel.json` configures SPA routing.
