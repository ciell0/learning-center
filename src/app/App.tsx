/* MARKER-MAKE-KIT-INVOKED */
import { useState, useEffect } from "react";
import { LoginPage } from "./components/LoginPage";
import { Sidebar, type PageId } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { DashboardHome } from "./components/DashboardHome";
import { ApplicantDataPage } from "./components/ApplicantData";
import { InternshipProgramsPage } from "./components/InternshipPrograms";
import { DivisionManagementPage } from "./components/DivisionManagement";
import { SelectionProcessPage } from "./components/SelectionProcess";
import { InternshipArchivePage } from "./components/InternshipArchive";
import { LibraryManagementPage } from "./components/LibraryManagement";
import { UserManagementPage } from "./components/UserManagement";
import { GenBIManagementPage } from "./components/GenBIManagement";
import { BICornerManagementPage } from "./components/BICornerManagement";
import { SystemSettingsPage } from "./components/SystemSettings";
import { supabase } from "../lib/supabase";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      const { data } = await supabase.auth.getSession();
      if (mounted) {
        setLoggedIn(Boolean(data.session));
        setAuthLoaded(true);
      }
    }

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setLoggedIn(Boolean(session));
        setAuthLoaded(true);
      }
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (!authLoaded) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-sm text-muted-foreground">Memuat sesi admin...</div>
        </div>
      </div>
    );
  }

  if (!loggedIn) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <LoginPage onLogin={() => setLoggedIn(true)} />
      </div>
    );
  }

  function renderPage() {
    if (currentPage.startsWith('lib-')) {
      return <LibraryManagementPage tab={currentPage} />;
    }
    switch (currentPage) {
      case 'dashboard': return <DashboardHome />;
      case 'intern-applicants': return <ApplicantDataPage />;
      case 'intern-programs': return <InternshipProgramsPage />;
      case 'intern-divisions': return <DivisionManagementPage />;
      case 'intern-selection': return <SelectionProcessPage />;
      case 'intern-archive': return <InternshipArchivePage />;
      case 'genbi': return <GenBIManagementPage />;
      case 'bicorner': return <BICornerManagementPage />;
      case 'users': return <UserManagementPage />;
      case 'settings': return <SystemSettingsPage />;
      default: return <DashboardHome />;
    }
  }

  const SIDEBAR_WIDTH = 256;

  return (
    <div className={`flex h-screen overflow-hidden bg-background ${darkMode ? 'dark' : ''}`} style={{ fontFamily: 'var(--font-sans)' }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={page => {
          setCurrentPage(page);
          if (window.innerWidth < 1024) setSidebarCollapsed(true);
        }}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(v => !v)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(v => !v)}
      />

      <div
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? 0 : SIDEBAR_WIDTH, minWidth: 0 }}
      >
        <TopBar currentPage={currentPage} onToggleSidebar={() => setSidebarCollapsed(v => !v)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
