import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Activity, 
  MapPin, 
  Cpu, 
  RefreshCw, 
  Check, 
  Users, 
  FileText, 
  DollarSign, 
  ArrowUpRight 
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";
import { Complaint, OperationRecommendation } from "../types";

interface DashboardViewProps {
  complaints: Complaint[];
  recommendations: OperationRecommendation[];
  onRegenerateRecs: () => void;
  onApproveRec: (id: string) => void;
  setCurrentView: (view: string) => void;
  onSelectMapLocation: (loc: string) => void;
}

export default function DashboardView({ 
  complaints, 
  recommendations, 
  onRegenerateRecs, 
  onApproveRec,
  setCurrentView,
  onSelectMapLocation
}: DashboardViewProps) {
  const [activeTabHasil, setActiveTabHasil] = useState<"ringkasan" | "butiran">("ringkasan");
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showApprovalSuccess, setShowApprovalSuccess] = useState(false);

  // Dynamic calculations based on current complaints state
  const totalCount = complaints.length;
  const inProgressCount = complaints.filter(c => c.status === "Dalam Proses").length;
  const completedCount = complaints.filter(c => c.status === "Selesai").length;
  const receivedCount = complaints.filter(c => c.status === "Diterima").length;
  
  const highProfileCount = complaints.filter(c => c.kategori === "High Profile").length;
  const mediumCount = complaints.filter(c => c.kategori === "Medium").length;
  const lowCount = complaints.filter(c => c.kategori === "Low").length;

  const handleRegen = async () => {
    setIsRegenerating(true);
    onRegenerateRecs();
    setTimeout(() => {
      setIsRegenerating(false);
    }, 1200);
  };

  const handleApprove = () => {
    // Approve the pending recommendations
    const pending = recommendations.filter(r => r.status === "Menunggu");
    pending.forEach(r => onApproveRec(r.id));
    setShowApprovalSuccess(true);
    setTimeout(() => {
      setShowApprovalSuccess(false);
    }, 3000);
  };

  // Chart 1: Sumber Penerimaan Aduan Data
  // Dynamic aggregation from complaints
  const sourceStats: { [key: string]: number } = {
    "SISPAA": 512,
    "E-mel": 298,
    "Surat": 126,
    "Walk-in": 152,
    "Telefon": 98,
    "GPS": 61,
  };

  // Adjust pre-populated counts based on actual complaints
  complaints.forEach(c => {
    if (c.sumber === "SISPAA") sourceStats["SISPAA"]++;
    else if (c.sumber === "E-mel") sourceStats["E-mel"]++;
    else if (c.sumber === "Surat") sourceStats["Surat"]++;
    else if (c.sumber === "Hadir (Walk-in)") sourceStats["Walk-in"]++;
    else if (c.sumber === "Telefon") sourceStats["Telefon"]++;
    else sourceStats["GPS"]++;
  });

  const sourceTotal = Object.values(sourceStats).reduce((a, b) => a + b, 0);

  const sourceData = [
    { name: "SISPAA", value: sourceStats["SISPAA"], color: "#00ADB5" },
    { name: "E-mel", value: sourceStats["E-mel"], color: "#FFC107" },
    { name: "Surat", value: sourceStats["Surat"], color: "#00E676" },
    { name: "Hadir (Walk-in)", value: sourceStats["Walk-in"], color: "#9D4EDD" },
    { name: "Telefon", value: sourceStats["Telefon"], color: "#FF4560" },
    { name: "Lokasi GPS", value: sourceStats["GPS"], color: "#2D9CDB" },
  ];

  // Chart 2: Pengkelasan Kategori Aduan Data
  const categoryData = [
    { name: "High Profile", value: highProfileCount, color: "#FF4560" },
    { name: "Medium", value: mediumCount, color: "#FF9F43" },
    { name: "Low", value: lowCount, color: "#00E676" },
  ];

  // Chart 3: Trend Hasil Operasi (7 Hari)
  const trendData = [
    { name: "12 Jun", Operasi: 8, Tangkapan: 32, Notis: 45, Kompaun: 12 },
    { name: "13 Jun", Operasi: 12, Tangkapan: 45, Notis: 58, Kompaun: 18 },
    { name: "14 Jun", Operasi: 15, Tangkapan: 62, Notis: 72, Kompaun: 22 },
    { name: "15 Jun", Operasi: 10, Tangkapan: 38, Notis: 51, Kompaun: 15 },
    { name: "16 Jun", Operasi: 18, Tangkapan: 85, Notis: 110, Kompaun: 31 },
    { name: "17 Jun", Operasi: 22, Tangkapan: 120, Notis: 145, Kompaun: 40 },
    { name: "18 Jun", Operasi: 24, Tangkapan: 156, Notis: 312, Kompaun: 45.6 },
  ];

  // Map locations details
  const locationsList = [
    { name: "KL Sentral", aduan: 156 + (complaints.filter(c => c.sasaran.alamat.includes("KL Sentral")).length * 15), status: "Tinggi", color: "bg-red-500", coord: { x: 45, y: 55 } },
    { name: "Pudu", aduan: 132 + (complaints.filter(c => c.sasaran.alamat.includes("Pudu")).length * 15), status: "Tinggi", color: "bg-red-500", coord: { x: 55, y: 62 } },
    { name: "Chow Kit", aduan: 98 + (complaints.filter(c => c.sasaran.alamat.includes("Chow Kit")).length * 15), status: "Tinggi", color: "bg-red-500", coord: { x: 52, y: 38 } },
    { name: "Bukit Bintang", aduan: 76 + (complaints.filter(c => c.sasaran.alamat.includes("Bukit Bintang")).length * 15), status: "Sederhana", color: "bg-orange-500", coord: { x: 58, y: 48 } },
    { name: "Brickfields", aduan: 65 + (complaints.filter(c => c.sasaran.alamat.includes("Brickfields")).length * 15), status: "Sederhana", color: "bg-orange-500", coord: { x: 38, y: 65 } },
  ];

  // AI Active recommendations
  const activeRecs = recommendations.slice(0, 3);

  return (
    <div className="flex-1 p-8 space-y-6 overflow-y-auto h-screen bg-[#f8fafc] font-sans text-slate-800">
      {/* Top Banner / Breadcrumb & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-5 gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight font-display text-slate-900">SISTEM ADUAN BERSEPADU</h2>
          <p className="text-sm text-slate-500">Peta visual operasi pintar, klasifikasi risiko, dan pemetaan tindakan berasaskan AI.</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-500 font-semibold">Status Sistem:</span>
            <span className="text-emerald-600 font-bold uppercase">AKTIF</span>
          </div>
          <div className="bg-slate-900 px-4 py-2 rounded-xl text-white font-bold shadow-sm">
            18 JUN 2025 | 3:52 PM
          </div>
        </div>
      </div>

      {/* Box Grid - Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-50 rounded-bl-full" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Aduan Diterima</span>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-display text-slate-900">{totalCount}</div>
            <div className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1 font-mono">
              <span>▲ 18.6%</span>
              <span className="text-slate-400">dari semalam</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="absolute top-0 right-0 w-12 h-12 bg-amber-50 rounded-bl-full" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Dalam Proses</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-display text-slate-900">{inProgressCount + receivedCount}</div>
            <div className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1 font-mono">
              <span>▲ 12.3%</span>
              <span className="text-slate-400">dari semalam</span>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-50 rounded-bl-full" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Aduan Selesai</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-display text-slate-900">{completedCount}</div>
            <div className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1 font-mono">
              <span>▲ 15.9%</span>
              <span className="text-slate-400">dari semalam</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-50 rounded-bl-full" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Purata Respons</span>
            <Activity className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-display text-slate-900">2.1 j</div>
            <div className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1 font-mono">
              <span>▼ 8%</span>
              <span className="text-slate-400">lebih pantas</span>
            </div>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="absolute top-0 right-0 w-12 h-12 bg-rose-50 rounded-bl-full" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Kritikal (High)</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold font-display text-slate-900">{highProfileCount}</div>
            <div className="text-[10px] text-rose-600 flex items-center gap-1 mt-1 font-mono">
              <span>▼ 5%</span>
              <span className="text-slate-400">dari semalam</span>
            </div>
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex items-center gap-4 shadow-sm justify-between hover:shadow-md transition-shadow duration-200">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Prestasi</span>
            <div className="text-xl font-bold font-display text-slate-900">92%</div>
            <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-md font-semibold font-mono block text-center">
              CEMERLANG
            </span>
          </div>
          {/* Radial progress */}
          <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="#f1f5f9" strokeWidth="4" fill="transparent" />
              <circle cx="24" cy="24" r="20" stroke="#10b981" strokeWidth="4" fill="transparent" 
                strokeDasharray="125.6"
                strokeDashoffset="10" // (100-92)% * 125.6
              />
            </svg>
            <span className="absolute text-[10px] font-bold font-mono text-slate-900">92%</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Visual components */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Box 1: Sumber Penerimaan Aduan */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
              1. Sumber Penerimaan Aduan
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Jumlah: {sourceTotal}</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-36 h-36 shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-[10px] text-slate-400 uppercase leading-none font-semibold">Jumlah</span>
                <span className="text-xl font-extrabold font-display text-slate-900">{sourceTotal}</span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-2">
              {sourceData.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }}></span>
                    <span className="truncate max-w-[100px] sm:max-w-none font-medium">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-right">
                    <span className="text-slate-800 font-bold">{s.value}</span>
                    <span className="text-slate-400 font-semibold w-10">
                      {Math.round((s.value / sourceTotal) * 100)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Box 2: Pengkelasan Kategori Aduan */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-amber-500 rounded-sm"></span>
                2. Pengkelasan Kategori Aduan
              </h3>
              <span className="text-[10px] text-slate-400 font-mono">Diproses: {totalCount}</span>
            </div>

            <div className="flex items-center justify-around gap-2 mb-4">
              <div className="w-32 h-32 shrink-0 relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={55}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute flex flex-col items-center">
                  <span className="text-[9px] text-slate-400 uppercase font-semibold">Diproses</span>
                  <span className="text-lg font-extrabold font-display text-slate-900">{totalCount}</span>
                </div>
              </div>

              <div className="space-y-3 flex-1 pl-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-rose-600 font-semibold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-red-500 shrink-0 animate-pulse"></span>
                    High Profile:
                  </span>
                  <span className="font-mono text-slate-800 font-bold">{highProfileCount} ({Math.round((highProfileCount/totalCount)*100)}%)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-600 font-semibold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500 shrink-0"></span>
                    Medium:
                  </span>
                  <span className="font-mono text-slate-800 font-bold">{mediumCount} ({Math.round((mediumCount/totalCount)*100)}%)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-600 font-semibold flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500 shrink-0"></span>
                    Low:
                  </span>
                  <span className="font-mono text-slate-800 font-bold">{lowCount} ({Math.round((lowCount/totalCount)*100)}%)</span>
                </div>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setCurrentView("ai-pengkelasan")} 
            className="bg-rose-50 border border-rose-100 hover:bg-rose-100/50 rounded-2xl p-3.5 flex items-center justify-between shadow-sm cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-rose-100 flex items-center justify-center border border-rose-200">
                <AlertTriangle className="w-4.5 h-4.5 text-rose-600 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-rose-700 tracking-wider">High Profile Alert</div>
                <div className="text-[11px] text-slate-600">Terdapat {highProfileCount} kes berisiko tinggi dikesan.</div>
              </div>
            </div>
            <span className="text-2xl font-extrabold font-mono text-rose-600">{highProfileCount}</span>
          </div>
        </div>

        {/* Box 3: Analisis Hotspot - Aduan Spatial */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-3 bg-indigo-500 rounded-sm"></span>
              3. Analisis Hotspot - Aduan Spatial
            </h3>
            <span 
              onClick={() => setCurrentView("peta-hotspot")}
              className="text-[10px] text-indigo-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              Peta Penuh <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Mini Map Visual Representation */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl h-40 relative overflow-hidden group">
              {/* Abstract lines to represent map */}
              <div className="absolute inset-0 opacity-20 flex flex-col justify-between pointer-events-none">
                <div className="h-full border-r border-dashed border-slate-400 ml-[30%]"></div>
                <div className="h-full border-r border-dashed border-slate-400 ml-[60%] -mt-40"></div>
                <div className="w-full border-b border-dashed border-slate-400 mt-[40%] -ml-60"></div>
              </div>
              
              {/* Pulse Hotspots markers matching layout */}
              {locationsList.map((loc, index) => (
                <div 
                  key={index} 
                  onClick={() => onSelectMapLocation(loc.name)}
                  style={{ left: `${loc.coord.x}%`, top: `${loc.coord.y}%` }} 
                  className={`absolute -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform`}
                >
                  <div className={`absolute w-8 h-8 rounded-full opacity-40 animate-ping ${loc.status === "Tinggi" ? "bg-red-500" : "bg-orange-500"}`}></div>
                  <div className={`w-3.5 h-3.5 rounded-full border border-white/60 flex items-center justify-center shadow-md ${loc.status === "Tinggi" ? "bg-red-600 shadow-red-600/50" : "bg-orange-500 shadow-orange-500/50"}`}>
                    <span className="text-[7px] font-bold text-white leading-none font-mono">{index+1}</span>
                  </div>
                  {/* Tooltip name */}
                  <span className="absolute bottom-5 bg-slate-900 text-[8px] px-1.5 py-0.5 rounded shadow text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {loc.name} ({loc.aduan})
                  </span>
                </div>
              ))}

              <div className="absolute bottom-2 left-2 bg-white border border-slate-200 px-1.5 py-0.5 rounded-md text-[8px] font-mono text-slate-500 font-bold shadow-sm">
                KUALA LUMPUR
              </div>
            </div>

            {/* List Lokasi Hotspot Utama */}
            <div className="space-y-1.5 overflow-y-auto max-h-40">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1">Lokasi Hotspot Utama</span>
              {locationsList.map((loc, idx) => (
                <div 
                  key={idx}
                  onClick={() => onSelectMapLocation(loc.name)}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono text-slate-400 w-4 font-bold">{idx + 1}.</span>
                    <span className="text-xs text-slate-700 font-bold">{loc.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500 font-mono font-semibold">{loc.aduan} Aduan</span>
                    <span className={`w-2 h-2 rounded-full ${loc.color}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Row 2: AI Recommendations, AI Validation, and Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Box 4: AI Cadangan Operasi */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
                4. AI Cadangan Operasi
              </h3>
              <span className="text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-1.5 py-0.5 rounded font-mono font-bold">
                CADANGAN DIJANA AI
              </span>
            </div>

            <div className="space-y-3">
              {activeRecs.length > 0 ? (
                activeRecs.map((rec, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3 rounded-2xl border bg-slate-50 relative overflow-hidden transition-all duration-200
                      ${rec.prioriti === "Tinggi" 
                        ? "border-rose-100 hover:border-rose-300" 
                        : rec.prioriti === "Sederhana" 
                        ? "border-amber-100 hover:border-amber-300" 
                        : "border-emerald-100 hover:border-emerald-300"}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 font-display flex items-center gap-1.5">
                          {rec.tajuk}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[210px]">{rec.tindakan}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[9px] text-slate-400 font-mono font-bold">Lokasi:</span>
                          <span className="text-[10px] text-indigo-600 font-mono font-bold flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-indigo-500" /> {rec.lokasi}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded shrink-0
                        ${rec.prioriti === "Tinggi" 
                          ? "bg-rose-50 text-rose-600 border border-rose-100" 
                          : rec.prioriti === "Sederhana" 
                          ? "bg-amber-50 text-amber-600 border border-amber-100" 
                          : "bg-emerald-50 text-emerald-600 border border-emerald-100"}`}
                      >
                        {rec.prioriti}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs">Tiada cadangan operasi aktif. Sila jana semula.</div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1 font-mono">
              Keyakinan AI: <span className="text-emerald-600 font-bold">92%</span>
            </span>
            <button 
              onClick={handleRegen}
              disabled={isRegenerating}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-white ${isRegenerating ? "animate-spin" : ""}`} />
              {isRegenerating ? "Menjana Semula..." : "Jana Semula Cadangan"}
            </button>
          </div>
        </div>

        {/* Box 5: AI Pengesahan */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
                5. AI Pengesahan
              </h3>
              <span className="text-[10px] text-slate-400 font-mono uppercase font-semibold">Pengesahan</span>
            </div>

            {/* Radial Accuracy Indicator */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden mb-4">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="56" cy="56" r="48" stroke="#f1f5f9" strokeWidth="6" fill="transparent" />
                  <circle cx="56" cy="56" r="48" stroke="#4f46e5" strokeWidth="6" strokeDasharray="301.4" strokeDashoffset="24.1" fill="transparent" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold font-display text-slate-900">92%</span>
                  <span className="text-[9px] text-indigo-600 uppercase tracking-widest font-bold">DISAHKAN</span>
                </div>
              </div>
            </div>

            {/* Parameter checklist */}
            <div className="space-y-2.5 px-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Relevan dengan trend aduan:</span>
                <span className="text-emerald-600 font-mono font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Disahkan
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Sumber anggota mencukupi:</span>
                <span className="text-emerald-600 font-mono font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Disahkan
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Tahap risiko operasi:</span>
                <span className="text-emerald-600 font-bold uppercase font-mono">RENDAH</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Anggaran impak dijangka:</span>
                <span className="text-indigo-600 font-bold uppercase font-mono">TINGGI</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100">
            {showApprovalSuccess ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl py-2.5 px-3 flex items-center gap-2 text-emerald-600 text-xs font-bold font-mono animate-fade-in">
                <Check className="w-4 h-4 shrink-0" />
                Semua cadangan disahkan & disimpan dalam pelan tindakan!
              </div>
            ) : (
              <button 
                onClick={handleApprove}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Sahkan & Terima Cadangan
              </button>
            )}
          </div>
        </div>

        {/* Box 6: Hasil Operasi & Trend */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
                6. Hasil Operasi
              </h3>
              
              {/* Tab Toggles */}
              <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100">
                <button 
                  onClick={() => setActiveTabHasil("ringkasan")}
                  className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg transition-all duration-150 cursor-pointer
                    ${activeTabHasil === "ringkasan" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Ringkasan
                </button>
                <button 
                  onClick={() => setActiveTabHasil("butiran")}
                  className={`text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-lg transition-all duration-150 cursor-pointer
                    ${activeTabHasil === "butiran" ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
                >
                  Butiran
                </button>
              </div>
            </div>

            {activeTabHasil === "ringkasan" ? (
              <div className="space-y-4">
                {/* Stats counters */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-2.5 border border-slate-100 rounded-xl">
                    <div className="text-[9px] uppercase font-bold text-slate-400 font-mono">Operasi Dijalankan</div>
                    <div className="text-lg font-extrabold font-display text-indigo-600 flex items-center gap-1.5 mt-0.5">
                      <Activity className="w-4 h-4" /> 24
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2.5 border border-slate-100 rounded-xl">
                    <div className="text-[9px] uppercase font-bold text-slate-400 font-mono">Jumlah Tangkapan</div>
                    <div className="text-lg font-extrabold font-display text-amber-600 flex items-center gap-1.5 mt-0.5">
                      <Users className="w-4 h-4" /> 156
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2.5 border border-slate-100 rounded-xl">
                    <div className="text-[9px] uppercase font-bold text-slate-400 font-mono">Notis Diberikan</div>
                    <div className="text-lg font-extrabold font-display text-emerald-600 flex items-center gap-1.5 mt-0.5">
                      <FileText className="w-4 h-4" /> 312
                    </div>
                  </div>
                  <div className="bg-slate-50 p-2.5 border border-slate-100 rounded-xl">
                    <div className="text-[9px] uppercase font-bold text-slate-400 font-mono">Jumlah Kompaun</div>
                    <div className="text-lg font-extrabold font-display text-rose-600 flex items-center gap-1 mt-0.5">
                      <DollarSign className="w-4 h-4" /> RM 45.6K
                    </div>
                  </div>
                </div>

                {/* Micro trend Line Chart */}
                <div className="h-28 w-full mt-2">
                  <div className="text-[9px] text-slate-400 font-mono uppercase font-bold mb-1">Trend Hasil Operasi (7 Hari)</div>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData}>
                      <Tooltip 
                        contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "10px" }}
                        labelStyle={{ color: "#64748b" }}
                      />
                      <Line type="monotone" dataKey="Operasi" stroke="#4f46e5" strokeWidth={2} dot={false} name="Ops" />
                      <Line type="monotone" dataKey="Tangkapan" stroke="#d97706" strokeWidth={2} dot={false} name="PATI" />
                      <Line type="monotone" dataKey="Notis" stroke="#059669" strokeWidth={1.5} dot={false} name="Notis" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              /* Detailed Case Logs List */
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                <span className="text-[9px] text-slate-400 uppercase font-mono font-bold block mb-1">Aktiviti Terkini (7 Hari)</span>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Restoran Selera Kampung (Pudu)</span>
                    <span className="text-emerald-600">Selesai</span>
                  </div>
                  <p className="text-[10px] text-slate-600">Ops Saringan Premis. 8 PATI ditangkap, notis kompaun RM 10,000 diberikan kepada majikan.</p>
                  <span className="text-[9px] text-slate-400 block font-mono">Tarikh: 17 Jun 2025</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Pasar Malam Chow Kit</span>
                    <span className="text-emerald-600">Selesai</span>
                  </div>
                  <p className="text-[10px] text-slate-600">Ops Tapis Bersepadu. Pemeriksaan 45 individu, 12 PATI didapati menyalahgunakan pas lawatan.</p>
                  <span className="text-[9px] text-slate-400 block font-mono">Tarikh: 16 Jun 2025</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>Rumah Transit Flat Sentul</span>
                    <span className="text-emerald-600">Selesai</span>
                  </div>
                  <p className="text-[10px] text-slate-600">Ops Sapu. Serbuan fajar rumah flat disewa PATI overstay. 15 warga Bangladesh ditahan.</p>
                  <span className="text-[9px] text-slate-400 block font-mono">Tarikh: 15 Jun 2025</span>
                </div>
              </div>
            )}
          </div>

          <div className="text-[9px] text-slate-400 font-mono text-center mt-3 pt-3 border-t border-slate-100 leading-tight">
            * Data dikemaskini secara langsung daripada pangkalan data e-Aduan Penguatkuasaan JIM.
          </div>
        </div>

      </div>
    </div>
  );
}
