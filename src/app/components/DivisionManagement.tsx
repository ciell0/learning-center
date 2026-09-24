import { useState } from "react";
import { Plus, Edit2, Trash2, Users, CheckCircle, XCircle } from "lucide-react";
import { DIVISIONS, type Division } from "./data";

function DivisionForm({ division, onSave, onCancel }: { division?: Division; onSave: (d: Partial<Division>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: division?.name ?? '',
    description: division?.description ?? '',
    requirements: division?.requirements ?? '',
    quota: division?.quota ?? 3,
    active: division?.active ?? true,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="glass-card rounded-2xl w-full max-w-lg" style={{ background: 'var(--popover)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
          <h2 className="text-white font-bold" style={{ fontFamily: 'var(--font-display)' }}>{division ? 'Edit Divisi' : 'Tambah Divisi'}</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Nama Divisi</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Deskripsi</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none focus:border-primary resize-none" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Persyaratan</label>
            <textarea value={form.requirements} onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))} rows={2} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none focus:border-primary resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Kuota</label>
              <input type="number" value={form.quota} onChange={e => setForm(f => ({ ...f, quota: Number(e.target.value) }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Status</label>
              <select value={form.active ? 'active' : 'inactive'} onChange={e => setForm(f => ({ ...f, active: e.target.value === 'active' }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none focus:border-primary">
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground">Batal</button>
            <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
              {division ? 'Simpan' : 'Tambah Divisi'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function DivisionManagementPage() {
  const [divisions, setDivisions] = useState<Division[]>(DIVISIONS);
  const [showForm, setShowForm] = useState(false);
  const [editDiv, setEditDiv] = useState<Division | undefined>();

  function handleSave(data: Partial<Division>) {
    if (editDiv) {
      setDivisions(prev => prev.map(d => d.id === editDiv.id ? { ...d, ...data } : d));
    } else {
      setDivisions(prev => [...prev, { ...data, id: String(Date.now()), applicants: 0 } as Division]);
    }
    setShowForm(false); setEditDiv(undefined);
  }

  const COLORS = ['#003087', '#1565c0', '#d4a017', '#10b981', '#7c3aed', '#0891b2'];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Manajemen Divisi</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{divisions.filter(d => d.active).length} divisi aktif dari {divisions.length} total</p>
        </div>
        <button onClick={() => { setEditDiv(undefined); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
          <Plus size={15} /> Tambah Divisi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {divisions.map((div, i) => (
          <div key={div.id} className="glass-card rounded-xl p-5 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: COLORS[i % COLORS.length], fontFamily: 'var(--font-display)' }}>
                  {div.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-foreground font-semibold text-sm" style={{ fontFamily: 'var(--font-display)' }}>{div.name}</h3>
                  <span className={`text-xs ${div.active ? 'text-emerald-600' : 'text-red-500'}`}>
                    {div.active ? '● Aktif' : '● Nonaktif'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => { setEditDiv(div); setShowForm(true); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => setDivisions(prev => prev.filter(d => d.id !== div.id))} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{div.description}</p>

            <div className="p-3 rounded-xl text-xs" style={{ background: 'var(--muted)' }}>
              <div className="font-semibold text-foreground mb-1">Persyaratan:</div>
              <div className="text-muted-foreground">{div.requirements}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <Users size={13} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{div.applicants} Pelamar</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={13} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Kuota: {div.quota}</span>
              </div>
            </div>

            {/* Quota progress */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Terisi</span>
                <span className="font-medium text-foreground">{Math.min(div.applicants, div.quota)}/{div.quota}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                <div className="h-full rounded-full" style={{ width: `${Math.min((div.applicants / div.quota) * 100, 100)}%`, background: COLORS[i % COLORS.length] }} />
              </div>
            </div>

            <button
              onClick={() => setDivisions(prev => prev.map(d => d.id === div.id ? { ...d, active: !d.active } : d))}
              className="w-full py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: div.active ? '#fee2e2' : '#d1fae5',
                color: div.active ? '#991b1b' : '#065f46',
                border: `1px solid ${div.active ? '#fca5a5' : '#6ee7b7'}`
              }}
            >
              {div.active ? <><XCircle size={12} className="inline mr-1.5" />Nonaktifkan</> : <><CheckCircle size={12} className="inline mr-1.5" />Aktifkan</>}
            </button>
          </div>
        ))}
      </div>

      {(showForm || editDiv) && (
        <DivisionForm division={editDiv} onSave={handleSave} onCancel={() => { setShowForm(false); setEditDiv(undefined); }} />
      )}
    </div>
  );
}
