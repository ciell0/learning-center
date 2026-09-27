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

const EMAIL_TEMPLATES: Record<Status, { subject: string; text: string }> = {
  terverifikasi: {
    subject: '[BI Malang] Status Magang Anda: Terverifikasi',
    text: 'Yth. {{nama_lengkap}},\n\nSelamat! Anda telah terverifikasi untuk program magang {{jenis_program}} di divisi {{divisi}} untuk periode {{periode_magang}}.\n\nTim kami akan menghubungi Anda lebih lanjut melalui email ini.\n\nHormat kami,\nTim Rekrutmen BI Malang',
  },
  accepted: {
    subject: '[BI Malang] Selamat! Anda Diterima',
    text: 'Yth. {{nama_lengkap}},\n\nSelamat! Anda dinyatakan DITERIMA sebagai peserta magang di divisi {{divisi}} pada program {{jenis_program}} periode {{periode_magang}}.\n\nKami menantikan kehadiran Anda.\n\nHormat kami,\nTim Rekrutmen BI Malang',
  },
  rejected: {
    subject: '[BI Malang] Hasil Seleksi Magang',
    text: 'Yth. {{nama_lengkap}},\n\nTerima kasih atas minat dan waktu Anda mengikuti proses seleksi magang {{jenis_program}} di {{universitas}}.\n\nSetelah evaluasi, saat ini Anda belum lolos pada divisi {{divisi}}. Semoga kesempatan dapat terulang di kesempatan berikutnya.\n\nHormat kami,\nTim Rekrutmen BI Malang',
  },
  waiting: {
    subject: '[BI Malang] Status Pendaftaran Magang',
    text: 'Yth. {{nama_lengkap}},\n\nPendaftaran Anda untuk program magang {{jenis_program}} masih dalam tahap proses administrasi dan review. Kami akan menginformasikan status selanjutnya melalui email ini.\n\nHormat kami,\nTim Rekrutmen BI Malang',
  },
  review: {
    subject: '[BI Malang] Pendaftaran Magang Sedang Ditinjau',
    text: 'Yth. {{nama_lengkap}},\n\nPendaftaran Anda untuk program magang {{jenis_program}} sedang dalam tahap review oleh tim admin. Mohon menunggu informasi lebih lanjut.\n\nHormat kami,\nTim Rekrutmen BI Malang',
  },
};

function applyEmailTemplate(templateText: string, applicant: Applicant): string {
  const values: Record<string, string> = {
    nama_lengkap: applicant.name,
    universitas: applicant.university,
    divisi: applicant.division,
    periode_magang: applicant.period,
    status: applicant.status,
    jenis_program: applicant.program,
  };

  return templateText.replace(/{{\s*([a-zA-Z0-9_]+)\s*}}/g, (_, key: string) => values[key] || '');
}

export async function sendEmailPelamar(id: string): Promise<{ success: boolean; message: string }> {
  const applicant = await getPelamarById(id);
  const recipientEmail = applicant?.email?.trim();

  if (!applicant || !recipientEmail || recipientEmail === '-') {
    throw new Error('Email pelamar tidak tersedia.');
  }

  const template = EMAIL_TEMPLATES[applicant.status] || EMAIL_TEMPLATES.waiting;
  const subject = template.subject;
  const body = applyEmailTemplate(template.text, applicant);
  const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.location.href = mailtoUrl;

  return {
    success: true,
    message: 'Draft email dibuka di aplikasi email default.',
  };
}
