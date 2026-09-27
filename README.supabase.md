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

## 5. Run the app

```bash
npm run dev
```

## 6. Test email flow

Open the applicant data page, open an applicant detail, and click **Kirim Email**.
The browser will open the user's default mail client with the applicant's email,
the status-specific subject, and the populated template body. The admin can edit
the draft and must click **Send** in the mail client to send it.

## Notes
- The bucket `dokumen-magang` must remain private.
- Only signed URLs should be used for document access from the frontend.
- The email feature does not use Resend or any server-side email provider.
- The `mailto:` flow only opens a draft; the application never sends the email automatically.
