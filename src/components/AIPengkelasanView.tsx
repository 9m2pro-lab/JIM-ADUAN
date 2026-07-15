import { useState } from "react";
import { 
  CheckSquare, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowUpRight, 
  TrendingUp, 
  Calendar, 
  Cpu, 
  Check, 
  FileDown, 
  LineChart as ChartIcon, 
  ListFilter 
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
import { Complaint } from "../types";

interface AIPengkelasanViewProps {
  complaints: Complaint[];
  setCurrentView: (view: string) => void;
  onSelectKategoriFilter: (kat: string) => void;
}

export default function AIPengkelasanView({ complaints, setCurrentView, onSelectKategoriFilter }: AIPengkelasanViewProps) {
  const [downloading, setDownloading] = useState(false);

  const totalCount = complaints.length;
  const highProfileCount = complaints.filter(c => c.kategori === "High Profile").length;
  const mediumCount = complaints.filter(c => c.kategori === "Medium").length;
  const lowCount = complaints.filter(c => c.kategori === "Low").length;

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert("Laporan Analitik Pengkelasan Kategori Aduan AI berjaya dieksport ke format PDF!");
    }, 1500);
  };

  // Pie chart categories data
  const pieData = [
    { name: "High Profile", value: highProfileCount, color: "#FF4560" },
    { name: "Medium", value: mediumCount, color: "#FF9F43" },
    { name: "Low", value: lowCount, color: "#00E676" }
  ];

  // Trend data over 7 days for lines
  const trendData = [
    { name: "12 Jun", High: 45, Medium: 410, Low: 580 },
    { name: "13 Jun", High: 48, Medium: 425, Low: 592 },
    { name: "14 Jun", High: 52, Medium: 450, Low: 615 },
    { name: "15 Jun", High: 50, Medium: 438, Low: 610 },
    { name: "16 Jun", High: 55, Medium: 480, Low: 642 },
    { name: "17 Jun", High: 58, Medium: 495, Low: 658 },
    { name: "18 Jun", High: highProfileCount, Medium: mediumCount, Low: lowCount }
  ];

  // Fetch recent cases for sample columns
  const getSampleCases = (kat: "High Profile" | "Medium" | "Low") => {
    return complaints.filter(c => c.kategori === kat).slice(0, 3);
  };

  const highCases = getSampleCases("High Profile");
  const mediumCases = getSampleCases("Medium");
  const lowCases = getSampleCases("Low");

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto h-screen bg-slate-950 text-slate-100 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-900 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold font-display tracking-tight text-white uppercase flex items-center gap-2">
            <CheckSquare className="w-5.5 h-5.5 text-cyan-400" />
            AI Pengkelasan Kategori Aduan
          </h2>
          <p className="text-xs text-slate-400">Klasifikasi pintar Aduan Pendatang Asing Tanpa Izin (PATI) berdasarkan analisis risiko, impak keselamatan, dan parameter sindiket.</p>
        </div>

        <button 
          onClick={handleExport}
          disabled={downloading}
          className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-bold text-slate-200 px-4 py-2.5 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
        >
          <FileDown className={`w-4 h-4 text-cyan-400 ${downloading ? "animate-bounce" : ""}`} />
          {downloading ? "Mengeksport..." : "Eksport Laporan"}
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl shadow-md">
          <span className="text-[10px] text-slate-500 uppercase font-bold font-mono block">Jumlah Aduan Diproses</span>
          <div className="text-xl font-bold font-display text-white mt-1">{totalCount} Kes</div>
          <span className="text-[9px] text-slate-500 font-mono">100% daripada jumlah aduan</span>
        </div>
        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl border-l-4 border-l-red-500 shadow-md">
          <span className="text-[10px] text-red-400 uppercase font-bold font-mono block">High Profile</span>
          <div className="text-xl font-bold font-display text-white mt-1">{highProfileCount} Kes</div>
          <span className="text-[9px] text-red-500 font-mono">▲ +4.7% dari semalam</span>
        </div>
        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl border-l-4 border-l-orange-500 shadow-md">
          <span className="text-[10px] text-orange-400 uppercase font-bold font-mono block">Medium (Sederhana)</span>
          <div className="text-xl font-bold font-display text-white mt-1">{mediumCount} Kes</div>
          <span className="text-[9px] text-orange-400 font-mono">▲ +41.1% dari semalam</span>
        </div>
        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl border-l-4 border-l-emerald-500 shadow-md">
          <span className="text-[10px] text-emerald-400 uppercase font-bold font-mono block">Low (Rendah)</span>
          <div className="text-xl font-bold font-display text-white mt-1">{lowCount} Kes</div>
          <span className="text-[9px] text-emerald-500 font-mono">▲ +54.2% dari semalam</span>
        </div>
        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl shadow-md">
          <span className="text-[10px] text-slate-500 uppercase font-bold font-mono block">Tahap Ketepatan AI</span>
          <div className="text-xl font-bold font-display text-cyan-400 mt-1">92.4%</div>
          <span className="text-[9px] text-emerald-400 font-mono">▲ +5% dari minggu lepas</span>
        </div>
      </div>

      {/* Multi-Source Stats Badge Row */}
      <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl flex flex-wrap items-center gap-3 shadow-sm">
        <span className="text-[10px] text-slate-500 uppercase font-bold font-mono tracking-wider mr-2">Sumber Data Aduan (Multi-Source):</span>
        <span className="bg-slate-950 border border-slate-800 text-xs px-3 py-1 rounded-lg text-slate-300 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span> SISPAA (41%)
        </span>
        <span className="bg-slate-950 border border-slate-800 text-xs px-3 py-1 rounded-lg text-slate-300 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span> E-mel (24%)
        </span>
        <span className="bg-slate-950 border border-slate-800 text-xs px-3 py-1 rounded-lg text-slate-300 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Surat (10%)
        </span>
        <span className="bg-slate-950 border border-slate-800 text-xs px-3 py-1 rounded-lg text-slate-300 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Walk-In (12%)
        </span>
        <span className="bg-slate-950 border border-slate-800 text-xs px-3 py-1 rounded-lg text-slate-300 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> Telefon (8%)
        </span>
      </div>

      {/* Main Grid: Classification Details and Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Classification columns (8 cols of grid) */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Column 1: High Profile */}
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between min-h-[580px]">
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  HIGH PROFILE
                </span>
                <h4 className="text-sm font-bold font-display text-white mt-2">{highProfileCount} Aduan ({Math.round((highProfileCount/totalCount)*100)}%)</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">Isu berimpak tinggi, melibatkan ancaman keselamatan, sindiket, atau kes berprofil tinggi.</p>
              </div>

              {/* Main criteria */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold font-mono">Ciri-ciri Utama</span>
                <ul className="space-y-1.5 text-[10px] text-slate-300 list-disc list-inside">
                  <li>Melibatkan sindiket / penyeludupan</li>
                  <li>Ancaman keselamatan negara</li>
                  <li>Kesalahan berulang / riwayat jenayah</li>
                  <li>Melibatkan dokumen palsu / penipuan</li>
                </ul>
              </div>

              {/* Recent Cases */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold font-mono">Contoh Aduan Terkini</span>
                <div className="space-y-2">
                  {highCases.map((c) => (
                    <div key={c.id} className="p-2 bg-slate-950/60 border border-slate-900 hover:border-slate-800 rounded text-[10px] space-y-1 leading-normal">
                      <div className="flex items-center justify-between font-bold text-slate-300">
                        <span className="truncate max-w-[120px]">{c.sasaran.nama}</span>
                        <span className="text-red-400 uppercase font-mono text-[8px] font-bold">TINGGI</span>
                      </div>
                      <p className="text-slate-400 line-clamp-2">"{c.kejadian.butiran}"</p>
                      <div className="text-[8px] text-slate-500 font-mono flex justify-between">
                        <span>{c.sumber} | {c.tarikhAduan}</span>
                        <span className="text-cyan-400 font-bold">{c.sasaran.daerah}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                onSelectKategoriFilter("High Profile");
                setCurrentView("aduan-senarai");
              }}
              className="w-full bg-red-600/15 hover:bg-red-600 border border-red-500/20 text-red-400 hover:text-white font-bold py-2 rounded text-[11px] text-center block mt-4 transition-all cursor-pointer"
            >
              Lihat Senarai Penuh ({highProfileCount})
            </button>
          </div>

          {/* Column 2: Medium */}
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between min-h-[580px]">
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] bg-orange-500/10 text-orange-500 border border-orange-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  MEDIUM (SEDERHANA)
                </span>
                <h4 className="text-sm font-bold font-display text-white mt-2">{mediumCount} Aduan ({Math.round((mediumCount/totalCount)*100)}%)</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">Isu berimpak sederhana yang memerlukan tindakan pemeriksaan dokumen dan operasi susulan.</p>
              </div>

              {/* Main criteria */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold font-mono">Ciri-ciri Utama</span>
                <ul className="space-y-1.5 text-[10px] text-slate-300 list-disc list-inside">
                  <li>PATI bekerja tanpa dokumen sah</li>
                  <li>Bekerja tanpa permit / melanggar pas</li>
                  <li>Tinggal melebihi tempoh dibenarkan</li>
                  <li>Aktiviti mencurigakan di premis</li>
                </ul>
              </div>

              {/* Recent Cases */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold font-mono">Contoh Aduan Terkini</span>
                <div className="space-y-2">
                  {mediumCases.map((c) => (
                    <div key={c.id} className="p-2 bg-slate-950/60 border border-slate-900 hover:border-slate-800 rounded text-[10px] space-y-1 leading-normal">
                      <div className="flex items-center justify-between font-bold text-slate-300">
                        <span className="truncate max-w-[120px]">{c.sasaran.nama}</span>
                        <span className="text-orange-400 uppercase font-mono text-[8px] font-bold">SEDERHANA</span>
                      </div>
                      <p className="text-slate-400 line-clamp-2">"{c.kejadian.butiran}"</p>
                      <div className="text-[8px] text-slate-500 font-mono flex justify-between">
                        <span>{c.sumber} | {c.tarikhAduan}</span>
                        <span className="text-cyan-400 font-bold">{c.sasaran.daerah}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                onSelectKategoriFilter("Medium");
                setCurrentView("aduan-senarai");
              }}
              className="w-full bg-orange-500/15 hover:bg-orange-500 border border-orange-500/20 text-orange-400 hover:text-white font-bold py-2 rounded text-[11px] text-center block mt-4 transition-all cursor-pointer"
            >
              Lihat Senarai Penuh ({mediumCount})
            </button>
          </div>

          {/* Column 3: Low */}
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 shadow-lg space-y-4 flex flex-col justify-between min-h-[580px]">
            <div className="space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                  LOW (RENDAH)
                </span>
                <h4 className="text-sm font-bold font-display text-white mt-2">{lowCount} Aduan ({Math.round((lowCount/totalCount)*100)}%)</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-normal">Isu berimpak rendah yang lebih kepada maklumat am, khidmat nasihat, atau pertanyaan sokongan.</p>
              </div>

              {/* Main criteria */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold font-mono">Ciri-ciri Utama</span>
                <ul className="space-y-1.5 text-[10px] text-slate-300 list-disc list-inside">
                  <li>Pertanyaan prosedur atau pentadbiran</li>
                  <li>Maklumat am tentang imigresen</li>
                  <li>Cadangan / maklum balas awam</li>
                  <li>Isu yang bukan kesalahan imigresen</li>
                </ul>
              </div>

              {/* Recent Cases */}
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 uppercase font-bold font-mono">Contoh Aduan Terkini</span>
                <div className="space-y-2">
                  {lowCases.length > 0 ? (
                    lowCases.map((c) => (
                      <div key={c.id} className="p-2 bg-slate-950/60 border border-slate-900 hover:border-slate-800 rounded text-[10px] space-y-1 leading-normal">
                        <div className="flex items-center justify-between font-bold text-slate-300">
                          <span className="truncate max-w-[120px]">{c.sasaran.nama}</span>
                          <span className="text-emerald-400 uppercase font-mono text-[8px] font-bold">RENDAH</span>
                        </div>
                        <p className="text-slate-400 line-clamp-2">"{c.kejadian.butiran}"</p>
                        <div className="text-[8px] text-slate-500 font-mono flex justify-between">
                          <span>{c.sumber} | {c.tarikhAduan}</span>
                          <span className="text-cyan-400 font-bold">{c.sasaran.daerah}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-500 py-6 text-[10px]">Tiada kes berlabel Low didaftarkan.</div>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={() => {
                onSelectKategoriFilter("Low");
                setCurrentView("aduan-senarai");
              }}
              className="w-full bg-emerald-500/15 hover:bg-emerald-500 border border-emerald-500/20 text-emerald-400 hover:text-white font-bold py-2 rounded text-[11px] text-center block mt-4 transition-all cursor-pointer"
            >
              Lihat Senarai Penuh ({lowCount})
            </button>
          </div>

        </div>

        {/* Right Panel: Taburan and trend charts (4 cols of grid) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Taburan Kategori Pie Chart */}
          <div className="bg-slate-900 border border-slate-850 p-5 rounded-xl shadow-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider font-display text-white block">Taburan Kategori Aduan</span>
            
            <div className="h-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Jumlah</span>
                <span className="text-2xl font-bold font-display text-white">{totalCount}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-slate-950/50 border border-slate-900 rounded-lg">
                <span className="text-red-500 font-bold block">{highProfileCount}</span>
                <span className="text-[9px] text-slate-500 font-bold block">HIGH PROFILE</span>
              </div>
              <div className="p-2 bg-slate-950/50 border border-slate-900 rounded-lg">
                <span className="text-orange-500 font-bold block">{mediumCount}</span>
                <span className="text-[9px] text-slate-500 font-bold block">MEDIUM</span>
              </div>
              <div className="p-2 bg-slate-950/50 border border-slate-900 rounded-lg">
                <span className="text-emerald-400 font-bold block">{lowCount}</span>
                <span className="text-[9px] text-slate-500 font-bold block">LOW</span>
              </div>
            </div>
          </div>

          {/* Trend Pengkelasan 7 Hari */}
          <div className="bg-slate-900 border border-slate-850 p-5 rounded-xl shadow-xl space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
              <ChartIcon className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider font-display text-white">Trend Pengkelasan (7 Hari)</span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", borderRadius: "8px", fontSize: "10px" }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                  <Line type="monotone" dataKey="High" stroke="#FF4560" strokeWidth={2} dot={false} name="High" />
                  <Line type="monotone" dataKey="Medium" stroke="#FF9F43" strokeWidth={2} dot={false} name="Medium" />
                  <Line type="monotone" dataKey="Low" stroke="#00E676" strokeWidth={1.5} dot={false} name="Low" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insight Box */}
          <div className="bg-slate-900 border border-slate-850 p-5 rounded-xl shadow-xl space-y-3">
            <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 uppercase font-bold">
              <Cpu className="w-4 h-4 text-cyan-400" />
              RUMUSAN INSIGHT AI
            </div>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-normal">
                  <strong className="text-white font-semibold">54.2%</strong> aduan diklasifikasikan sebagai <strong className="text-emerald-400 font-semibold">LOW</strong> (kebanyakannya pertanyaan am &amp; pentadbiran).
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-normal">
                  Kategori <strong className="text-orange-400 font-semibold">MEDIUM</strong> meningkat sebanyak <strong className="text-white">12%</strong> berbanding minggu lepas, menandakan pertambahan kes PATI overstay.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-slate-300 leading-normal">
                  Tumpuan operasi penguatkuasaan bersepadu dicadangkan tertumpu di zon <strong className="text-cyan-400 font-mono font-semibold">KL Sentral, Pudu &amp; Chow Kit</strong>.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
