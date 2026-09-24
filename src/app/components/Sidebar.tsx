import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  Library,
  FileText,
  GitBranch,
  Archive,
  Cpu,
  UserCheck,
  Layers,
  Building2,
  Shield,
  Menu,
  X,
  Sun,
  Moon,
  BookMarked,
  Globe,
  Tag,
  Printer,
  BarChart3,
  Inbox,
  FolderOpen,
  CheckSquare,
  PieChart,
} from "lucide-react";

export type PageId =
  | "dashboard"
  | "lib-physical"
  | "lib-digital"
  | "lib-authors"
  | "lib-genres"
  | "lib-publishers"
  | "lib-stats"
  | "intern-applicants"
  | "intern-programs"
  | "intern-divisions"
  | "intern-selection"
  | "intern-archive"
  | "genbi"
  | "bicorner"
  | "users"
  | "settings";

interface NavItem {
  id?: PageId;
  label: string;
  icon: React.ReactNode;
  children?: {
    id: PageId;
    label: string;
    icon: React.ReactNode;
  }[];
}

const NAV: NavItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={16} />,
  },
  {
    label: "Manajemen Perpustakaan",
    icon: <Library size={16} />,
    children: [
      {
        id: "lib-physical",
        label: "Buku Fisik",
        icon: <BookOpen size={14} />,
      },
      {
        id: "lib-digital",
        label: "Buku Digital",
        icon: <BookMarked size={14} />,
      },
      {
        id: "lib-authors",
        label: "Pengarang",
        icon: <Users size={14} />,
      },
      {
        id: "lib-genres",
        label: "Genre",
        icon: <Tag size={14} />,
      },
      {
        id: "lib-publishers",
        label: "Penerbit",
        icon: <Printer size={14} />,
      },
      {
        id: "lib-stats",
        label: "Statistik Perpustakaan",
        icon: <BarChart3 size={14} />,
      },
    ],
  },
  {
    label: "Manajemen Magang",
    icon: <FileText size={16} />,
    children: [
      {
        id: "intern-applicants",
        label: "Data Pelamar",
        icon: <Inbox size={14} />,
      },
      {
        id: "intern-programs",
        label: "Program Magang",
        icon: <FolderOpen size={14} />,
      },
      {
        id: "intern-divisions",
        label: "Divisi / Bidang",
        icon: <GitBranch size={14} />,
      },
      {
        id: "intern-selection",
        label: "Proses Seleksi",
        icon: <CheckSquare size={14} />,
      },
      {
        id: "intern-archive",
        label: "Daftar Peserta Magang",
        icon: <Archive size={14} />,
      },
    ],
  },
  {
    id: "genbi",
    label: "Manajemen GenBI",
    icon: <Globe size={16} />,
  },
  {
    id: "bicorner",
    label: "Manajemen BI Corner",
    icon: <Building2 size={16} />,
  },
  {
    id: "users",
    label: "Manajemen Pengguna",
    icon: <UserCheck size={16} />,
  },
  {
    id: "settings",
    label: "Pengaturan Sistem",
    icon: <Settings size={16} />,
  },
];

interface SidebarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  darkMode: boolean;
  onToggleDark: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  currentPage,
  onNavigate,
  darkMode,
  onToggleDark,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const [expanded, setExpanded] = useState<
    Record<string, boolean>
  >({
    "Manajemen Perpustakaan": false,
    "Manajemen Magang": true,
  });

  function toggleGroup(label: string) {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  const isChildActive = (children?: { id: PageId }[]) =>
    children?.some((c) => c.id === currentPage);

  return (
    <>
      {/* Mobile overlay */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-20 lg:hidden bg-black/50"
          onClick={onToggleCollapse}
        />
      )}

      <aside
        className="fixed top-0 left-0 h-full z-30 flex flex-col transition-all duration-300 sidebar-nav"
        style={{
          width: collapsed ? 0 : 256,
          overflow: "hidden",
          minWidth: 0,
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-4"
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            minHeight: 64,
          }}
        >
          {!collapsed && (
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(212,160,23,0.2)",
                  border: "1px solid rgba(212,160,23,0.4)",
                }}
              >
                <Shield
                  size={16}
                  style={{ color: "#d4a017" }}
                />
              </div>
              <div className="min-w-0">
                <div
                  className="text-white text-sm font-bold leading-tight truncate"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  BI Malang
                </div>
                <div
                  className="text-xs leading-tight truncate"
                  style={{ color: "#90caf9" }}
                >
                  Learning Center
                </div>
              </div>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg transition-colors flex-shrink-0"
            style={{ color: "#90caf9" }}
          >
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {NAV.map((item) => {
            if (item.id) {
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id!)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm
                    ${
                      active
                        ? "text-white font-semibold"
                        : "text-sidebar-foreground hover:text-white"
                    }`}
                  style={{
                    background: active
                      ? "rgba(212,160,23,0.2)"
                      : "transparent",
                    borderLeft: active
                      ? "3px solid #d4a017"
                      : "3px solid transparent",
                  }}
                >
                  <span
                    className="flex-shrink-0"
                    style={{
                      color: active ? "#d4a017" : undefined,
                    }}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <span className="truncate">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            }

            // Group
            const groupActive = isChildActive(item.children);
            const isOpen = expanded[item.label] ?? groupActive;

            return (
              <div key={item.label}>
                <button
                  onClick={() =>
                    !collapsed && toggleGroup(item.label)
                  }
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all text-sm
                    ${groupActive ? "text-white" : "text-sidebar-foreground hover:text-white"}`}
                  style={{
                    background:
                      groupActive && collapsed
                        ? "rgba(212,160,23,0.15)"
                        : "transparent",
                  }}
                >
                  <span
                    className="flex-shrink-0"
                    style={{
                      color: groupActive
                        ? "#d4a017"
                        : undefined,
                    }}
                  >
                    {item.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">
                        {item.label}
                      </span>
                      {isOpen ? (
                        <ChevronDown size={13} />
                      ) : (
                        <ChevronRight size={13} />
                      )}
                    </>
                  )}
                </button>

                {!collapsed && isOpen && item.children && (
                  <div
                    className="ml-4 mt-0.5 space-y-0.5 border-l"
                    style={{
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                  >
                    {item.children.map((child) => {
                      const active = currentPage === child.id;
                      return (
                        <button
                          key={child.id}
                          onClick={() => onNavigate(child.id)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-r-xl text-left transition-all text-xs
                            ${active ? "text-white font-semibold" : "text-sidebar-foreground hover:text-white"}`}
                          style={{
                            background: active
                              ? "rgba(212,160,23,0.15)"
                              : "transparent",
                            borderLeft: active
                              ? "2px solid #d4a017"
                              : "2px solid transparent",
                            marginLeft: -1,
                          }}
                        >
                          {child.icon}
                          <span className="truncate">
                            {child.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-2 py-3"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <button
            onClick={onToggleDark}
            title={darkMode ? "Mode Terang" : "Mode Gelap"}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm"
            style={{ color: "#90caf9" }}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {!collapsed && (
              <span>
                {darkMode ? "Mode Terang" : "Mode Gelap"}
              </span>
            )}
          </button>
          {!collapsed && (
            <div className="mt-2 px-3 flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: "rgba(212,160,23,0.3)",
                  color: "#d4a017",
                }}
              >
                A
              </div>
              <div className="min-w-0">
                <div className="text-white text-xs font-medium truncate">
                  Administrator
                </div>
                <div
                  className="text-xs truncate"
                  style={{ color: "#90caf9" }}
                >
                  admin@bi-malang.go.id
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}