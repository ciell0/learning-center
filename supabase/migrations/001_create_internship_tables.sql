CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS public.pelamar_magang (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama_lengkap text,
  nim text,
  universitas text,
  fakultas text,
  semester integer,
  jurusan text,
  no_telp text,
  email text,
  jenis_program text,
  divisi text,
  periode_magang integer,
  no_surat_rekom text,
  tanggal_daftar date,
  catatan_admin text,
  tindakan_admin text,
  status text NOT NULL DEFAULT 'waiting',
  cv_path text,
  transkrip_path text,
  surat_rekomendasi_path text,
  proposal_path text,
  ktp_path text,
  portofolio_path text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.email_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pelamar_id uuid NOT NULL REFERENCES public.pelamar_magang(id) ON DELETE CASCADE,
  recipient_email text,
  status text NOT NULL CHECK (status IN ('sent', 'failed')),
  template text,
  provider_message_id text,
  sent_at timestamptz,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_pelamar_magang ON public.pelamar_magang;
CREATE TRIGGER set_updated_at_pelamar_magang
BEFORE UPDATE ON public.pelamar_magang
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX IF NOT EXISTS idx_pelamar_magang_status ON public.pelamar_magang(status);
CREATE INDEX IF NOT EXISTS idx_pelamar_magang_divisi ON public.pelamar_magang(divisi);
CREATE INDEX IF NOT EXISTS idx_pelamar_magang_email ON public.pelamar_magang(email);
CREATE INDEX IF NOT EXISTS idx_email_logs_pelamar_id ON public.email_logs(pelamar_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_created_at ON public.email_logs(created_at DESC);

ALTER TABLE public.pelamar_magang ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read pelamar_magang"
ON public.pelamar_magang FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert pelamar_magang"
ON public.pelamar_magang FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update pelamar_magang"
ON public.pelamar_magang FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete pelamar_magang"
ON public.pelamar_magang FOR DELETE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read email_logs"
ON public.email_logs FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert email_logs"
ON public.email_logs FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update email_logs"
ON public.email_logs FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete email_logs"
ON public.email_logs FOR DELETE
USING (auth.role() = 'authenticated');

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('dokumen-magang', 'dokumen-magang', false, 5242880, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can view private document objects"
ON storage.objects FOR SELECT
USING (bucket_id = 'dokumen-magang' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upload document objects"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'dokumen-magang' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update document objects"
ON storage.objects FOR UPDATE
USING (bucket_id = 'dokumen-magang' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'dokumen-magang' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete document objects"
ON storage.objects FOR DELETE
USING (bucket_id = 'dokumen-magang' AND auth.role() = 'authenticated');
