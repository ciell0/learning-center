import { Users, BookOpen, Briefcase, CheckCircle, Layers, UserCheck, Activity, Plus } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { MONTHLY_APPLICATIONS, STATUS_DISTRIBUTION, DIVISION_STATS, RECENT_ACTIVITIES, APPLICANTS, BOOKS, PROGRAMS, DIVISIONS } from "./data";

const STATS = [
  { label: 'Total Pengguna', value: '1,284', change: '+12%', icon: <Users size={20} />, color: '#003087', bg: '#e3f2fd' },
  { label: 'Total Buku', value: '4,832', change: '+8%', icon: <BookOpen size={20} />, color: '#1976d2', bg: '#dbeafe' },
  { label: 'Total Pelamar', value: '248', change: '+45%', icon: <Briefcase size={20} />, color: '#d4a017', bg: '#fef9e7' },
  { label: 'Program Aktif', value: '2', change: '0%', icon: <Activity size={20} />, color: '#7c3aed', bg: '#ede9fe' },
  { label: 'Divisi Aktif', value: '5', change: '+1', icon: <Layers size={20} />, color: '#0891b2', bg: '#e0f7fa' },
  { label: 'Pelamar Diterima', value: '84', change: '+23%', icon: <UserCheck size={20} />, color: '#10b981', bg: '#d1fae5' },
];

const ACTIVITY_ICONS: Record<string, React.ReactNode> = {
  user: <Users size={14} />,
  program: <Briefcase size={14} />,
  update: <CheckCircle size={14} />,
  book: <BookOpen size={14} />,
  check: <CheckCircle size={14} />,
};

const ACTIVITY_COLORS: Record<string, string> = {
  user: '#1976d2',
  program: '#d4a017',
  update: '#7c3aed',
  book: '#0891b2',
  check: '#10b981',
};

export function DashboardHome() {
  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full" style={{ background: '#d1fae5', color: '#065f46' }}>{s.change}</span>
            </div>
            <div>
              <div className="text-foreground font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Monthly applications */}
        <div className="glass-card rounded-xl p-5 xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-foreground font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Aplikasi Magang Bulanan</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Tahun 2024</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded" style={{ background: '#003087' }} />Pelamar</span>
              <span className="flex items-center gap-1.5"><span className="inline-block w-3 h-3 rounded" style={{ background: '#d4a017' }} />Diterima</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_APPLICATIONS}>
              <defs>
                <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#003087" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#003087" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4a017" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#d4a017" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="applications" name="Pelamar" stroke="#003087" strokeWidth={2} fill="url(#colorApp)" />
              <Area type="monotone" dataKey="accepted" name="Diterima" stroke="#d4a017" strokeWidth={2} fill="url(#colorAcc)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Status distribution */}
        <div className="glass-card rounded-xl p-5">
          <div className="mb-4">
            <h3 className="text-foreground font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Distribusi Status</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Seluruh pelamar aktif</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={STATUS_DISTRIBUTION} dataKey="value" cx="50%" cy="50%" outerRadius={70} innerRadius={40} paddingAngle={3}>
                {STATUS_DISTRIBUTION.map(entry => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {STATUS_DISTRIBUTION.map(s => (
              <div key={s.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                <span className="text-xs text-muted-foreground truncate">{s.name}</span>
                <span className="text-xs font-bold text-foreground ml-auto">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Division bar chart */}
        <div className="glass-card rounded-xl p-5 xl:col-span-2">
          <div className="mb-4">
            <h3 className="text-foreground font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Top Divisi Magang</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Berdasarkan jumlah pelamar</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={DIVISION_STATS} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
              <YAxis dataKey="division" type="category" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" name="Pelamar" radius={[0, 6, 6, 0]}>
                {DIVISION_STATS.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? '#003087' : i === 1 ? '#1565c0' : i === 2 ? '#d4a017' : '#42a5f5'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-foreground font-semibold" style={{ fontFamily: 'var(--font-display)' }}>Aktivitas Terbaru</h3>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITIES.map(act => (
              <div key={act.id} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${ACTIVITY_COLORS[act.icon]}20`, color: ACTIVITY_COLORS[act.icon] }}>
                  {ACTIVITY_ICONS[act.icon]}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-foreground leading-snug">{act.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Menunggu Verifikasi', value: APPLICANTS.filter(a => a.status === 'waiting').length, color: '#f59e0b' },
          { label: 'Sedang Direview', value: APPLICANTS.filter(a => a.status === 'review').length, color: '#3b82f6' },
          { label: 'Buku Dipinjam', value: BOOKS.filter(b => b.status === 'borrowed').length, color: '#7c3aed' },
          { label: 'Program Terbuka', value: PROGRAMS.filter(p => p.status === 'open').length, color: '#10b981' },
        ].map(item => (
          <div key={item.label} className="glass-card rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: item.color, fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
              {item.value}
            </div>
            <div className="text-sm text-muted-foreground leading-snug">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
