import { useState } from "react";
import { 
  LayoutDashboard, 
  FileEdit, 
  List, 
  Map, 
  CheckSquare, 
  ShieldAlert, 
  Bell, 
  Settings, 
  ChevronDown, 
  ChevronRight, 
  Cpu, 
  BarChart3, 
  HelpCircle,
  FileText
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  unreadCount?: number;
}

export default function Sidebar({ currentView, setCurrentView, unreadCount = 0 }: SidebarProps) {
  const [isAduanOpen, setIsAduanOpen] = useState(true);

  const navItemClass = (view: string) => `
    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer
    ${currentView === view 
      ? "bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600 font-semibold" 
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
  `;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0 shrink-0">
      {/* Top logo & Header */}
      <div className="p-4 flex flex-col gap-1 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {/* Logo representation */}
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h1 className="text-xs font-bold font-display tracking-wider text-indigo-600">JABATAN IMIGRESEN</h1>
            <p className="text-[10px] text-slate-500 leading-tight">MALAYSIA</p>
          </div>
        </div>
        <div className="mt-2 text-[9px] text-slate-400 font-mono tracking-widest leading-none">
          WP KUALA LUMPUR
        </div>
      </div>

      {/* Navigation menu */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {/* Dashboard */}
        <div 
          onClick={() => setCurrentView("dashboard")} 
          className={navItemClass("dashboard")}
        >
          <LayoutDashboard className="w-4.5 h-4.5" />
          <span>Dashboard</span>
        </div>

        {/* Aduan with sub-menu */}
        <div>
          <div 
            onClick={() => setIsAduanOpen(!isAduanOpen)} 
            className="flex items-center justify-between px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-medium cursor-pointer transition-colors duration-150"
          >
            <div className="flex items-center gap-3">
              <FileEdit className="w-4.5 h-4.5" />
              <span>Aduan Penguatkuasaan</span>
            </div>
            {isAduanOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
          </div>
          
          {isAduanOpen && (
            <div className="pl-6 mt-1 space-y-1 border-l border-slate-200 ml-6">
              <div 
                onClick={() => setCurrentView("aduan-baru")} 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium cursor-pointer transition-all duration-150
                  ${currentView === "aduan-baru" ? "text-indigo-600 bg-indigo-50/50 font-semibold" : "text-slate-500 hover:text-slate-900"}`}
              >
                <span>Borang Aduan Baru</span>
              </div>
              <div 
                onClick={() => setCurrentView("aduan-senarai")} 
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs font-medium cursor-pointer transition-all duration-150
                  ${currentView === "aduan-senarai" ? "text-indigo-600 bg-indigo-50/50 font-semibold" : "text-slate-500 hover:text-slate-900"}`}
              >
                <span>Senarai Aduan</span>
              </div>
            </div>
          )}
        </div>

        {/* Hotspot Analytics */}
        <div 
          onClick={() => setCurrentView("peta-hotspot")} 
          className={navItemClass("peta-hotspot")}
        >
          <Map className="w-4.5 h-4.5" />
          <span>Peta Hotspot</span>
        </div>

        {/* AI Pengesahan */}
        <div 
          onClick={() => setCurrentView("ai-pengkelasan")} 
          className={navItemClass("ai-pengkelasan")}
        >
          <CheckSquare className="w-4.5 h-4.5" />
          <div className="flex items-center justify-between w-full">
            <span>AI Pengesahan</span>
            <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded-full font-mono font-bold animate-pulse">
              Klasifikasi
            </span>
          </div>
        </div>

        <div className="h-[1px] bg-slate-100 my-4" />

        {/* Supporting Pages */}
        <div className="text-[10px] uppercase tracking-wider text-slate-400 px-4 mb-2 font-bold font-mono">Lain-lain</div>
        
        <div 
          onClick={() => setCurrentView("laporan")} 
          className={navItemClass("laporan")}
        >
          <FileText className="w-4.5 h-4.5" />
          <span>Laporan</span>
        </div>

        <div 
          onClick={() => setCurrentView("notifikasi")} 
          className="flex items-center justify-between px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-xl text-sm font-medium cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-4.5 h-4.5" />
            <span>Notifikasi</span>
          </div>
          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white text-xs font-bold font-mono px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        <div 
          onClick={() => setCurrentView("tetapan")} 
          className={navItemClass("tetapan")}
        >
          <Settings className="w-4.5 h-4.5" />
          <span>Tetapan</span>
        </div>
      </div>

      {/* Bottom badge */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex flex-col items-center gap-1 shadow-[0_4px_12px_rgba(79,70,229,0.04)] relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          <div className="w-8 h-8 rounded-lg bg-indigo-100/50 border border-indigo-200 flex items-center justify-center shadow-sm">
            <Cpu className="w-4.5 h-4.5 text-indigo-600 animate-spin-slow" />
          </div>
          <span className="text-sm font-bold font-display tracking-widest text-indigo-600 mt-1">AI POWERED</span>
          <span className="text-[10px] text-slate-500 text-center uppercase font-mono leading-none mt-0.5">Sistem Aduan Bersepadu</span>
        </div>
      </div>
    </aside>
  );
}
