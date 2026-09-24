import { useState } from "react";
import { Search, Eye, UserX, UserCheck, RefreshCw } from "lucide-react";
import { USERS, type User } from "./data";

const ROLE_LABELS = { admin: 'Admin', staff: 'Staf', user: 'Pengguna' };
const ROLE_COLORS = { admin: { bg: '#ede9fe', color: '#5b21b6' }, staff: { bg: '#dbeafe', color: '#1e40af' }, user: { bg: 'var(--muted)', color: 'var(--muted-foreground)' } };

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>(USERS);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  function toggleStatus(id: string) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Manajemen Pengguna</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{users.filter(u => u.status === 'active').length} pengguna aktif</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary" placeholder="Cari nama atau email..." />
        </div>
        <select className="px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none">
          <option>Semua Role</option>
          <option>Admin</option>
          <option>Staf</option>
          <option>Pengguna</option>
        </select>
        <select className="px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none">
          <option>Semua Status</option>
          <option>Aktif</option>
          <option>Ditangguhkan</option>
        </select>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                {['Pengguna', 'Email', 'Role', 'Tgl Bergabung', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const roleStyle = ROLE_COLORS[u.role];
                return (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,48,135,0.02)' }} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: u.role === 'admin' ? 'linear-gradient(135deg, #5b21b6, #7c3aed)' : u.role === 'staff' ? 'linear-gradient(135deg, #003087, #1565c0)' : 'linear-gradient(135deg, #6b7280, #9ca3af)' }}>
                          {u.name.charAt(0)}
                        </div>
                        <span className="text-sm font-medium text-foreground">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: roleStyle.bg, color: roleStyle.color }}>{ROLE_LABELS[u.role]}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>
                      {new Date(u.registrationDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.status === 'active' ? 'status-accepted' : 'status-rejected'}`}>
                        {u.status === 'active' ? 'Aktif' : 'Ditangguhkan'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors" title="Lihat Profil">
                          <Eye size={13} />
                        </button>
                        <button onClick={() => toggleStatus(u.id)} className="p-1.5 rounded-lg transition-colors" title={u.status === 'active' ? 'Tangguhkan' : 'Aktifkan'} style={{ color: u.status === 'active' ? '#ef4444' : '#10b981' }}>
                          {u.status === 'active' ? <UserX size={13} /> : <UserCheck size={13} />}
                        </button>
                        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-500 hover:bg-amber-50 transition-colors" title="Reset Password">
                          <RefreshCw size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
