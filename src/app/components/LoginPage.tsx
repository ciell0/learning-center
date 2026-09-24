import { useState } from "react";
import { Eye, EyeOff, Shield, Lock, Mail } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("admin@bi-malang.go.id");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw new Error(signInError.message || "Login gagal.");
      }

      if (!data.session) {
        throw new Error("Sesi login tidak berhasil dibuat.");
      }

      onLogin(data.user);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Gagal terhubung ke Supabase.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[55%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #001a4d 0%, #002766 40%, #003087 70%, #1565c0 100%)' }}
      >
        {/* decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #d4a017, transparent)' }} />
        <div className="absolute bottom-32 -right-20 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #42a5f5, transparent)' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #d4a017, transparent)' }} />

        <div className="relative z-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'rgba(212,160,23,0.2)', border: '1px solid rgba(212,160,23,0.4)' }}>
              <Shield className="w-7 h-7" style={{ color: '#d4a017' }} />
            </div>
            <div>
              <div className="text-white font-bold text-lg" style={{ fontFamily: 'var(--font-display)' }}>BI Malang</div>
              <div className="text-xs" style={{ color: '#90caf9' }}>Learning Center</div>
            </div>
          </div>

          <div className="max-w-md">
            <div className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#d4a017', fontFamily: 'var(--font-mono)' }}>BANK INDONESIA MALANG</div>
            <h1 className="text-white mb-4" style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 }}>
              Admin Dashboard<br />
              <span style={{ background: 'linear-gradient(135deg, #d4a017, #f0c84a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Learning Center
              </span>
            </h1>
            <p style={{ color: '#90caf9', lineHeight: 1.7, fontSize: '0.95rem' }}>
              Platform manajemen terpadu untuk Perpustakaan, Program Magang, GenBI, dan BI Corner Bank Indonesia Kantor Perwakilan Malang.
            </p>
          </div>
        </div>

        {/* Feature pills */}
        <div className="relative z-10">
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { label: 'Perpustakaan', desc: 'Manajemen koleksi buku' },
              { label: 'Program Magang', desc: 'Rekrutmen & seleksi' },
              { label: 'GenBI', desc: 'CMS & konten' },
              { label: 'BI Corner', desc: 'Fasilitas & galeri' },
            ].map(f => (
              <div key={f.label} className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-white text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>{f.label}</div>
                <div className="text-xs mt-0.5" style={{ color: '#90caf9' }}>{f.desc}</div>
              </div>
            ))}
          </div>
          <div className="text-xs" style={{ color: 'rgba(144,202,249,0.5)' }}>
            © 2025 Bank Indonesia · Kantor Perwakilan Malang
          </div>
        </div>
      </div>

      {/* Right panel – login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--primary)' }}>
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-foreground" style={{ fontFamily: 'var(--font-display)' }}>BI Malang Learning Center</div>
              <div className="text-xs text-muted-foreground">Admin Dashboard</div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-8">
            <div className="mb-8">
              <h2 className="text-foreground mb-1" style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700 }}>
                Selamat Datang
              </h2>
              <p className="text-muted-foreground text-sm">Masuk ke akun admin Anda untuk melanjutkan</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && <p className="rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Alamat Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-input-background text-foreground text-sm transition-all focus:outline-none"
                    style={{ fontFamily: 'var(--font-sans)' }}
                    placeholder="admin@bi-malang.go.id"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Kata Sandi</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-input-background text-foreground text-sm focus:outline-none"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" defaultChecked />
                  <span className="text-sm text-muted-foreground">Ingat saya</span>
                </label>
                <button type="button" className="text-sm font-medium" style={{ color: 'var(--primary)' }}>
                  Lupa kata sandi?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ background: loading ? 'var(--primary)' : 'linear-gradient(135deg, #003087, #1565c0)', fontFamily: 'var(--font-display)' }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Memverifikasi...
                  </>
                ) : 'Masuk ke Dashboard'}
              </button>
            </form>

            <div className="mt-6 p-3 rounded-xl text-xs text-center" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
              <Shield className="inline w-3 h-3 mr-1" />
              Akses dibatasi untuk personel yang berwenang. Semua aktivitas dicatat.
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Bank Indonesia · Kantor Perwakilan Malang · v2.1.0
          </p>
        </div>
      </div>
    </div>
  );
}
