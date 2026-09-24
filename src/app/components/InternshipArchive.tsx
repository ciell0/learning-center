import { useState } from "react";
import { Search, Download, Filter } from "lucide-react";
import { ARCHIVE_DATA } from "./data";

export function InternshipArchivePage() {
  const [search, setSearch] = useState('');
  const data = ARCHIVE_DATA.filter(d =>
    !search || d.applicant.toLowerCase().includes(search.toLowerCase()) || d.program.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Arsip Magang</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Data historis program magang yang telah selesai</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
          <Download size={14} /> Ekspor Excel
        </button>
      </div>

      <div className="glass-card rounded-xl p-4 flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary" placeholder="Cari peserta atau program..." />
        </div>
        <select className="px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none">
          <option>Semua Tahun</option>
          <option>2024</option>
          <option>2023</option>
        </select>
        <select className="px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none">
          <option>Semua Status</option>
          <option>Lulus</option>
          <option>Tidak Lulus</option>
        </select>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                {['No.', 'Peserta Magang', 'Program', 'Divisi', 'Periode Magang', 'Status Akhir', 'Keterangan'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,48,135,0.02)' }} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
                        {row.applicant.charAt(0)}
                      </div>
                      <span className="text-sm font-medium text-foreground">{row.applicant}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{row.program}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-lg text-xs font-medium" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>{row.division}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{row.period}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${row.finalStatus === 'Lulus' ? 'status-accepted' : 'status-rejected'}`}>
                      {row.finalStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs ${row.completion === 'Selesai' ? 'text-emerald-600' : 'text-red-500'}`}>{row.completion}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
