import { APPLICANTS, type Applicant, type Status } from '../app/components/data';
import { hasSupabaseConfig, supabase, SUPABASE_STORAGE_BUCKET } from '../lib/supabase';

export type PelamarMagangRow = {
  id: string;
  nama_lengkap: string | null;
  nim: string | null;
  universitas: string | null;
  fakultas: string | null;
  semester: number | null;
  jurusan: string | null;
  no_telp: string | null;
  email: string | null;
  jenis_program: string | null;
  divisi: string | null;
  periode_magang: number | null;
  no_surat_rekom: string | null;
  tanggal_daftar: string | null;
  catatan_admin: string | null;
  tindakan_admin: string | null;
  status: string | null;
  cv_path: string | null;
  transkrip_path: string | null;
  surat_rekomendasi_path: string | null;
  proposal_path: string | null;
  ktp_path: string | null;
  portofolio_path: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

const DOCUMENT_DEFINITIONS = [
  { key: 'cv_path', label: 'CV' },
  { key: 'transkrip_path', label: 'Transkrip Nilai' },
  { key: 'surat_rekomendasi_path', label: 'Surat Rekomendasi' },
  { key: 'proposal_path', label: 'Proposal' },
  { key: 'ktp_path', label: 'KTP' },
  { key: 'portofolio_path', label: 'Portofolio' },
] as const;

const mapStatus = (status: string | null | undefined): Status => {
  if (status === 'terverifikasi') return 'terverifikasi';
  if (status === 'accepted') return 'accepted';
  if (status === 'rejected') return 'rejected';
  if (status === 'review') return 'review';
  return 'waiting';
};

function normalizeDocumentList(row: PelamarMagangRow): Applicant['documents'] {
  return DOCUMENT_DEFINITIONS.flatMap(({ key, label }) => {
    const path = row[key] as string | null;
    if (!path) return [];

    const extension = path.split('.').pop()?.toLowerCase() || 'file';
    return [{
      name: label,
      type: extension === 'jpg' || extension === 'jpeg' ? 'jpg' : extension,
      path,
      url: '',
    }];
  });
}

function mapRowToApplicant(row: PelamarMagangRow): Applicant {
  return {
    id: String(row.id),
    name: row.nama_lengkap || 'Nama belum tersedia',
    nim: row.nim || '-',
    university: row.universitas || '-',
    faculty: row.fakultas || '-',
    major: row.jurusan || '-',
    semester: Number(row.semester || 0),
    phone: row.no_telp || '-',
    email: row.email || '-',
    division: row.divisi || 'Belum ditempatkan',
    program: row.jenis_program || 'Program belum ditentukan',
    period: row.periode_magang ? `Periode ${row.periode_magang}` : 'Belum ditentukan',
    registrationDate: row.tanggal_daftar || new Date().toISOString().slice(0, 10),
    status: mapStatus(row.status),
    skills: [],
    recommendationLetterNo: row.no_surat_rekom || '-',
    documents: normalizeDocumentList(row),
    adminNotes: row.catatan_admin || '',
    action: row.tindakan_admin || '',
  };
}

export async function getPelamar(): Promise<Applicant[]> {
  if (!hasSupabaseConfig()) {
    return APPLICANTS;
  }

  const { data, error } = await supabase
    .from('pelamar_magang')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message || 'Gagal memuat data pelamar dari Supabase.');
  }

  return (data || []).map(mapRowToApplicant);
}

export async function getPelamarById(id: string): Promise<Applicant | null> {
  if (!hasSupabaseConfig()) {
    return APPLICANTS.find((applicant) => applicant.id === id) || null;
  }

  const { data, error } = await supabase
    .from('pelamar_magang')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw new Error(error.message || 'Gagal membuka detail pelamar.');
  }

  return mapRowToApplicant(data as PelamarMagangRow);
}

export async function updateCatatanPelamar(id: string, catatan_admin: string): Promise<Applicant> {
  if (!hasSupabaseConfig()) {
    const fallback = APPLICANTS.find((applicant) => applicant.id === id);
    if (!fallback) throw new Error('Pelamar tidak ditemukan.');
    return { ...fallback, adminNotes: catatan_admin };
  }

  const { data, error } = await supabase
    .from('pelamar_magang')
    .update({ catatan_admin, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Gagal menyimpan catatan admin.');
  }

  return mapRowToApplicant(data as PelamarMagangRow);
}

export async function updateStatusPelamar(id: string, status: Status): Promise<Applicant> {
  if (!hasSupabaseConfig()) {
    const fallback = APPLICANTS.find((applicant) => applicant.id === id);
    if (!fallback) throw new Error('Pelamar tidak ditemukan.');
    return { ...fallback, status };
  }

  const { data, error } = await supabase
    .from('pelamar_magang')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Gagal menyimpan status pelamar.');
  }

  return mapRowToApplicant(data as PelamarMagangRow);
}

export async function updateTindakanAdmin(id: string, tindakan_admin: string): Promise<Applicant> {
  if (!hasSupabaseConfig()) {
    const fallback = APPLICANTS.find((applicant) => applicant.id === id);
    if (!fallback) throw new Error('Pelamar tidak ditemukan.');
    return { ...fallback, action: tindakan_admin };
  }

  const { data, error } = await supabase
    .from('pelamar_magang')
    .update({ tindakan_admin, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message || 'Gagal menyimpan tindakan admin.');
  }

  return mapRowToApplicant(data as PelamarMagangRow);
}

export async function getDocumentUrl(filePath: string | null | undefined): Promise<string | null> {
  if (!filePath) return null;

  if (!hasSupabaseConfig()) {
    return filePath;
  }

  const { data, error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .createSignedUrl(filePath, 60 * 60);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}

export async function sendEmailPelamar(id: string): Promise<{ success: boolean; message: string }> {
  if (!hasSupabaseConfig()) {
    throw new Error('Konfigurasi Supabase belum lengkap. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.');
  }

  const { data: pelamar, error: pelamarError } = await supabase
    .from('pelamar_magang')
    .select('*')
    .eq('id', id)
    .single();

  if (pelamarError || !pelamar) {
    throw new Error('Pelamar tidak ditemukan untuk dikirim email.');
  }

  const { error: invokeError } = await supabase.functions.invoke('send-magang-email', {
    body: { pelamar_id: id },
  });

  if (invokeError) {
    throw new Error(invokeError.message || 'Gagal mengirim email melalui Edge Function.');
  }

  return {
    success: true,
    message: 'Email berhasil diproses oleh edge function.',
  };
}
