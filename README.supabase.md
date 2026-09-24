# Supabase Setup for Frontend Admin

## 1. Copy environment variables

Copy `.env.example` to `.env` and fill in the real values:

```bash
cp .env.example .env
```

Example values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SUPABASE_STORAGE_BUCKET=dokumen-magang
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
RESEND_API_KEY=your_resend_key
SUPABASE_PROJECT_ID=your_project_ref
```

## 2. Install Supabase CLI

```bash
npm install -g supabase
```

## 3. Link the project

```bash
supabase login
supabase link --project-ref <your-project-ref>
```

## 4. Apply database migration

```bash
supabase db push
```

## 5. Deploy Edge Function

```bash
supabase functions deploy send-magang-email
```

## 6. Add secrets

```bash
supabase secrets set RESEND_API_KEY=your_resend_key SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 7. Run the app

```bash
npm run dev
```

## 8. Test email flow

Use the `send-magang-email` function with a valid `pelamar_id` from `pelamar_magang` table.

Example payload:

```json
{
  "pelamar_id": "<uuid-from-pelamar-magang>"
}
```

The function will:
- fetch the pelamar record
- validate email and status
- choose the email template
- send via Resend
- log the result to `email_logs`

## Notes
- The bucket `dokumen-magang` must remain private.
- Only signed URLs should be used for document access from the frontend.
- Do not expose service-role or email provider secrets in the frontend.
