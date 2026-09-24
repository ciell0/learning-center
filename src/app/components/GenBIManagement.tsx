import { useState } from "react";
import { Eye, Save, Globe, Users, Star, CheckCircle } from "lucide-react";

export function GenBIManagementPage() {
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({
    about: `Generasi Baru Indonesia (GenBI) adalah komunitas penerima beasiswa Bank Indonesia yang terdiri dari mahasiswa berprestasi dari berbagai perguruan tinggi di Indonesia. GenBI berkomitmen untuk berkontribusi nyata bagi masyarakat dan mendukung program Bank Indonesia dalam meningkatkan literasi keuangan di Indonesia.

Di Malang, GenBI aktif berkolaborasi dengan Bank Indonesia Kantor Perwakilan Malang dalam berbagai program edukasi, sosial, dan pemberdayaan masyarakat.`,
    requirements: `• Mahasiswa aktif perguruan tinggi negeri atau swasta terakreditasi
• Indeks Prestasi Kumulatif (IPK) minimal 3.00
• Semester 2 hingga semester 7 (untuk program S1)
• Aktif berorganisasi dan memiliki jiwa kepemimpinan
• Belum pernah menerima beasiswa Bank Indonesia sebelumnya
• Berkomitmen mengikuti seluruh program dan kegiatan GenBI
• Tidak sedang menerima beasiswa lain yang bersumber dari APBN/APBD`,
    benefits: `• Beasiswa bulanan sebesar Rp 750.000 per bulan
• Akses jaringan alumni Bank Indonesia yang luas
• Pelatihan dan pengembangan kapasitas berkelanjutan
• Kesempatan magang di Bank Indonesia
• Sertifikat resmi dari Bank Indonesia
• Akses perpustakaan BI Corner
• Kegiatan sosial dan community service`,
    website: 'https://genbi.id',
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Manajemen GenBI</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Editor konten halaman GenBI</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setPreview(v => !v)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors">
            <Eye size={14} /> {preview ? 'Edit' : 'Preview'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
            <Save size={14} /> Simpan Perubahan
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${preview ? 'lg:grid-cols-2' : ''} gap-5`}>
        {/* Editor */}
        <div className="space-y-4">
          <div className="glass-card rounded-xl p-5">
            <label className="block text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>Tentang GenBI</label>
            <textarea
              value={form.about}
              onChange={e => setForm(f => ({ ...f, about: e.target.value }))}
              rows={8}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="glass-card rounded-xl p-5">
            <label className="block text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>Persyaratan</label>
            <textarea
              value={form.requirements}
              onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
              rows={9}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="glass-card rounded-xl p-5">
            <label className="block text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>Manfaat Beasiswa</label>
            <textarea
              value={form.benefits}
              onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))}
              rows={9}
              className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>

          <div className="glass-card rounded-xl p-5">
            <label className="block text-sm font-semibold text-foreground mb-3" style={{ fontFamily: 'var(--font-display)' }}>Link Website Resmi</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={form.website}
                onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        {preview && (
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-5" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
              <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(212,160,23,0.25)' }}>
                <Star size={24} style={{ color: '#d4a017' }} />
              </div>
              <h2 className="text-white font-bold text-xl mb-1" style={{ fontFamily: 'var(--font-display)' }}>Generasi Baru Indonesia</h2>
              <p style={{ color: '#90caf9', fontSize: '0.85rem' }}>GenBI · Bank Indonesia Malang</p>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <h3 className="text-foreground font-semibold text-sm mb-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                  <Users size={14} className="text-primary" /> Tentang GenBI
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">{form.about}</p>
              </div>

              <div>
                <h3 className="text-foreground font-semibold text-sm mb-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                  <CheckCircle size={14} className="text-primary" /> Persyaratan
                </h3>
                <div className="space-y-1">
                  {form.requirements.split('\n').filter(Boolean).map((req, i) => (
                    <div key={i} className="text-xs text-muted-foreground">{req}</div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-foreground font-semibold text-sm mb-2 flex items-center gap-2" style={{ fontFamily: 'var(--font-display)' }}>
                  <Star size={14} style={{ color: '#d4a017' }} /> Manfaat Beasiswa
                </h3>
                <div className="space-y-1">
                  {form.benefits.split('\n').filter(Boolean).map((b, i) => (
                    <div key={i} className="text-xs text-muted-foreground">{b}</div>
                  ))}
                </div>
              </div>

              <a href={form.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                <Globe size={12} /> {form.website}
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
