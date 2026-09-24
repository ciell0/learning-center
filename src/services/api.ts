import { APPLICANTS, PROGRAMS } from '../app/components/data';
import { hasSupabaseConfig, supabase } from '../lib/supabase';

export type AdminStatus = 'waiting' | 'review' | 'accepted' | 'rejected' | 'terverifikasi';

export function getAuthToken(): string | null {
  return null;
}

export function setAuthSession() {
  return;
}

export function clearAuthSession() {
  return;
}

export function getSavedAdmin() {
  return null;
}

export const adminAuthApi = {
  async login(email: string, password: string) {
    if (!hasSupabaseConfig()) {
      throw new Error('Supabase belum dikonfigurasi. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message || 'Login gagal.');
    }

    return { user: data.user, token: data.session?.access_token ?? null };
  },
};

export const adminApplicationApi = {
  async getAll() {
    if (!hasSupabaseConfig()) {
      return { data: APPLICANTS };
    }

    const { data, error } = await supabase.from('pelamar_magang').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message || 'Gagal mengambil data pelamar.');
    return { data: data ?? [] };
  },
  async updateStatus(id: string, status: AdminStatus, admin_notes?: string) {
    if (!hasSupabaseConfig()) {
      return { data: { id, status, admin_notes } };
    }

    const { data, error } = await supabase
      .from('pelamar_magang')
      .update({ status, catatan_admin: admin_notes ?? null, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(error.message || 'Gagal mengubah status.');
    return { data };
  },
  async assignDivision(id: string, division: string) {
    if (!hasSupabaseConfig()) {
      return { data: { id, division } };
    }

    const { data, error } = await supabase
      .from('pelamar_magang')
      .update({ divisi: division, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();

    if (error) throw new Error(error.message || 'Gagal mengubah divisi.');
    return { data };
  },
};

export const adminMalabarApi = {
  async getAll() {
    if (!hasSupabaseConfig()) {
      return { data: PROGRAMS };
    }

    const { data, error } = await supabase.from('internship_programs').select('*');
    if (error) {
      return { data: PROGRAMS };
    }
    return { data: data ?? PROGRAMS };
  },
  async create(data: Record<string, unknown>) {
    if (!hasSupabaseConfig()) {
      return { data: { ...data, id: crypto.randomUUID() } };
    }

    const { data: row, error } = await supabase.from('internship_programs').insert(data).select('*').single();
    if (error) throw new Error(error.message || 'Gagal membuat program.');
    return { data: row };
  },
  async update(id: string, data: Record<string, unknown>) {
    if (!hasSupabaseConfig()) {
      return { data: { id, ...data } };
    }

    const { data: row, error } = await supabase.from('internship_programs').update(data).eq('id', id).select('*').single();
    if (error) throw new Error(error.message || 'Gagal memperbarui program.');
    return { data: row };
  },
  async remove(id: string) {
    if (!hasSupabaseConfig()) {
      return { data: { id } };
    }

    const { error } = await supabase.from('internship_programs').delete().eq('id', id);
    if (error) throw new Error(error.message || 'Gagal menghapus program.');
    return { data: { id } };
  },
};
