import { useState } from "react";
import { 
  MapPin, 
  TrendingUp, 
  Activity, 
  Map, 
  Plus, 
  Minus, 
  RefreshCw, 
  AlertTriangle, 
  Check, 
  Eye, 
  Cpu, 
  LineChart as ChartIcon,
  ShieldAlert
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis, 
  Legend 
} from "recharts";
import { OperationRecommendation } from "../types";

interface HotspotMapViewProps {
  recommendations: OperationRecommendation[];
  onRegenerateRecs: () => void;
  onApproveRec: (id: string) => void;
  onRejectRec: (id: string) => void;
  onSelectMapLocation: (loc: string) => void;
}

export default function HotspotMapView({ 
  recommendations, 
  onRegenerateRecs, 
  onApproveRec,
  onRejectRec,
  onSelectMapLocation
}: HotspotMapViewProps) {
  const [zoom, setZoom] = useState(12);
  const [selectedHotspot, setSelectedHotspot] = useState<string | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [selectedRecDetail, setSelectedRecDetail] = useState<OperationRecommendation | null>(null);

  const handleRegen = () => {
    setIsRegenerating(true);
    onRegenerateRecs();
    setTimeout(() => {
      setIsRegenerating(false);
    }, 1000);
  };

  // Hotspots list
  const hotspots = [
    { name: "KL Sentral", count: 156, level: "Tinggi", trend: "Meningkat", color: "bg-red-500", border: "border-red-500/30", glow: "marker-pulse-red", x: 42, y: 52, details: "Kawasan sekitar stesen pengangkutan utama, dikesan kemasukan PATI rentas negeri menggunakan dokumen tamat tempoh." },
    { name: "Pudu", count: 132, level: "Tinggi", trend: "Meningkat", color: "bg-red-500", border: "border-red-500/30", glow: "marker-pulse-red", x: 55, y: 58, details: "Kediaman padat flat kos rendah dan rumah kedai lama, isu overstay buruh kasar binaan & pembersihan." },
    { name: "Chow Kit", count: 98, level: "Tinggi", trend: "Meningkat", color: "bg-red-500", border: "border-red-500/30", glow: "marker-pulse-red", x: 48, y: 35, details: "Kawasan pasar borong dan peruncitan basah, pekerja warga asing bekerja tanpa permit & perlindungan majikan." },
    { name: "Bukit Bintang", count: 76, level: "Sederhana", trend: "Stabil", color: "bg-orange-500", border: "border-orange-500/30", glow: "marker-pulse-orange", x: 62, y: 46, details: "Sektor perkhidmatan, urut, restoran, dan hotel, dikesan penyalahgunaan pas lawatan sosial oleh warga asing." },
    { name: "Brickfields", count: 65, level: "Sederhana", trend: "Menurun", color: "bg-orange-500", border: "border-orange-500/30", glow: "marker-pulse-orange", x: 35, y: 65, details: "Sektor pembinaan berskala kecil & perniagaan kedai makan, dokumen tamat tempoh dan penyalahgunaan permit." }
  ];

  // Trend data over 7 days for the selected hotspot or global
  const trendData = [
    { name: "12 Jun", "KL Sentral": 105, "Pudu": 85, "Chow Kit": 62, "Bukit Bintang": 48, "Brickfields": 45 },
    { name: "13 Jun", "KL Sentral": 115, "Pudu": 92, "Chow Kit": 68, "Bukit Bintang": 50, "Brickfields": 44 },
    { name: "14 Jun", "KL Sentral": 125, "Pudu": 105, "Chow Kit": 75, "Bukit Bintang": 58, "Brickfields": 52 },
    { name: "15 Jun", "KL Sentral": 120, "Pudu": 112, "Chow Kit": 72, "Bukit Bintang": 55, "Brickfields": 48 },
    { name: "16 Jun", "KL Sentral": 138, "Pudu": 120, "Chow Kit": 85, "Bukit Bintang": 68, "Brickfields": 58 },
    { name: "17 Jun", "KL Sentral": 145, "Pudu": 128, "Chow Kit": 92, "Bukit Bintang": 72, "Brickfields": 62 },
    { name: "18 Jun", "KL Sentral": 156, "Pudu": 132, "Chow Kit": 98, "Bukit Bintang": 76, "Brickfields": 65 }
  ];

  const getHotspotLevelColor = (level: string) => {
    return level === "Tinggi" ? "text-red-750 font-bold bg-red-50 border-red-200" : "text-orange-755 font-bold bg-orange-50 border-orange-200";
  };

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase flex items-center gap-2">
            <Map className="w-5.5 h-5.5 text-indigo-600" />
            AI Hotspot Analytics
          </h2>
          <p className="text-xs text-slate-500 font-semibold">Analisis kepadatan geo-spasial aduan, ramalan trend penguatkuasaan, dan pengurusan cadangan taktikal.</p>
        </div>
        <div className="text-xs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-indigo-600 font-bold shadow-xs">
          Zon Utama: WILAYAH PERSEKUTUAN KUALA LUMPUR
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Jumlah Hotspot Aktif</span>
            <div className="text-xl font-bold text-slate-900">12 Kawasan</div>
            <span className="text-[9px] text-emerald-600 font-bold font-mono">▲ +3 dari semalam</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-550 animate-pulse" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Aduan di Zon Hotspot</span>
            <div className="text-xl font-bold text-slate-900">678 Aduan</div>
            <span className="text-[9px] text-emerald-600 font-bold font-mono">▲ +18.6% dari semalam</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Trend Aduan Keseluruhan</span>
            <div className="text-xl font-bold text-red-650">MENINGKAT</div>
            <span className="text-[9px] text-slate-400 font-bold font-mono">3 kawasan kritikal dikesan</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-orange-600 animate-bounce" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">Keberkesanan Operasi</span>
            <div className="text-xl font-bold text-emerald-650">82% Indeks</div>
            <span className="text-[9px] text-emerald-600 font-bold font-mono">▲ +12% dari minggu lepas</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
            <Activity className="w-5 h-5 text-emerald-600" />
          </div>
        </div>
      </div>

      {/* Main Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side (Map and lists) - 7 cols */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Heatmap Screen */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm relative text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                <span className="w-1.5 h-3 bg-red-500 rounded-sm"></span>
                Peta Kepekatan Aduan (Heatmap)
              </h3>
              
              {/* Zoom Buttons */}
              <div className="flex bg-slate-50 border border-slate-200 rounded-xl p-1 gap-1">
                <button onClick={() => setZoom(z => Math.max(z-1, 10))} className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"><Minus className="w-3.5 h-3.5" /></button>
                <span className="text-[10px] font-mono font-bold px-1.5 flex items-center text-slate-600">{zoom}x</span>
                <button onClick={() => setZoom(z => Math.min(z+1, 15))} className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            {/* Interactive map representation */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl h-80 relative overflow-hidden group">
              {/* Abstract streets mesh pattern */}
              <div className="absolute inset-0 opacity-15 flex flex-col justify-between p-4 pointer-events-none">
                <div className="h-full border-r border-dashed border-slate-400 ml-[20%]"></div>
                <div className="h-full border-r border-dashed border-slate-400 ml-[50%] -mt-[300px]"></div>
                <div className="h-full border-r border-dashed border-slate-400 ml-[80%] -mt-[300px]"></div>
                <div className="w-full border-b border-dashed border-slate-400 mt-[30%] -ml-4 pointer-events-none"></div>
                <div className="w-full border-b border-dashed border-slate-400 mt-[30%] -ml-4 pointer-events-none"></div>
              </div>

              {/* Heatmap blur circles representation */}
              <div className="absolute top-[48%] left-[44%] w-24 h-24 rounded-full bg-red-500/30 blur-2xl animate-pulse" />
              <div className="absolute top-[52%] left-[53%] w-28 h-28 rounded-full bg-red-500/35 blur-3xl" />
              <div className="absolute top-[32%] left-[45%] w-20 h-20 rounded-full bg-orange-500/25 blur-2xl" />
              <div className="absolute top-[42%] left-[60%] w-16 h-16 rounded-full bg-orange-500/30 blur-2xl" />

              {/* Real markers plotted onto coordinates */}
              {hotspots.map((h, index) => (
                <div 
                  key={index}
                  onClick={() => setSelectedHotspot(selectedHotspot === h.name ? null : h.name)}
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform duration-200 hover:scale-125`}
                >
                  {/* Glowing outer wave */}
                  <div className={`absolute w-8 h-8 rounded-full opacity-50 ${h.glow}`}></div>
                  
                  {/* Small inner dot */}
                  <div className={`w-4 h-4 rounded-full border-2 border-slate-150 flex items-center justify-center font-bold text-[8px] font-mono text-white shadow-lg ${h.color}`}>
                    {index+1}
                  </div>

                  {/* Float details panel on select */}
                  {selectedHotspot === h.name && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-800 p-2.5 rounded-lg shadow-xl text-[10px] w-44 space-y-1 z-30 animate-fade-in font-sans">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                        <strong className="text-white uppercase font-bold">{h.name}</strong>
                        <span className="text-[9px] text-red-400 font-bold">{h.count} kes</span>
                      </div>
                      <p className="text-slate-400 leading-normal text-[9px]">{h.details}</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectMapLocation(h.name);
                        }}
                        className="w-full bg-blue-600/50 hover:bg-blue-600 text-white font-bold py-1 rounded text-[9px] text-center block mt-1 transition-colors"
                      >
                        Tapis Aduan Kawasan Ini
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* Map UI overlay elements */}
              <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 p-2 rounded-lg text-[9px] space-y-1 font-mono text-slate-400 shadow-md">
                <span className="font-bold text-white block uppercase mb-1">Kepekatan Aduan</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-red-600 rounded"></span>
                  <span>Tinggi (&gt; 90 kes)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-orange-500 rounded"></span>
                  <span>Sederhana (50 - 90 kes)</span>
                </div>
              </div>

              <div className="absolute top-3 right-3 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded text-[9px] font-mono text-slate-300">
                Lat/Lng: 3.1412, 101.6925 (KUALA LUMPUR)
              </div>
            </div>
          </div>

          {/* Lokasi Hotspot list */}
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider font-display text-white block mb-3">Zon Hotspot &amp; Statistik</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Tabular list */}
              <div className="space-y-1.5 max-h-56 overflow-y-auto">
                {hotspots.map((h, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setSelectedHotspot(h.name);
                      onSelectMapLocation(h.name);
                    }}
                    className={`flex items-center justify-between p-2 rounded bg-slate-950/50 border border-slate-900 hover:border-slate-800 cursor-pointer transition-all
                      ${selectedHotspot === h.name ? "border-cyan-500/40 bg-slate-900" : ""}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 font-bold">{idx + 1}.</span>
                      <span className="text-xs text-slate-300 font-semibold">{h.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-100 font-mono">{h.count} Aduan</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase font-mono ${getHotspotLevelColor(h.level)}`}>
                        {h.level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dynamic Insight Box based on selected map location */}
              <div className="bg-slate-950/60 border border-slate-850 p-4 rounded-xl flex flex-col justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] text-slate-500 uppercase font-bold mb-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    Insight AI Terkini
                  </div>
                  {selectedHotspot ? (
                    <div className="space-y-2">
                      <div className="font-bold text-white uppercase text-xs flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-red-500" /> {selectedHotspot}
                      </div>
                      <p className="text-slate-400 leading-relaxed text-[11px] italic">
                        "{hotspots.find(h => h.name === selectedHotspot)?.details}"
                      </p>
                    </div>
                  ) : (
                    <p className="text-slate-500 leading-relaxed italic text-[11px]">
                      Sila klik mana-mana lokasi hotspot utama di dalam senarai atau di atas peta untuk memaparkan ulasan risikan AI dan huraian kes khusus.
                    </p>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 font-mono pt-3 border-t border-slate-900 flex items-center justify-between mt-2">
                  <span>Kemaskini: Live</span>
                  <span>Enjin: gemini-3.5-flash</span>
                </div>
              </div>

            </div>
          </div>

          {/* Line Chart: Trend Aduan Berdasarkan Lokasi */}
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-2">
              <ChartIcon className="w-4.5 h-4.5 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider font-display text-white">Trend Aduan Berdasarkan Lokasi (7 Hari)</span>
            </div>
            
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="name" stroke="#64748B" fontSize={10} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={10} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#0F172A", border: "1px solid #1E293B", borderRadius: "8px", fontSize: "10px" }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "10px" }} />
                  <Line type="monotone" dataKey="KL Sentral" stroke="#FF4560" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Pudu" stroke="#00ADB5" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="Chow Kit" stroke="#FF9F43" strokeWidth={1.5} dot={false} />
                  <Line type="monotone" dataKey="Bukit Bintang" stroke="#9D4EDD" strokeWidth={1.5} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right Side (AI Recommendations Actions Panel) - 5 cols */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-900 border border-slate-850 rounded-xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider font-display text-white flex items-center gap-2">
                <span className="w-1.5 h-3 bg-cyan-400 rounded-sm"></span>
                Senarai Cadangan Operasi AI
              </h3>
              
              <button 
                onClick={handleRegen}
                disabled={isRegenerating}
                className="p-1 text-cyan-400 hover:text-cyan-300 disabled:opacity-40 cursor-pointer transition-colors"
                title="Jana Semula Cadangan"
              >
                <RefreshCw className={`w-4 h-4 ${isRegenerating ? "animate-spin" : ""}`} />
              </button>
            </div>

            <p className="text-[11px] text-slate-400">Cadangan operasi yang dijana oleh AI berdasarkan analisis hotspot, kepekatan aduan, dan faktor trend.</p>

            <div className="space-y-3.5 max-h-[580px] overflow-y-auto pr-1">
              {recommendations.map((rec) => (
                <div 
                  key={rec.id} 
                  className={`p-3.5 rounded-lg border bg-slate-950/40 space-y-3.5 transition-all
                    ${rec.status === "Disahkan" ? "border-emerald-500/25 bg-emerald-950/5" : "border-slate-800"}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 font-display flex items-center gap-1.5">
                        {rec.tajuk}
                        {rec.status === "Disahkan" && (
                          <span className="bg-emerald-500/10 text-emerald-400 text-[8px] font-bold font-mono px-1.5 py-0.2 rounded border border-emerald-500/20">
                            DISAHKAN
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400 shrink-0" /> {rec.lokasi} | Impak: <strong className="text-emerald-400">{rec.impak}</strong>
                      </p>
                    </div>

                    <span className={`text-[9px] font-bold uppercase font-mono px-2 py-0.5 rounded
                      ${rec.prioriti === "Tinggi" 
                        ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                        : rec.prioriti === "Sederhana" 
                        ? "bg-orange-500/10 text-orange-500 border border-orange-500/20" 
                        : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}
                    >
                      {rec.prioriti}
                    </span>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-900 text-xs">
                    <button 
                      onClick={() => setSelectedRecDetail(rec)}
                      className="flex-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 py-1.5 rounded flex items-center justify-center gap-1 text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> Butiran
                    </button>
                    
                    {rec.status === "Menunggu" && (
                      <>
                        <button 
                          onClick={() => onApproveRec(rec.id)}
                          className="flex-1 bg-blue-600/20 hover:bg-blue-600 text-white border border-blue-500/25 py-1.5 rounded flex items-center justify-center gap-1 text-[10px] font-bold cursor-pointer transition-all"
                        >
                          <Check className="w-3.5 h-3.5 text-blue-400" /> Sahkan
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Operation detail modal overlay */}
      {selectedRecDetail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl max-w-md w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldAlert className="w-5 h-5 text-indigo-400 animate-pulse" />
              <h3 className="text-sm font-bold font-display text-white uppercase">Perancangan Operasi Taktikal</h3>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-950 pb-1">
                <span className="text-slate-500">Tajuk Operasi:</span>
                <span className="font-bold text-slate-200">{selectedRecDetail.tajuk}</span>
              </div>
              <div className="flex justify-between border-b border-slate-950 pb-1">
                <span className="text-slate-500">Zon Hotspot:</span>
                <span className="font-semibold text-cyan-400 font-mono">{selectedRecDetail.lokasi}</span>
              </div>
              <div className="flex justify-between border-b border-slate-950 pb-1">
                <span className="text-slate-500">Prioriti Impak:</span>
                <span className="font-bold text-amber-500 uppercase">{selectedRecDetail.prioriti}</span>
              </div>
              <div className="flex justify-between border-b border-slate-950 pb-1">
                <span className="text-slate-500">Ramalan Pengurangan Aduan:</span>
                <span className="font-semibold text-emerald-400 font-mono">{selectedRecDetail.impak}</span>
              </div>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] text-slate-500 uppercase font-bold font-mono">Tindakan Langkah-demi-Langkah</span>
                <p className="text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-900 text-[11px]">
                  {selectedRecDetail.tindakan}
                </p>
              </div>
            </div>

            <div className="pt-2 flex gap-3 justify-end text-xs">
              <button 
                onClick={() => setSelectedRecDetail(null)}
                className="bg-slate-950 border border-slate-800 text-slate-300 px-4 py-2 rounded-lg cursor-pointer hover:border-slate-700"
              >
                Tutup
              </button>
              {selectedRecDetail.status === "Menunggu" && (
                <button 
                  onClick={() => {
                    onApproveRec(selectedRecDetail.id);
                    setSelectedRecDetail(null);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer font-bold"
                >
                  Sahkan Operasi
                </button>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
