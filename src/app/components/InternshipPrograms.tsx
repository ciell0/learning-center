import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Calendar, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import { adminMalabarApi } from "../../services/api";
import { type Program } from "./data";

function ProgramCard({ program, onEdit, onDelete, onToggle }: {
  program: Program;
  onEdit: (p: Program) => void;
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const statusConfig = {
    open: { label: 'Terbuka', color: '#10b981', bg: '#d1fae5' },
    closed: { label: 'Ditutup', color: '#ef4444', bg: '#fee2e2' },
    draft: { label: 'Draft', color: '#f59e0b', bg: '#fef3c7' },
  }[program.status];

  const acceptRate = program.applicants > 0 ? Math.round((program.accepted / program.applicants) * 100) : 0;

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-white font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{program.name}</h3>
            <span className="mt-1 inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: statusConfig.bg, color: statusConfig.color }}>
              {statusConfig.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onEdit(program)} className="p-2 rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
              <Edit2 size={14} />
            </button>
            <button onClick={() => onDelete(program.id)} className="p-2 rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: '#90caf9' }}>{program.description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-border p-4">
        {[
          { label: 'Pelamar', value: program.applicants, icon: <Users size={14} /> },
          { label: 'Diterima', value: program.accepted, icon: <CheckCircle size={14} /> },
          { label: 'Kuota', value: program.quota, icon: <Clock size={14} /> },
        ].map(s => (
          <div key={s.label} className="flex flex-col items-center gap-1 px-3">
            <span className="text-muted-foreground">{s.icon}</span>
            <span className="font-bold text-foreground" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>{s.value}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="px-5 pb-4 space-y-2.5">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={13} />
            <span className="text-xs">Pendaftaran</span>
          </div>
          <span className="text-xs font-medium text-foreground">
            {new Date(program.registrationStart).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} –{' '}
            {new Date(program.registrationEnd).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={13} />
            <span className="text-xs">Magang</span>
          </div>
          <span className="text-xs font-medium text-foreground">
            {new Date(program.internshipStart).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} –{' '}
            {new Date(program.internshipEnd).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-muted-foreground">Tingkat penerimaan</span>
            <span className="text-xs font-semibold" style={{ color: '#10b981' }}>{acceptRate}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${acceptRate}%`, background: 'linear-gradient(90deg, #10b981, #059669)' }} />
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => onToggle(program.id)}
          className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: program.status === 'open' ? '#fee2e2' : '#d1fae5',
            color: program.status === 'open' ? '#991b1b' : '#065f46',
            border: `1px solid ${program.status === 'open' ? '#fca5a5' : '#6ee7b7'}`
          }}
        >
          {program.status === 'open' ? <><XCircle size={13} className="inline mr-1.5" />Tutup Pendaftaran</> : <><CheckCircle size={13} className="inline mr-1.5" />Buka Pendaftaran</>}
        </button>
      </div>
    </div>
  );
}

function ProgramForm({ program, onSave, onCancel }: {
  program?: Program;
  onSave: (p: Partial<Program>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: program?.name ?? '',
    description: program?.description ?? '',
    registrationStart: program?.registrationStart ?? '',
    registrationEnd: program?.registrationEnd ?? '',
    internshipStart: program?.internshipStart ?? '',
    internshipEnd: program?.internshipEnd ?? '',
    quota: program?.quota ?? 10,
    status: program?.status ?? 'draft' as 'draft' | 'open' | 'closed',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="glass-card rounded-2xl w-full max-w-xl" style={{ background: 'var(--popover)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
          <h2 className="text-white font-bold" style={{ fontFamily: 'var(--font-display)' }}>{program ? 'Edit Program' : 'Buat Program Baru'}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Nama Program</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Deskripsi</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none focus:border-primary resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Mulai Pendaftaran', key: 'registrationStart' },
              { label: 'Akhir Pendaftaran', key: 'registrationEnd' },
              { label: 'Mulai Magang', key: 'internshipStart' },
              { label: 'Akhir Magang', key: 'internshipEnd' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-foreground mb-1.5">{f.label}</label>
                <input type="date" value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none focus:border-primary" />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Kuota</label>
              <input type="number" value={form.quota} onChange={e => setForm(f => ({ ...f, quota: Number(e.target.value) }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none focus:border-primary">
                <option value="draft">Draft</option>
                <option value="open">Terbuka</option>
                <option value="closed">Ditutup</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground hover:text-foreground transition-colors">Batal</button>
            <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
              {program ? 'Simpan Perubahan' : 'Buat Program'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function InternshipProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editProgram, setEditProgram] = useState<Program | undefined>();

  useEffect(() => {
    adminMalabarApi.getAll()
      .then((response) => setPrograms((response.data || []).map((program: any): Program => ({
        id: String(program.id), name: program.name, description: program.description || '',
        registrationStart: program.registration_start || '', registrationEnd: program.registration_end || '',
        internshipStart: program.internship_start || '', internshipEnd: program.internship_end || '', quota: Number(program.quota || 0),
        status: program.status === 'active' ? 'open' : program.status === 'inactive' ? 'closed' : 'draft', applicants: 0, accepted: 0,
      }))))
      .catch((reason) => setError(reason instanceof Error ? reason.message : 'Gagal memuat program.'))
      .finally(() => setLoading(false));
  }, []);

  const toApiPayload = (data: Partial<Program>) => ({
    name: data.name, description: data.description, registration_start: data.registrationStart || null,
    registration_end: data.registrationEnd || null, internship_start: data.internshipStart || null,
    internship_end: data.internshipEnd || null, quota: data.quota, status: data.status === 'open' ? 'active' : data.status === 'closed' ? 'inactive' : 'draft',
  });

  async function handleSave(data: Partial<Program>) {
    try {
      const response = editProgram
        ? await adminMalabarApi.update(editProgram.id, toApiPayload(data))
        : await adminMalabarApi.create(toApiPayload(data));
      const program = response.data;
      const mapped: Program = {
        id: String(program.id), name: program.name, description: program.description || '', registrationStart: program.registration_start || '',
        registrationEnd: program.registration_end || '', internshipStart: program.internship_start || '', internshipEnd: program.internship_end || '',
        quota: Number(program.quota || 0), status: program.status === 'active' ? 'open' : program.status === 'inactive' ? 'closed' : 'draft', applicants: 0, accepted: 0,
      };
      setPrograms(prev => editProgram ? prev.map(p => p.id === mapped.id ? mapped : p) : [mapped, ...prev]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Gagal menyimpan program.');
    }
    setShowForm(false);
    setEditProgram(undefined);
  }

  async function handleDelete(id: string) {
    try {
      await adminMalabarApi.remove(id);
      setPrograms(prev => prev.filter(p => p.id !== id));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Gagal menghapus program.');
    }
  }

  async function handleToggle(id: string) {
    const program = programs.find((item) => item.id === id);
    if (!program) return;
    await handleSave({ ...program, status: program.status === 'open' ? 'closed' : 'open' });
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Program Magang</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{programs.length} program terdaftar</p>
        </div>
        <button onClick={() => { setEditProgram(undefined); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
          <Plus size={15} /> Buat Program
        </button>
      </div>
      {loading && <p className="text-sm text-muted-foreground">Memuat program...</p>}
      {error && <p className="rounded-xl bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {programs.map(p => (
          <ProgramCard key={p.id} program={p} onEdit={prog => { setEditProgram(prog); setShowForm(true); }} onDelete={handleDelete} onToggle={handleToggle} />
        ))}
      </div>

      {(showForm || editProgram) && (
        <ProgramForm
          program={editProgram}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditProgram(undefined); }}
        />
      )}
    </div>
  );
}
