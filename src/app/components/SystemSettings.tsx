import { useState } from "react";
import { Save, Upload, Mail, Bell, Globe, Info, Building2 } from "lucide-react";

const SECTIONS = [
  { id: 'general', label: 'Umum', icon: <Globe size={15} /> },
  { id: 'library', label: 'Informasi Perpustakaan', icon: <Building2 size={15} /> },
  { id: 'email', label: 'Template Email', icon: <Mail size={15} /> },
  { id: 'notifications', label: 'Notifikasi', icon: <Bell size={15} /> },
];

export function SystemSettingsPage() {
  const [activeSection, setActiveSection] = useState('general');

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-foreground font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Pengaturan Sistem</h2>
        <p className="text-xs text-muted-foreground mt-0.5">Konfigurasi platform BI Malang Learning Center</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Section nav */}
        <div className="glass-card rounded-xl p-3 h-fit">
          {SECTIONS.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-sm transition-all mb-1"
              style={{
                background: activeSection === s.id ? 'var(--secondary)' : 'transparent',
                color: activeSection === s.id ? 'var(--primary)' : 'var(--muted-foreground)',
                fontWeight: activeSection === s.id ? 600 : 400,
              }}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-4">
          {activeSection === 'general' && (
            <div className="glass-card rounded-xl p-6 space-y-5">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Pengaturan Umum</h3>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">Nama Website</label>
                <input defaultValue="BI Malang Learning Center" className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">Tagline</label>
                <input defaultValue="Platform Terpadu Layanan Edukasi Bank Indonesia Malang" className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
                    <span className="text-white font-bold text-xs" style={{ fontFamily: 'var(--font-display)' }}>BI</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Upload size={14} /> Upload Logo
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">Email Kontak</label>
                  <input defaultValue="info@bi-malang.go.id" className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-2">No. Telepon</label>
                  <input defaultValue="(0341) 325-225" className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-2">Alamat</label>
                <textarea defaultValue="Jl. Merdeka Utara No.7, Malang, Jawa Timur 65119" rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary resize-none" />
              </div>

              <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
                <Save size={14} /> Simpan Pengaturan
              </button>
            </div>
          )}

          {activeSection === 'library' && (
            <div className="glass-card rounded-xl p-6 space-y-5">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Informasi Perpustakaan</h3>
              {[
                { label: 'Nama Perpustakaan', value: 'Perpustakaan BI Malang' },
                { label: 'Jam Operasional', value: 'Senin – Jumat, 08.00 – 16.00 WIB' },
                { label: 'Kapasitas Maksimal', value: '50 orang' },
                { label: 'Durasi Peminjaman Maksimal', value: '14 hari' },
                { label: 'Maksimal Buku Dipinjam', value: '3 buku per peminjam' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-foreground mb-2">{f.label}</label>
                  <input defaultValue={f.value} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary" />
                </div>
              ))}
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
                <Save size={14} /> Simpan
              </button>
            </div>
          )}

          {activeSection === 'email' && (
            <div className="space-y-4">
              {[
                { label: 'Email Pendaftaran Berhasil', subject: '[BI Malang] Pendaftaran Magang Diterima', body: 'Yth. {nama_pelamar},\n\nTerima kasih atas pendaftaran Anda untuk program magang Bank Indonesia Kantor Perwakilan Malang.\n\nPendaftaran Anda telah kami terima dan sedang dalam proses review. Kami akan menginformasikan perkembangan seleksi melalui email ini.\n\nHormat kami,\nTim Rekrutmen BI Malang' },
                { label: 'Email Konfirmasi Diterima', subject: '[BI Malang] Selamat! Anda Dinyatakan Diterima', body: 'Yth. {nama_pelamar},\n\nSelamat! Kami dengan bangga memberitahukan bahwa Anda telah DITERIMA sebagai peserta magang Bank Indonesia Kantor Perwakilan Malang periode {periode_magang}.\n\nMohon hadir pada hari pertama magang sesuai jadwal yang telah ditentukan.\n\nHormat kami,\nTim Rekrutmen BI Malang' },
              ].map(tmpl => (
                <div key={tmpl.label} className="glass-card rounded-xl p-5 space-y-3">
                  <h4 className="font-semibold text-foreground text-sm" style={{ fontFamily: 'var(--font-display)' }}>{tmpl.label}</h4>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Subject</label>
                    <input defaultValue={tmpl.subject} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Isi Email</label>
                    <textarea defaultValue={tmpl.body} rows={6} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary resize-none" />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <Info size={11} className="inline mr-1" />
                    Variabel: {'{nama_pelamar}'}, {'{periode_magang}'}, {'{divisi}'}, {'{program}'}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="glass-card rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>Pengaturan Notifikasi</h3>
              {[
                { label: 'Notifikasi pendaftaran pelamar baru', desc: 'Kirim email ke admin saat ada pelamar baru', defaultChecked: true },
                { label: 'Notifikasi perubahan status', desc: 'Beritahu pelamar saat status berubah', defaultChecked: true },
                { label: 'Laporan mingguan', desc: 'Ringkasan aktivitas platform setiap Senin', defaultChecked: false },
                { label: 'Notifikasi buku jatuh tempo', desc: 'Ingatkan peminjam 3 hari sebelum batas waktu', defaultChecked: true },
                { label: 'Notifikasi kuota hampir penuh', desc: 'Alert saat kuota divisi hampir terisi penuh', defaultChecked: true },
              ].map(n => (
                <div key={n.label} className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--muted)' }}>
                  <div>
                    <div className="text-sm font-medium text-foreground">{n.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{n.desc}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={n.defaultChecked} className="sr-only peer" />
                    <div className="w-10 h-5 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"
                      style={{ background: n.defaultChecked ? '#003087' : 'var(--muted-foreground)' }}
                    />
                  </label>
                </div>
              ))}
              <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white mt-2" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
                <Save size={14} /> Simpan Notifikasi
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
