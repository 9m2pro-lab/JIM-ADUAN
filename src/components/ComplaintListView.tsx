import { useState } from "react";
import { 
  Search, 
  Filter, 
  MapPin, 
  User, 
  Calendar, 
  Clock, 
  Cpu, 
  Check, 
  ShieldAlert, 
  X, 
  ArrowUpRight, 
  Plus, 
  FileText 
} from "lucide-react";
import { Complaint } from "../types";

interface ComplaintListViewProps {
  complaints: Complaint[];
  setCurrentView: (view: string) => void;
  selectedLocationFilter?: string;
  onClearLocationFilter?: () => void;
}

export default function ComplaintListView({ 
  complaints, 
  setCurrentView,
  selectedLocationFilter,
  onClearLocationFilter
}: ComplaintListViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [kategoriFilter, setKategoriFilter] = useState("Semua");
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // Filter complaints based on Search, Status, Kategori and optional Map Location Filter
  const filteredComplaints = complaints.filter((c) => {
    // 1. Map Location filter
    if (selectedLocationFilter) {
      const matchLoc = c.sasaran.alamat.toLowerCase().includes(selectedLocationFilter.toLowerCase()) || 
                       c.sasaran.daerah.toLowerCase().includes(selectedLocationFilter.toLowerCase()) ||
                       c.sasaran.mukim.toLowerCase().includes(selectedLocationFilter.toLowerCase());
      if (!matchLoc) return false;
    }

    // 2. Text Search
    const searchLower = search.toLowerCase();
    const matchSearch = 
      c.rujukan.toLowerCase().includes(searchLower) ||
      c.pengadu.nama.toLowerCase().includes(searchLower) ||
      c.sasaran.nama.toLowerCase().includes(searchLower) ||
      c.kejadian.kesalahan.toLowerCase().includes(searchLower) ||
      c.kejadian.butiran.toLowerCase().includes(searchLower);

    // 3. Status filter
    const matchStatus = statusFilter === "Semua" || c.status === statusFilter;

    // 4. Kategori filter
    const matchKategori = kategoriFilter === "Semua" || c.kategori === kategoriFilter;

    return matchSearch && matchStatus && matchKategori;
  });

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto h-screen bg-slate-50 text-slate-800 font-sans">
      
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 uppercase flex items-center gap-2">
            <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
            Senarai Aduan Penguatkuasaan
          </h2>
          <p className="text-xs text-slate-500 font-medium">Pangkalan data utama bagi semua kes aduan awam yang diuruskan dan diklasifikasikan oleh AI.</p>
        </div>

        <button 
          onClick={() => setCurrentView("aduan-baru")}
          className="bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" /> Daftar Aduan Baru
        </button>
      </div>

      {/* Map location active filter banner */}
      {selectedLocationFilter && (
        <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-2xl flex items-center justify-between text-xs text-indigo-900 shadow-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 animate-bounce text-indigo-600" />
            <span>Menapis aduan berdasarkan zon hotspot: <strong className="font-bold uppercase">{selectedLocationFilter}</strong></span>
          </div>
          <button 
            onClick={onClearLocationFilter}
            className="text-[10px] bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded-xl cursor-pointer font-bold transition-all shadow-sm"
          >
            Kosongkan Penapis Lokasi
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
        {/* Search input */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari rujukan, pengadu, sasaran, atau kata kunci..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium transition-all"
          />
        </div>

        {/* Status filter dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <Filter className="w-4.5 h-4.5 text-slate-400 shrink-0" />
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white font-bold transition-all"
          >
            <option value="Semua">Semua Status</option>
            <option value="Diterima">Diterima / Baru</option>
            <option value="Dalam Proses">Dalam Siasatan / Proses</option>
            <option value="Selesai">Selesai Tindakan</option>
          </select>
        </div>

        {/* Kategori filter dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <Cpu className="w-4.5 h-4.5 text-slate-400 shrink-0" />
          <select 
            value={kategoriFilter} 
            onChange={(e) => setKategoriFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white font-bold transition-all"
          >
            <option value="Semua">Semua Kategori (AI)</option>
            <option value="High Profile">High Profile</option>
            <option value="Medium">Medium (Sederhana)</option>
            <option value="Low">Low (Rendah)</option>
          </select>
        </div>
      </div>

      {/* Main Complaints Table / Cards List */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase font-mono text-slate-400 bg-slate-50 font-bold">
                <th className="py-3 px-4">No. Rujukan / Tarikh</th>
                <th className="py-3 px-4">Sumber / Pengadu</th>
                <th className="py-3 px-4">Sasaran / Tempat</th>
                <th className="py-3 px-4">Kesalahan Yang Disyaki</th>
                <th className="py-3 px-4">Klasifikasi Risiko (AI)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    {/* Ref & Date */}
                    <td className="py-3.5 px-4 space-y-1">
                      <div className="font-mono font-bold text-slate-800">{c.rujukan}</div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1 font-semibold">
                        <Calendar className="w-3 h-3" /> {c.tarikhAduan} | {c.masaAduan}
                      </div>
                    </td>

                    {/* Source & Reporter */}
                    <td className="py-3.5 px-4 space-y-1">
                      <span className="bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-lg text-[10px] text-slate-500 font-bold">
                        {c.sumber}
                      </span>
                      <div className="text-slate-700 font-bold truncate max-w-[120px]">{c.pengadu.nama}</div>
                    </td>

                    {/* Target & Address */}
                    <td className="py-3.5 px-4 space-y-1">
                      <div className="font-bold text-slate-800 truncate max-w-[150px]">{c.sasaran.nama}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[150px] flex items-center gap-1 font-semibold">
                        <MapPin className="w-3 h-3 text-indigo-500" /> {c.sasaran.alamat}
                      </div>
                    </td>

                    {/* Suspected Violation */}
                    <td className="py-3.5 px-4 font-bold text-slate-700 truncate max-w-[160px]" title={c.kejadian.kesalahan}>
                      {c.kejadian.kesalahan}
                    </td>

                    {/* AI Category label */}
                    <td className="py-3.5 px-4">
                      <span className={`text-[9px] font-extrabold uppercase font-mono px-2 py-0.5 rounded-lg border
                        ${c.kategori === "High Profile" 
                          ? "bg-red-50 text-red-750 border-red-200" 
                          : c.kategori === "Medium" 
                          ? "bg-orange-50 text-orange-755 border-orange-200" 
                          : "bg-emerald-50 text-emerald-755 border-emerald-200"}`}
                      >
                        {c.kategori}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-4 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block border
                        ${c.status === "Selesai" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                          : c.status === "Dalam Proses" 
                          ? "bg-orange-50 text-orange-700 border-orange-200" 
                          : "bg-blue-50 text-blue-700 border-blue-200"}`}
                      >
                        {c.status}
                      </span>
                    </td>

                    {/* Action button */}
                    <td className="py-3.5 px-4 text-center">
                      <button 
                        onClick={() => setSelectedComplaint(c)}
                        className="text-[10px] bg-slate-50 hover:bg-indigo-50 text-indigo-600 border border-slate-200 hover:border-indigo-200 px-2.5 py-1 rounded-xl cursor-pointer transition-colors font-bold shadow-sm"
                      >
                        Detail Kes
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-450 font-bold">
                    Tiada rekod aduan ditemui sepadan dengan carian / penapis anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table summary footer */}
        <div className="bg-slate-50 p-3.5 border-t border-slate-200 flex justify-between items-center text-[10px] font-mono text-slate-400 font-bold">
          <span>Menunjukkan {filteredComplaints.length} daripada {complaints.length} rekod aduan</span>
          <span>Sistem e-Aduan Penguatkuasaan v2.0</span>
        </div>
      </div>

      {/* Detailed Modal Popup for Selected Complaint */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in backdrop-blur-md">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 relative shadow-2xl text-slate-800">
            {/* Close button */}
            <button 
              onClick={() => setSelectedComplaint(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 bg-slate-100 p-1.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-200 pb-4">
              <span className={`text-[10px] font-extrabold uppercase font-mono px-2 py-0.5 rounded-lg border mb-2 inline-block
                ${selectedComplaint.kategori === "High Profile" 
                  ? "bg-red-50 text-red-750 border-red-200" 
                  : selectedComplaint.kategori === "Medium" 
                  ? "bg-orange-50 text-orange-755 border-orange-200" 
                  : "bg-emerald-50 text-emerald-755 border-emerald-200"}`}
              >
                {selectedComplaint.kategori} | RISIKO AI
              </span>
              <h3 className="text-lg font-bold text-slate-900">{selectedComplaint.rujukan}</h3>
              <p className="text-xs text-slate-400 font-semibold">Didaftarkan pada: {selectedComplaint.tarikhAduan} | {selectedComplaint.masaAduan} ({selectedComplaint.saluran})</p>
            </div>

            {/* Modal Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Left Column: Complaint & Case description */}
              <div className="md:col-span-2 space-y-6">
                
                {/* 1. Pengadu */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
                  <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">1. Butiran Pengadu</h4>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <span className="text-slate-500 font-medium">Nama Pengadu:</span>
                    <span className="font-bold text-slate-800 text-right">{selectedComplaint.pengadu.nama}</span>
                    <span className="text-slate-500 font-medium">No KP / Pasport:</span>
                    <span className="font-bold text-slate-800 text-right font-mono">{selectedComplaint.pengadu.kpPasport}</span>
                    <span className="text-slate-500 font-medium">Warganegara:</span>
                    <span className="font-bold text-slate-800 text-right">{selectedComplaint.pengadu.warganegara}</span>
                    <span className="text-slate-500 font-medium">Hubungan:</span>
                    <span className="font-bold text-slate-800 text-right">Orang Awam</span>
                  </div>
                </div>

                {/* 2. Sasaran */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2 text-xs">
                  <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">2. Butiran Sasaran</h4>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-medium">Nama Sasaran / Premis:</span>
                      <span className="font-bold text-slate-800 text-right">{selectedComplaint.sasaran.nama}</span>
                    </div>
                    {selectedComplaint.sasaran.ssm && (
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500 font-medium">No. Pendaftaran (SSM):</span>
                        <span className="font-bold text-slate-800 text-right font-mono">{selectedComplaint.sasaran.ssm}</span>
                      </div>
                    )}
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-500 font-medium">Alamat Sasaran:</span>
                      <span className="font-bold text-slate-800 text-right truncate max-w-[280px]" title={selectedComplaint.sasaran.alamat}>{selectedComplaint.sasaran.alamat}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-medium">Negeri / Daerah / Mukim:</span>
                      <span className="font-bold text-slate-800 text-right">{selectedComplaint.sasaran.negeri} / {selectedComplaint.sasaran.daerah} / {selectedComplaint.sasaran.mukim}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Butiran Kejadian */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3 text-xs">
                  <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">3. Butiran Kejadian / Aduan</h4>
                  <div className="grid grid-cols-2 gap-y-1.5 border-b border-slate-100 pb-2.5">
                    <span className="text-slate-500 font-medium">Tarikh & Masa Kejadian:</span>
                    <span className="font-bold text-slate-800 text-right">{selectedComplaint.kejadian.tarikh} | {selectedComplaint.kejadian.masa}</span>
                    <span className="text-slate-500 font-medium">Kekerapan:</span>
                    <span className="font-bold text-slate-800 text-right">{selectedComplaint.kejadian.kekerapan}</span>
                    <span className="text-slate-500 font-medium">Warganegara Terlibat:</span>
                    <span className="font-bold text-slate-800 text-right">{selectedComplaint.kejadian.warganegara}</span>
                    <span className="text-slate-500 font-medium">Anggaran Bilangan:</span>
                    <span className="font-bold text-slate-800 text-right">{selectedComplaint.kejadian.bilangan}</span>
                  </div>
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase font-mono">Penerangan Kejadian</span>
                    <p className="text-slate-700 leading-normal italic bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      "{selectedComplaint.kejadian.butiran}"
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Column: AI Analysis & recommendations */}
              <div className="space-y-6">
                
                {/* AI Intelligence Box */}
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-bl-full" />
                  <div className="flex items-center gap-2 font-display">
                    <Cpu className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">4. Kecerdasan AI</h4>
                  </div>

                  <div className="space-y-3 text-xs pt-1">
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-400 uppercase font-bold font-mono">Justifikasi Klasifikasi</span>
                      <p className="text-slate-700 leading-normal font-medium bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                        {selectedComplaint.justifikasiAI || "Analisis automatik bagi menentukan tahap profil impak keselamatan, sindiket overstay, dan keutamaan serbuan strategik."}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="text-[9px] text-slate-400 uppercase font-bold font-mono">Kriteria Utama Dikesan</span>
                      <div className="space-y-1.5">
                        {selectedComplaint.kriteriaAI && selectedComplaint.kriteriaAI.map((kri, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-slate-700 text-[11px] font-bold">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>{kri}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Recommendation Operations */}
                {selectedComplaint.cadanganOperasiAI && (
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 relative overflow-hidden shadow-sm">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-bl-full" />
                    <div className="flex items-center gap-2 font-display">
                      <ShieldAlert className="w-5 h-5 text-orange-600" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">5. Cadangan Operasi AI</h4>
                    </div>

                    <div className="space-y-2.5 text-xs pt-1">
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500 font-medium">Cadangan:</span>
                        <span className="font-bold text-slate-800 text-right">{selectedComplaint.cadanganOperasiAI.tajuk}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500 font-medium">Prioriti:</span>
                        <span className={`text-[10px] font-bold uppercase font-mono px-1.5 py-0.2 rounded border
                          ${selectedComplaint.cadanganOperasiAI.prioriti === "Tinggi" 
                            ? "bg-red-50 text-red-700 border-red-205" 
                            : selectedComplaint.cadanganOperasiAI.prioriti === "Sederhana" 
                            ? "bg-orange-50 text-orange-700 border-orange-205" 
                            : "bg-emerald-50 text-emerald-700 border-emerald-205"}`}
                        >
                          {selectedComplaint.cadanganOperasiAI.prioriti}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500 font-medium">Zon Lokasi:</span>
                        <span className="font-mono text-indigo-600 font-bold">{selectedComplaint.cadanganOperasiAI.lokasi}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500 font-medium">Anggaran Impak:</span>
                        <span className="font-mono text-emerald-600 font-bold">{selectedComplaint.cadanganOperasiAI.impak}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-400 uppercase font-bold font-mono">Huraian Tindakan</span>
                        <p className="text-[11px] text-slate-700 leading-normal bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                          {selectedComplaint.cadanganOperasiAI.tindakan}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Modal Action footer */}
            <div className="border-t border-slate-200 pt-4 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-400 font-mono font-bold">Status siasatan semasa:</span>
                <span className={`font-bold px-2.5 py-0.5 rounded-full border
                  ${selectedComplaint.status === "Selesai" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : selectedComplaint.status === "Dalam Proses" 
                    ? "bg-orange-50 text-orange-700 border-orange-200 animate-pulse" 
                    : "bg-blue-50 text-blue-700 border-blue-200"}`}
                >
                  {selectedComplaint.status}
                </span>
              </div>
              
              <button 
                onClick={() => setSelectedComplaint(null)}
                className="bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-bold px-5 py-2.5 rounded-xl text-slate-700 cursor-pointer shadow-sm transition-all"
              >
                Tutup Butiran Kes
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
