import { useState } from "react";
import { APPLICANTS, type Applicant, type Status } from "./data";

const COLUMNS: { id: Status; label: string; color: string; bg: string }[] = [
  { id: 'waiting', label: 'Menunggu', color: '#92400e', bg: '#fef3c7' },
  { id: 'review', label: 'On Review', color: '#1e40af', bg: '#dbeafe' },
  { id: 'accepted', label: 'Diterima', color: '#065f46', bg: '#d1fae5' },
  { id: 'rejected', label: 'Ditolak', color: '#991b1b', bg: '#fee2e2' },
];

const COL_HEADER_COLORS = {
  waiting: { from: '#b45309', to: '#d97706' },
  review: { from: '#1e40af', to: '#2563eb' },
  accepted: { from: '#065f46', to: '#059669' },
  rejected: { from: '#991b1b', to: '#dc2626' },
};

function ApplicantCard({ applicant, onMove }: { applicant: Applicant; onMove: (id: string, status: Status) => void }) {
  const [dragging, setDragging] = useState(false);

  const nextStatuses = COLUMNS.filter(c => c.id !== applicant.status);

  return (
    <div
      draggable
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
      className="glass-card rounded-xl p-4 cursor-grab active:cursor-grabbing transition-all"
      style={{ opacity: dragging ? 0.5 : 1, border: '1px solid var(--border)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
            {applicant.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{applicant.name}</div>
            <div className="text-xs text-muted-foreground">{applicant.university}</div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Divisi</span>
          <span className="font-medium text-foreground px-2 py-0.5 rounded-lg" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>{applicant.division}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Tgl Daftar</span>
          <span className="text-foreground" style={{ fontFamily: 'var(--font-mono)', fontSize: '10px' }}>{new Date(applicant.registrationDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Program</span>
          <span className="text-foreground">{applicant.program.includes('Malabar') ? 'Malabar' : 'Regular'}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {nextStatuses.slice(0, 2).map(s => (
          <button
            key={s.id}
            onClick={() => onMove(applicant.id, s.id)}
            className="px-2 py-0.5 rounded-lg text-xs font-medium transition-all hover:opacity-80"
            style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}30` }}
          >
            → {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SelectionProcessPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(APPLICANTS);
  const [dragOver, setDragOver] = useState<Status | null>(null);

  function handleMove(id: string, status: Status) {
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-foreground font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Proses Seleksi</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Papan Kanban – seret kartu untuk memperbarui status</p>
      </div>

      {/* Column summary */}
      <div className="grid grid-cols-4 gap-3">
        {COLUMNS.map(col => {
          const count = applicants.filter(a => a.status === col.id).length;
          return (
            <div key={col.id} className="glass-card rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-foreground" style={{ fontFamily: 'var(--font-display)', color: `${col.color}` }}>{count}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{col.label}</div>
            </div>
          );
        })}
      </div>

      {/* Kanban board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {COLUMNS.map(col => {
          const colApplicants = applicants.filter(a => a.status === col.id);
          const colors = COL_HEADER_COLORS[col.id];

          return (
            <div
              key={col.id}
              className="rounded-xl overflow-hidden"
              onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => { e.preventDefault(); setDragOver(null); }}
              style={{ border: dragOver === col.id ? `2px solid ${col.color}` : '2px solid transparent', background: 'var(--muted)', transition: 'border-color 0.2s' }}
            >
              {/* Column header */}
              <div className="px-4 py-3 flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}>
                <span className="text-white text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{col.label}</span>
                <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">{colApplicants.length}</span>
              </div>

              {/* Cards */}
              <div className="p-3 space-y-3 min-h-64">
                {colApplicants.map(a => (
                  <ApplicantCard key={a.id} applicant={a} onMove={handleMove} />
                ))}
                {colApplicants.length === 0 && (
                  <div className="flex items-center justify-center h-32 border-2 border-dashed rounded-xl text-muted-foreground text-xs" style={{ borderColor: 'var(--border)' }}>
                    Tidak ada pelamar
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
