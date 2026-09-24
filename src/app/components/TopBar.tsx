import { Bell, Search, ChevronDown, Menu } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  "lib-physical": "Buku Fisik",
  "lib-digital": "Buku Digital",
  "lib-authors": "Pengarang",
  "lib-genres": "Genre",
  "lib-publishers": "Penerbit",
  "lib-stats": "Statistik Perpustakaan",
  "intern-applicants": "Data Pelamar",
  "intern-programs": "Program Magang",
  "intern-divisions": "Divisi / Bidang",
  "intern-selection": "Proses Seleksi",
  "intern-archive": "Daftar Peserta Magang",
  genbi: "Manajemen GenBI",
  bicorner: "Manajemen BI Corner",
  users: "Manajemen Pengguna",
  settings: "Pengaturan Sistem",
};

interface TopBarProps {
  currentPage: string;
  onToggleSidebar: () => void;
}

export function TopBar({
  currentPage,
  onToggleSidebar,
}: TopBarProps) {
  return (
    <header
      className="h-16 flex items-center justify-between px-4 lg:px-6"
      style={{
        background: "var(--card)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors lg:hidden"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1
            className="text-foreground font-bold"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.1rem",
            }}
          >
            {PAGE_TITLES[currentPage] ?? "Dashboard"}
          </h1>
          <p className="text-xs text-muted-foreground">
            BI Malang Learning Center
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            className="w-52 pl-8 pr-4 py-2 rounded-xl border border-border bg-input-background text-sm text-foreground focus:outline-none focus:border-primary"
            placeholder="Cari..."
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "#ef4444" }}
          />
        </button>

        {/* User */}
        <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border hover:bg-muted transition-colors cursor-pointer">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{
              background:
                "linear-gradient(135deg, #003087, #1565c0)",
            }}
          >
            A
          </div>
          <div className="hidden sm:block">
            <div className="text-xs font-semibold text-foreground leading-tight">
              Administrator
            </div>
            <div className="text-xs text-muted-foreground leading-tight">
              admin
            </div>
          </div>
          <ChevronDown
            size={13}
            className="text-muted-foreground hidden sm:block"
          />
        </div>
      </div>
    </header>
  );
}