import { useState } from "react";
import { Plus, Search, Edit2, Trash2, BookOpen, Filter } from "lucide-react";
import { BOOKS, type Book } from "./data";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

type LibTab = 'physical' | 'digital' | 'authors' | 'genres' | 'publishers' | 'stats';

const GENRE_STATS = [
  { genre: 'Ekonomi', count: 42 }, { genre: 'Perbankan', count: 35 },
  { genre: 'Manajemen', count: 28 }, { genre: 'Keuangan', count: 22 },
  { genre: 'Statistik', count: 18 }, { genre: 'Kebijakan', count: 15 },
];

const AUTHORS = [
  { id: '1', name: 'Prof. Dr. Soedradjad Djiwandono', affiliation: 'Universitas Indonesia', books: 4 },
  { id: '2', name: 'Dr. Miranda Goeltom', affiliation: 'Bank Indonesia', books: 6 },
  { id: '3', name: 'Ir. Agus Prasetyo', affiliation: 'Universitas Brawijaya', books: 2 },
  { id: '4', name: 'Tim Peneliti BI', affiliation: 'Bank Indonesia', books: 12 },
];

const PUBLISHERS = [
  { id: '1', name: 'Bank Indonesia', city: 'Jakarta', books: 24 },
  { id: '2', name: 'Gramedia Pustaka', city: 'Jakarta', books: 18 },
  { id: '3', name: 'Erlangga', city: 'Jakarta', books: 15 },
  { id: '4', name: 'LP3ES', city: 'Jakarta', books: 8 },
  { id: '5', name: 'Kompas', city: 'Jakarta', books: 6 },
];

const GENRES = ['Ekonomi', 'Perbankan', 'Manajemen', 'Keuangan', 'Statistik', 'Kebijakan', 'Hukum', 'Teknologi'];

function BookForm({ book, onSave, onCancel }: { book?: Book; onSave: (b: Partial<Book>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: book?.title ?? '',
    author: book?.author ?? '',
    publisher: book?.publisher ?? '',
    genre: book?.genre ?? '',
    year: book?.year ?? 2024,
    isbn: book?.isbn ?? '',
    description: book?.description ?? '',
    status: book?.status ?? 'available' as Book['status'],
    type: book?.type ?? 'physical' as Book['type'],
    stock: book?.stock ?? 1,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="glass-card rounded-2xl w-full max-w-xl" style={{ background: 'var(--popover)' }}>
        <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
          <h2 className="text-white font-bold" style={{ fontFamily: 'var(--font-display)' }}>{book ? 'Edit Buku' : 'Tambah Buku'}</h2>
        </div>
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {[
            { label: 'Judul Buku', key: 'title', type: 'text' },
            { label: 'Pengarang', key: 'author', type: 'text' },
            { label: 'Penerbit', key: 'publisher', type: 'text' },
            { label: 'ISBN', key: 'isbn', type: 'text' },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-foreground mb-1.5">{f.label}</label>
              <input value={(form as any)[f.key]} onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none focus:border-primary" />
            </div>
          ))}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Genre</label>
              <select value={form.genre} onChange={e => setForm(f => ({ ...f, genre: e.target.value }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none">
                {GENRES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Tahun</label>
              <input type="number" value={form.year} onChange={e => setForm(f => ({ ...f, year: Number(e.target.value) }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Stok</label>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: Number(e.target.value) }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Jenis</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none">
                <option value="physical">Fisik</option>
                <option value="digital">Digital</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none">
                <option value="available">Tersedia</option>
                <option value="borrowed">Dipinjam</option>
                <option value="reserved">Dipesan</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">Deskripsi</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full px-3 py-2.5 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-border text-muted-foreground">Batal</button>
            <button onClick={() => onSave(form)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>Simpan</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const STATUS_MAP = { available: { label: 'Tersedia', cls: 'status-accepted' }, borrowed: { label: 'Dipinjam', cls: 'status-review' }, reserved: { label: 'Dipesan', cls: 'status-waiting' } };

function BooksTab({ books, onEdit, onDelete, onAdd }: { books: Book[]; onEdit: (b: Book) => void; onDelete: (id: string) => void; onAdd: () => void }) {
  const [search, setSearch] = useState('');
  const filtered = books.filter(b => !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-xl p-4 flex gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none focus:border-primary" placeholder="Cari judul atau pengarang..." />
        </div>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
          <Plus size={14} /> Tambah Buku
        </button>
      </div>
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                {['Judul', 'Pengarang', 'Penerbit', 'Genre', 'Tahun', 'ISBN', 'Stok', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr key={b.id} style={{ borderBottom: '1px solid var(--border)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,48,135,0.02)' }} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #003087, #1565c0)' }}>
                        <BookOpen size={14} className="text-white" />
                      </div>
                      <span className="text-sm font-medium text-foreground max-w-40 truncate">{b.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-32 truncate">{b.author}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{b.publisher}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-lg text-xs" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>{b.genre}</span></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>{b.year}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground" style={{ fontFamily: 'var(--font-mono)' }}>{b.isbn}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-foreground">{b.stock === 999 ? '∞' : b.stock}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_MAP[b.status].cls}`}>{STATUS_MAP[b.status].label}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => onEdit(b)} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"><Edit2 size={13} /></button>
                      <button onClick={() => onDelete(b.id)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={13} /></button>
                    </div>
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

function StatsTab() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Koleksi', value: '4,832', color: '#003087' },
          { label: 'Buku Fisik', value: '3,245', color: '#1565c0' },
          { label: 'Buku Digital', value: '1,587', color: '#d4a017' },
          { label: 'Dipinjam', value: '312', color: '#ef4444' },
        ].map(s => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <div className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: 'var(--font-display)' }}>{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="glass-card rounded-xl p-5">
        <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: 'var(--font-display)' }}>Koleksi per Genre</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={GENRE_STATS}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="genre" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'var(--popover)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="count" name="Judul" radius={[6, 6, 0, 0]}>
              {GENRE_STATS.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? '#003087' : '#d4a017'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function LibraryManagementPage({ tab }: { tab: string }) {
  const [books, setBooks] = useState<Book[]>(BOOKS);
  const [showForm, setShowForm] = useState(false);
  const [editBook, setEditBook] = useState<Book | undefined>();

  const physicalBooks = books.filter(b => b.type === 'physical');
  const digitalBooks = books.filter(b => b.type === 'digital');

  function handleSave(data: Partial<Book>) {
    if (editBook) {
      setBooks(prev => prev.map(b => b.id === editBook.id ? { ...b, ...data } : b));
    } else {
      setBooks(prev => [...prev, { ...data, id: String(Date.now()) } as Book]);
    }
    setShowForm(false); setEditBook(undefined);
  }

  const tabLabels: Record<string, string> = {
    'lib-physical': 'Buku Fisik',
    'lib-digital': 'Buku Digital',
    'lib-authors': 'Pengarang',
    'lib-genres': 'Genre',
    'lib-publishers': 'Penerbit',
    'lib-stats': 'Statistik Perpustakaan',
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-foreground font-bold" style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Manajemen Perpustakaan</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{tabLabels[tab] || 'Perpustakaan'}</p>
      </div>

      {(tab === 'lib-physical' || tab === 'lib-digital') && (
        <BooksTab
          books={tab === 'lib-physical' ? physicalBooks : digitalBooks}
          onEdit={b => { setEditBook(b); setShowForm(true); }}
          onDelete={id => setBooks(prev => prev.filter(b => b.id !== id))}
          onAdd={() => { setEditBook(undefined); setShowForm(true); }}
        />
      )}

      {tab === 'lib-authors' && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                  {['Nama Pengarang', 'Afiliasi', 'Jumlah Buku', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AUTHORS.map((a, i) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{a.name}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{a.affiliation}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>{a.books} buku</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"><Edit2 size={13} /></button>
                        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'lib-genres' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {GENRES.map((g, i) => (
            <div key={g} className="glass-card rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{g}</span>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"><Edit2 size={13} /></button>
                <button className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'lib-publishers' && (
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--muted)', borderBottom: '1px solid var(--border)' }}>
                  {['Nama Penerbit', 'Kota', 'Jumlah Buku', 'Aksi'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PUBLISHERS.map((p, i) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--border)' }} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{p.name}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{p.city}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>{p.books} buku</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-secondary transition-colors"><Edit2 size={13} /></button>
                        <button className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'lib-stats' && <StatsTab />}

      {showForm && (
        <BookForm book={editBook} onSave={handleSave} onCancel={() => { setShowForm(false); setEditBook(undefined); }} />
      )}
    </div>
  );
}
