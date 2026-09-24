import { useEffect, useState } from "react";
import { Search, Filter, X, Download, Eye, Mail, Check, AlertCircle, Clock, FileText, User, Briefcase, Save } from "lucide-react";
import {
  getPelamar,
  getPelamarById,
  updateCatatanPelamar,
  updateStatusPelamar,
  updateTindakanAdmin,
  getDocumentUrl,
  sendEmailPelamar,
} from "../../services/internshipApplicants";
import { type Applicant, type Status } from "./data";

const STATUS_LABELS: Record<Status, string> = {
  waiting: 'Menunggu',
  review: 'On Review',
  accepted: 'Diterima',
  rejected: 'Ditolak',
  terverifikasi: 'Terverifikasi',
};

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold status-${status}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

function ApplicantModal({
  applicant,
  onClose,
  onStatusChange,
  onSaveNotes,
  onOpenDocument,
  onSendEmail,
}: {
  applicant: Applicant;
  onClose: () => void;
  onStatusChange: (id: string, status: Status, notes: string) => Promise<void>;
  onSaveNotes: (id: string, notes: string) => Promise<void>;
  onOpenDocument: (doc: { name: string; type: string; path?: string; url?: string }) => Promise<void>;
  onSendEmail: (id: string) => Promise<void>;
}) {
  const [notes, setNotes] = useState(applicant.adminNotes || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    setNotes(applicant.adminNotes || '');
  }, [applicant.adminNotes]);

  const timelineSteps = [
    { label: 'Terdaftar', index: 0 },
    { label: 'On Review', index: 1 },
    { label: 'Diterima / Ditolak / Terverifikasi', index: 2 },
  ];

  const currentIdx = applicant.status === 'waiting' ? 0 : applicant.status === 'review' ? 1 : 2;

  const handleSave = async () => {
    setSavingNotes(true);
    try {
      await onSaveNotes(applicant.id, notes);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleSend = async () => {
    setSendingEmail(true);
    try {
      await onSendEmail(applicant.id);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="glass-card rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" style={{ background: 'var(--popover)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ background: 'rgba(212,160,23,0.3)', fontFamily: 'var(--font-display)' }}>
              {applicant.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-white font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{applicant.name}</h2>
              <p className="text-xs" style={{ color: '#90caf9' }}>{applicant.nim} · {applicant.university}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={applicant.status} />
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors" aria-label="Tutup detail pelamar">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-border">
            <div className="p-6 space-y-6">
              <section>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                  <User size={15} className="text-primary" /> Informasi Pribadi
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Nama Lengkap', value: applicant.name },
                    { label: 'NIM', value: applicant.nim },
                    { label: 'Universitas', value: applicant.university },
                    { label: 'Fakultas', value: applicant.faculty },
                    { label: 'Jurusan', value: applicant.major },
                    { label: 'Semester', value: `Semester ${applicant.semester}` },
                    { label: 'No. Telepon', value: applicant.phone },
                    { label: 'Email', value: applicant.email || '-' },
                  ].map(f => (
                    <div key={f.label} className={f.label === 'Nama Lengkap' || f.label === 'Universitas' || f.label === 'Email' ? 'col-span-2' : ''}>
                      <div className="text-xs text-muted-foreground mb-0.5">{f.label}</div>
                      <div className="text-sm text-foreground font-medium">{f.value}</div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                  <Briefcase size={15} className="text-primary" /> Informasi Magang
                </h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Jenis Program', value: applicant.program },
                    { label: 'Divisi', value: applicant.division },
                    { label: 'Periode Magang', value: applicant.period },
                    { label: 'No. Surat Rekomendasi', value: applicant.recommendationLetterNo },
                    { label: 'Tanggal Daftar', value: new Date(applicant.registrationDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) },
                    { label: 'Status', value: STATUS_LABELS[applicant.status] },
                  ].map(f => (
                    <div key={f.label} className="flex items-start justify-between gap-2">
                      <span className="text-xs text-muted-foreground flex-shrink-0">{f.label}</span>
                      <span className="text-xs text-foreground font-medium text-right">{f.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                  <Clock size={15} className="text-primary" /> Timeline Status
                </h3>
                <div className="flex items-center gap-2">
                  {timelineSteps.map((item, i) => {
                    const isActive = i <= currentIdx;
                    const isFinal = i === 2;
                    const finalColor = applicant.status === 'accepted' || applicant.status === 'terverifikasi' ? '#10b981' : applicant.status === 'rejected' ? '#ef4444' : '#003087';

                    return (
                      <div key={item.label} className="flex items-center gap-2 flex-1">
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{
                            background: isActive ? (isFinal ? finalColor : '#003087') : 'var(--muted)',
                            color: isActive ? 'white' : 'var(--muted-foreground)',
                          }}>
                            {i + 1}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1 text-center" style={{ fontSize: '10px' }}>{item.label}</div>
                        </div>
                        {i < timelineSteps.length - 1 && <div className="flex-1 h-0.5 mb-4" style={{ background: i < currentIdx ? '#003087' : 'var(--muted)' }} />}
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="p-6 space-y-6">
              <section>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                  <FileText size={15} className="text-primary" /> Dokumen Diunggah
                </h3>
                <div className="space-y-2">
                  {applicant.documents.length === 0 && (
                    <p className="text-sm text-muted-foreground">Belum ada dokumen yang diunggah.</p>
                  )}
                  {applicant.documents.map(doc => (
                    <div key={`${doc.name}-${doc.path || doc.url || 'doc'}`} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white uppercase" style={{ background: doc.type === 'pdf' ? '#ef4444' : '#1976d2' }}>
                          {doc.type}
                        </div>
                        <span className="text-sm text-foreground">{doc.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => onOpenDocument(doc)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-primary" aria-label={`Lihat ${doc.name}`}>
                          <Eye size={14} />
                        </button>
                        <button onClick={() => onOpenDocument(doc)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-primary" aria-label={`Unduh ${doc.name}`}>
                          <Download size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>Catatan Admin</h3>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-sm resize-none focus:outline-none focus:border-primary"
                  placeholder="Tambahkan catatan untuk pelamar ini..."
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={savingNotes}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}
                  >
                    <Save size={13} /> {savingNotes ? 'Menyimpan...' : 'Simpan Catatan'}
                  </button>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>Tindakan Admin</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onStatusChange(applicant.id, 'review', notes)}
                    disabled={applicant.status === 'review'}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                    style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd' }}
                  >
                    <AlertCircle size={13} /> Pindah ke On Review
                  </button>
                  <button
                    onClick={() => onStatusChange(applicant.id, 'accepted', notes)}
                    disabled={applicant.status === 'accepted'}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                    style={{ background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7' }}
                  >
                    <Check size={13} /> Terima Pelamar
                  </button>
                  <button
                    onClick={() => onStatusChange(applicant.id, 'rejected', notes)}
                    disabled={applicant.status === 'rejected'}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                    style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' }}
                  >
                    <X size={13} /> Tolak Pelamar
                  </button>
                  <button
                    onClick={() => onStatusChange(applicant.id, 'terverifikasi', notes)}
                    disabled={applicant.status === 'terverifikasi'}
                    className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
                    style={{ background: '#dbeafe', color: '#0f172a', border: '1px solid #cbd5e1' }}
                  >
                    <Check size={13} /> Verifikasi
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={sendingEmail}
                    className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-60"
                    style={{ background: 'var(--muted)', color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
                  >
                    <Mail size={13} /> {sendingEmail ? 'Mengirim...' : 'Kirim Email'}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ApplicantDataPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | ''>('');
  const [filterDivision, setFilterDivision] = useState('');
  const [filterProgram, setFilterProgram] = useState('');
  const [selected, setSelected] = useState<Applicant | null>(null);

  useEffect(() => {
    let mounted = true;

    getPelamar()
      .then((items) => {
        if (mounted) setApplicants(items);
      })
      .catch((reason) => {
        if (mounted) setError(reason instanceof Error ? reason.message : 'Gagal memuat data pelamar.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filtered = applicants.filter(a => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.nim.toLowerCase().includes(search.toLowerCase()) || (a.university || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || a.status === filterStatus;
    const matchDiv = !filterDivision || a.division === filterDivision;
    const matchProg = !filterProgram || a.program === filterProgram;
    return matchSearch && matchStatus && matchDiv && matchProg;
  });

  async function handleStatusChange(id: string, status: Status, notes: string) {
    try {
      const stored = await updateStatusPelamar(id, status);
      if (notes !== (selected?.adminNotes ?? '') && notes.trim() !== '') {
        const withNotes = await updateCatatanPelamar(id, notes);
        Object.assign(stored, withNotes);
      }
      await updateTindakanAdmin(id, `Mengubah status menjadi ${STATUS_LABELS[status]}`);

      setApplicants(prev => prev.map(a => a.id === id ? { ...a, ...stored, status, adminNotes: notes, action: `Mengubah status menjadi ${STATUS_LABELS[status]}` } : a));
      setSelected(prev => prev && prev.id === id ? { ...prev, ...stored, status, adminNotes: notes, action: `Mengubah status menjadi ${STATUS_LABELS[status]}` } : prev);
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Gagal memperbarui status.');
    }
  }

  async function handleSaveNotes(id: string, notes: string) {
    try {
      const updated = await updateCatatanPelamar(id, notes);
      await updateTindakanAdmin(id, 'Menyimpan catatan admin');
      setApplicants(prev => prev.map(a => a.id === id ? { ...a, ...updated, adminNotes: notes, action: 'Menyimpan catatan admin' } : a));
      setSelected(prev => prev && prev.id === id ? { ...prev, ...updated, adminNotes: notes, action: 'Menyimpan catatan admin' } : prev);
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Gagal menyimpan catatan admin.');
    }
  }

  async function handleOpenDocument(doc: { name: string; type: string; path?: string; url?: string }) {
    try {
      const signedUrl = doc.url || (doc.path ? await getDocumentUrl(doc.path) : null);

      if (!signedUrl) {
        throw new Error('Dokumen tidak tersedia atau tidak dapat dibuka.');
      }

      window.open(signedUrl, '_blank', 'noopener,noreferrer');
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Gagal membuka dokumen.');
    }
  }

  async function handleSendEmail(id: string) {
    try {
      const applicant = applicants.find(item => item.id === id) || selected;
      if (!applicant || !applicant.email || applicant.email === '-') {
        throw new Error('Email pelamar tidak tersedia.');
      }

      const result = await sendEmailPelamar(id);
      await updateTindakanAdmin(id, `Mengirim email status ${STATUS_LABELS[applicant.status]}`);
      setError(result.success ? '' : result.message);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Gagal mengirim email.');
    }
  }

  const divisions = [...new Set(applicants.map(a => a.division))];
  const programs = [...new Set(applicants.map(a => a.program))];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Data Pelamar</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{filtered.length} pelamar ditemukan</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
          <Filter size={14} /> Ekspor Data
        </button>
      </div>
      {loading && <p className="text-sm text-muted-foreground">Memuat data pelamar...</p>}
      {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      <div className="glass-card rounded-xl p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary"
            placeholder="Cari nama, NIM, atau universitas..."
          />
        </div>
        {[
          { value: filterProgram, onChange: (v: string) => setFilterProgram(v), options: programs, placeholder: 'Semua Program' },
          { value: filterDivision, onChange: (v: string) => setFilterDivision(v), options: divisions, placeholder: 'Semua Divisi' },
        ].map((sel, i) => (
          <select
            key={i}
            value={sel.value}
            onChange={e => sel.onChange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary"
          >
            <option value="">{sel.placeholder}</option>
            {sel.options.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ))}
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as Status | '')}
          className="px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary"
        >
          <option value="">Semua Status</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        {(search || filterStatus || filterDivision || filterProgram) && (
          <button onClick={() => { setSearch(''); setFilterStatus(''); setFilterDivision(''); setFilterProgram(''); }} className="px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <X size={13} /> Reset
          </button>
        )}
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                {['Nama Pelamar', 'NIM', 'Universitas', 'Divisi', 'Program', 'Tgl Daftar', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,48,135,0.02)' }} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
                        {a.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-foreground">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>{a.nim}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{a.university}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-lg text-xs font-medium" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>{a.division}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{a.program.replace('Internship', '').trim()}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                    {new Date(a.registrationDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(a)} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
                      Detail & Aksi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Search size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Tidak ada pelamar yang ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {selected && (
        <ApplicantModal
          applicant={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
          onSaveNotes={handleSaveNotes}
          onOpenDocument={handleOpenDocument}
          onSendEmail={handleSendEmail}
        />
      )}
    </div>
  );
}
