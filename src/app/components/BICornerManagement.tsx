import { useState } from "react";
import { Plus, Trash2, Save, Upload, Image } from "lucide-react";

const FACILITIES_INIT = [
  { id: '1', name: 'Ruang Baca Utama', description: 'Ruang baca luas dengan koleksi buku ekonomi dan keuangan terlengkap. Dilengkapi meja belajar individual dan area diskusi kelompok.', images: ['https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=250&fit=crop'] },
  { id: '2', name: 'Pojok Digital', description: 'Area akses internet gratis dengan komputer dan akses ke e-library Bank Indonesia. Tersedia 10 unit komputer dan zona laptop.', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop'] },
  { id: '3', name: 'Ruang Diskusi', description: 'Ruang pertemuan kapasitas 20 orang untuk diskusi kelompok, seminar mini, dan kegiatan komunitas.', images: ['https://images.unsplash.com/photo-1564069114553-7215e1ff1890?w=400&h=250&fit=crop'] },
];

export function BICornerManagementPage() {
  const [facilities, setFacilities] = useState(FACILITIES_INIT);
  const [editId, setEditId] = useState<string | null>(null);

  function handleEdit(id: string, field: string, value: string) {
    setFacilities(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
  }

  function addFacility() {
    setFacilities(prev => [...prev, { id: String(Date.now()), name: 'Fasilitas Baru', description: '', images: [] }]);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Manajemen BI Corner</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Kelola fasilitas dan galeri BI Corner</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={addFacility} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-border text-foreground hover:bg-muted transition-colors">
            <Plus size={14} /> Tambah Fasilitas
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
            <Save size={14} /> Simpan Semua
          </button>
        </div>
      </div>

      <div className="space-y-5">
        {facilities.map((facility, fi) => (
          <div key={facility.id} className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Nama Fasilitas</label>
                <input
                  value={facility.name}
                  onChange={e => handleEdit(facility.id, 'name', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-border bg-input-background text-foreground text-sm font-semibold focus:outline-none focus:border-primary"
                  style={{ fontFamily: 'var(--font-display)' }}
                />
              </div>
              <button
                onClick={() => setFacilities(prev => prev.filter(f => f.id !== facility.id))}
                className="p-2 rounded-lg text-destructive hover:bg-destructive/10 transition-colors mt-5"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Deskripsi</label>
              <textarea
                value={facility.description}
                onChange={e => handleEdit(facility.id, 'description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                <Image size={13} /> Galeri Foto
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {facility.images.map((img, i) => (
                  <div key={i} className="relative aspect-video rounded-xl overflow-hidden group">
                    <img src={img} alt={`${facility.name} ${i + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleEdit(facility.id, 'images', JSON.stringify(facility.images.filter((_, idx) => idx !== i)))}
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(239,68,68,0.9)', color: 'white' }}
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
                <button
                  className="aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <Upload size={18} />
                  <span className="text-xs">Upload Foto</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
