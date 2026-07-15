import { useState } from "react";
import { 
  FileText, 
  User, 
  MapPin, 
  Calendar, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft, 
  UploadCloud, 
  Trash2, 
  AlertCircle, 
  Cpu, 
  ShieldAlert, 
  Loader2, 
  Check, 
  Map 
} from "lucide-react";
import { Complaint } from "../types";

interface ComplaintWizardProps {
  onSubmit: (formData: any) => Promise<Complaint>;
  onSuccess: () => void;
}

export default function ComplaintWizard({ onSubmit, onSuccess }: ComplaintWizardProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<Complaint | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    sumber: "SISPAA",
    kategoriAduan: "Pekerja Asing Tanpa Permit (PATI)",
    subKategori: "Bekerja Tanpa Permit",
    tarikhAduan: "2025-06-18",
    masaAduan: "10:21 AM",
    saluran: "Sistem SISPAA",
    idRujukan: "",
    noAduanLama: "",

    // Pengadu
    pengaduNama: "Ahmad Bin Hassan",
    pengaduKp: "801010-10-1234",
    pengaduWarganegara: "Malaysia",
    pengaduLahir: "1980-10-10",
    pengaduJantina: "Lelaki",
    pengaduKaum: "Melayu",
    pengaduAlamat: "No 12, Jalan Melati 3, Taman Melati, 53100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur.",
    pengaduTel: "012-334 6789",
    pengaduTelRumah: "03-1234 5678",
    pengaduEmail: "ahmad.hassan@email.com",
    pengaduPekerjaan: "Pekerja Swasta",
    pengaduHubungan: "Orang Awam",

    // Sasaran
    sasaranJenis: "Premis / Tempat",
    sasaranNama: "ABC Construction Sdn Bhd",
    sasaranSSM: "202001012345 (1357923-M)",
    sasaranAlamat: "Lot 12, Jalan Industri 4/7, Taman Perindustrian, 47180 Puchong, Selangor Darul Ehsan.",
    sasaranNegeri: "Selangor",
    sasaranDaerah: "Petaling",
    sasaranMukim: "Puchong",
    sasaranPoskod: "47180",
    sasaranLat: "3.0331",
    sasaranLng: "101.5984",
    sasaranPenerangan: "Berhampiran kilang XYZ, belakang kawasan perumahan Sri Puchong.",
    sasaranTandaPeta: true,

    // Kejadian
    kejadianTarikh: "2025-06-17",
    kejadianMasa: "02:30 PM",
    kejadianKekerapan: "Berulang",
    kejadianTempat: "Tapak pembinaan berdekatan dengan Jalan Industri 4/7, Taman Perindustrian Puchong.",
    kejadianKesalahan: "Pekerja Asing Tanpa Permit",
    kejadianBilangan: "25 - 50 orang",
    kejadianWarganegara: "Bangladesh, Indonesia",
    kejadianButiran: "Terdapat sekumpulan pekerja asing dipercayai bekerja di tapak pembinaan tanpa permit yang sah. Mereka bekerja pada waktu siang dan kadang-kadang sehingga lewat petang. Tiada pengawasan daripada pihak berkuasa.",

    sayaSetuju: false
  });

  // Simulated files upload list
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: "IMG_001.jpg", size: "1.2 MB", type: "image/jpeg" },
    { name: "IMG_002.jpg", size: "1.1 MB", type: "image/jpeg" },
    { name: "Video_001.mp4", size: "4.5 MB", type: "video/mp4" },
    { name: "Dokumen.pdf", size: "520 KB", type: "application/pdf" }
  ]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleNext = () => {
    if (step < 5) setStep(prev => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleDeleteFile = (idx: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSimulateAddFile = () => {
    const mockFiles = [
      { name: "Bukti_Foto_PATI.jpg", size: "1.8 MB", type: "image/jpeg" },
      { name: "Surat_Aduan_Tambahan.docx", size: "320 KB", type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" },
      { name: "Peta_Lokasi_Sasaran.png", size: "840 KB", type: "image/png" }
    ];
    const fileToAdd = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    if (!uploadedFiles.some(f => f.name === fileToAdd.name)) {
      setUploadedFiles(prev => [...prev, fileToAdd]);
    }
  };

  const handleFormSubmit = async () => {
    if (!formData.sayaSetuju) {
      alert("Sila tandakan kotak pengesahan maklumat sebelum menghantar.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Assemble data structure matching API schema
      const submitPayload = {
        sumber: formData.sumber,
        kategori: "Medium", // AI handles classification on backend
        subKategori: formData.kategoriAduan,
        tarikhAduan: formData.tarikhAduan,
        masaAduan: formData.masaAduan,
        saluran: formData.saluran,
        pengadu: {
          nama: formData.pengaduNama,
          kpPasport: formData.pengaduKp,
          warganegara: formData.pengaduWarganegara,
          telefon: formData.pengaduTel,
          email: formData.pengaduEmail,
        },
        sasaran: {
          jenis: formData.sasaranJenis,
          nama: formData.sasaranNama,
          ssm: formData.sasaranSSM,
          alamat: formData.sasaranAlamat,
          negeri: formData.sasaranNegeri,
          daerah: formData.sasaranDaerah,
          mukim: formData.sasaranMukim,
          poskod: formData.sasaranPoskod,
          lat: parseFloat(formData.sasaranLat) || 3.1412,
          lng: parseFloat(formData.sasaranLng) || 101.6925,
        },
        kejadian: {
          tarikh: formData.kejadianTarikh,
          masa: formData.kejadianMasa,
          kekerapan: formData.kejadianKekerapan,
          tempat: formData.kejadianTempat,
          kesalahan: formData.kejadianKesalahan,
          bilangan: formData.kejadianBilangan,
          warganegara: formData.kejadianWarganegara,
          butiran: formData.kejadianButiran,
        }
      };

      const result = await onSubmit(submitPayload);
      setAiResult(result);
      setStep(6); // Step 6 is AI response screen
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Steps breadcrumb data
  const stepsMeta = [
    { num: 1, label: "Maklumat Aduan", sub: "Butiran asas aduan" },
    { num: 2, label: "Maklumat Pengadu", sub: "Butiran peribadi" },
    { num: 3, label: "Maklumat Sasaran", sub: "Premis / Individu / Syarikat" },
    { num: 4, label: "Maklumat Kejadian", sub: "Butiran kejadian" },
    { num: 5, label: "Pengesahan", sub: "Semak dan hantar" }
  ];

  return (
    <div className="flex-1 p-6 space-y-6 overflow-y-auto h-screen bg-[#f8fafc] text-slate-800 font-sans">
      
      {/* Top Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold font-display tracking-tight text-slate-900 uppercase">e-Aduan Penguatkuasaan</h2>
          <p className="text-xs text-slate-500">Daftar kes aduan baru dengan pengelasan risiko berpandukan Enjin Pintar AI.</p>
        </div>
        <div className="text-xs font-mono bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-slate-500 font-semibold shadow-sm">
          Aduan Baru &gt; Langkah {step <= 5 ? step : "AI Analisis"} daripada 5
        </div>
      </div>

      {/* Progress Wizard Breadcrumb (Hide on Step 6 / AI View) */}
      {step <= 5 && (
        <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {stepsMeta.map((s) => (
              <div key={s.num} className="flex items-center gap-3 w-full md:w-auto">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold font-mono text-xs border transition-all duration-300 shrink-0
                  ${step === s.num 
                    ? "bg-indigo-600 border-indigo-700 text-white shadow-sm font-semibold" 
                    : step > s.num 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-600" 
                    : "bg-slate-50 border-slate-200 text-slate-400"}`}
                >
                  {step > s.num ? <Check className="w-4 h-4" /> : s.num}
                </div>
                <div className="text-left leading-tight">
                  <div className={`text-xs font-bold ${step === s.num ? "text-indigo-600" : "text-slate-600"}`}>{s.label}</div>
                  <div className="text-[9px] text-slate-400 font-semibold whitespace-nowrap">{s.sub}</div>
                </div>
                {s.num < 5 && <ChevronRight className="w-4 h-4 text-slate-300 hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Wizard Form Body */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Side: Form Content (3 Columns of Grid) */}
        <div className={`lg:col-span-3 space-y-6 ${step === 6 ? "lg:col-span-4" : ""}`}>
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative min-h-[420px] flex flex-col justify-between">
            
            {/* Step 1: Maklumat Aduan */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
                    Langkah 1: Maklumat Asas Aduan
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Sumber Aduan *</label>
                    <select name="sumber" value={formData.sumber} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all">
                      <option value="SISPAA">Sistem SISPAA</option>
                      <option value="E-mel">E-mel Rasmi</option>
                      <option value="Surat">Surat Fizikal</option>
                      <option value="Hadir (Walk-in)">Walk-In / Hadir Kaunter</option>
                      <option value="Telefon">Telefon Am</option>
                      <option value="GPS">Lokasi GPS</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Kategori Aduan *</label>
                    <select name="kategoriAduan" value={formData.kategoriAduan} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all">
                      <option value="Pekerja Asing Tanpa Permit (PATI)">Pekerja Asing Tanpa Permit (PATI)</option>
                      <option value="Penyeludupan Manusia & Sindiket">Penyeludupan Manusia &amp; Sindiket</option>
                      <option value="Tinggal Lebih Tempoh (Overstay)">Tinggal Lebih Tempoh (Overstay)</option>
                      <option value="Penyalahgunaan Pas Lawatan">Penyalahgunaan Pas Lawatan</option>
                      <option value="Lain-lain">Lain-lain Isu Imigresen</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Sub Kategori *</label>
                    <select name="subKategori" value={formData.subKategori} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all">
                      <option value="Bekerja Tanpa Permit">Bekerja Tanpa Permit / Salah Guna Pas</option>
                      <option value="Pemalsuan Dokumen">Pemalsuan Dokumen / Pasport Palsu</option>
                      <option value="Pelacuran/Sindiket">Pelacuran / Eksploitasi Seksual</option>
                      <option value="Tiada Dokumen Sah">Tiada Sebarang Dokumen Sah / Overstay</option>
                      <option value="Lain-lain">Pertanyaan Prosedur &amp; Am</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Saluran Aduan *</label>
                    <select name="saluran" value={formData.saluran} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all">
                      <option value="Sistem SISPAA">Portal SISPAA Integrated</option>
                      <option value="Kaunter Pengaduan">Kaunter Pengaduan Bahagian Penguatkuasa</option>
                      <option value="Talian Am">Talian Am JIM WP KL</option>
                      <option value="E-mel Rasmi">E-mel Penguatkuasaan</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Tarikh Aduan *</label>
                    <input type="date" name="tarikhAduan" value={formData.tarikhAduan} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Masa Aduan *</label>
                    <input type="text" name="masaAduan" value={formData.masaAduan} onChange={handleChange} placeholder="cth: 10:21 AM" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">ID Rujukan (Jika ada)</label>
                    <input type="text" name="idRujukan" value={formData.idRujukan} onChange={handleChange} placeholder="cth: REF-2025-XXXX" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">No. Aduan Lama (Jika ada)</label>
                    <input type="text" name="noAduanLama" value={formData.noAduanLama} onChange={handleChange} placeholder="No aduan rujukan terdahulu" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="bg-indigo-50 border border-indigo-100 p-3.5 rounded-2xl flex items-start gap-3 text-[11px] text-indigo-800">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-indigo-600" />
                  <span>Sila pastikan semua maklumat asas diisi dengan betul. Maklumat ini penting untuk proses agihan kes dan pemantauan statistik pengurusan aduan penguatkuasaan.</span>
                </div>
              </div>
            )}

            {/* Step 2: Maklumat Pengadu */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
                    Langkah 2: Maklumat Peribadi Pengadu
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">Nama Pengadu *</label>
                    <input type="text" name="pengaduNama" value={formData.pengaduNama} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">No. KP / No. Pasport *</label>
                    <input type="text" name="pengaduKp" value={formData.pengaduKp} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Warganegara *</label>
                    <select name="pengaduWarganegara" value={formData.pengaduWarganegara} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all">
                      <option value="Malaysia">Malaysia</option>
                      <option value="Singapura">Singapura</option>
                      <option value="Indonesia">Indonesia</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Tarikh Lahir</label>
                    <input type="date" name="pengaduLahir" value={formData.pengaduLahir} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Jantina *</label>
                    <select name="pengaduJantina" value={formData.pengaduJantina} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all">
                      <option value="Lelaki">Lelaki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Kaum</label>
                    <select name="pengaduKaum" value={formData.pengaduKaum} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all">
                      <option value="Melayu">Melayu</option>
                      <option value="Cina">Cina</option>
                      <option value="India">India</option>
                      <option value="Lain-lain">Lain-lain</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Pekerjaan</label>
                    <input type="text" name="pengaduPekerjaan" value={formData.pengaduPekerjaan} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Hubungan Dengan Aduan *</label>
                    <select name="pengaduHubungan" value={formData.pengaduHubungan} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all">
                      <option value="Orang Awam">Orang Awam / Saksi</option>
                      <option value="Mangsa">Mangsa Keadaan</option>
                      <option value="Majikan">Majikan Pembongkar</option>
                      <option value="Rakan Sekerja">Rakan Sekerja</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Alamat Surat Menyurat *</label>
                  <textarea name="pengaduAlamat" value={formData.pengaduAlamat} onChange={handleChange} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">No. Telefon Bimbit *</label>
                    <input type="text" name="pengaduTel" value={formData.pengaduTel} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">No. Telefon Rumah</label>
                    <input type="text" name="pengaduTelRumah" value={formData.pengaduTelRumah} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">E-mel</label>
                    <input type="email" name="pengaduEmail" value={formData.pengaduEmail} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>
                </div>

                {/* Simulated file uploader */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Lampiran Sokongan (Bukti Gambar, Dokumen, Video)</label>
                    <button 
                      type="button" 
                      onClick={handleSimulateAddFile}
                      className="text-[10px] bg-slate-100 hover:bg-slate-200 text-indigo-600 font-bold px-2.5 py-1 rounded-xl border border-slate-200 cursor-pointer shadow-sm"
                    >
                      + Tambah Fail Simulasi
                    </button>
                  </div>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center bg-slate-50 text-center hover:bg-slate-100/50 hover:border-slate-300 transition-colors cursor-pointer">
                    <UploadCloud className="w-8 h-8 text-slate-400 mb-2" />
                    <span className="text-xs font-bold text-slate-700">Seret dan lepas fail di sini atau klik untuk muat naik</span>
                    <span className="text-[10px] text-slate-400 mt-1">Jenis fail dibenarkan: JPG, PNG, PDF, MP4, DOC (Maks: 10MB)</span>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-2">
                      {uploadedFiles.map((f, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-2 shadow-sm text-xs">
                          <div className="truncate min-w-0">
                            <div className="font-bold text-slate-700 truncate" title={f.name}>{f.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{f.size}</div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => handleDeleteFile(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Maklumat Sasaran */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
                    Langkah 3: Maklumat Sasaran (Lokasi / Premis / Syarikat)
                  </h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Jenis Sasaran *</label>
                  <div className="flex gap-4">
                    {["Premis / Tempat", "Individu", "Syarikat", "Lain-lain"].map((t) => (
                      <label key={t} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                        <input type="radio" name="sasaranJenis" value={t} checked={formData.sasaranJenis === t} onChange={handleChange} className="accent-indigo-600 w-4 h-4" />
                        <span>{t}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Nama Sasaran (Premis / Individu / Syarikat) *</label>
                    <input type="text" name="sasaranNama" value={formData.sasaranNama} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">No. Pendaftaran Syarikat (SSM)</label>
                    <input type="text" name="sasaranSSM" value={formData.sasaranSSM} onChange={handleChange} placeholder="Jika jenis sasaran syarikat / premis berdaftar" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Alamat Penuh Sasaran *</label>
                  <textarea name="sasaranAlamat" value={formData.sasaranAlamat} onChange={handleChange} rows={2} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all resize-none" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Negeri *</label>
                    <select name="sasaranNegeri" value={formData.sasaranNegeri} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all">
                      <option value="Selangor">Selangor</option>
                      <option value="W.P. Kuala Lumpur">W.P. Kuala Lumpur</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Daerah *</label>
                    <select name="sasaranDaerah" value={formData.sasaranDaerah} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all">
                      <option value="Petaling">Petaling</option>
                      <option value="Kuala Lumpur">Kuala Lumpur</option>
                      <option value="Sentul">Sentul</option>
                      <option value="Cheras">Cheras</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Mukim / Bandar *</label>
                    <input type="text" name="sasaranMukim" value={formData.sasaranMukim} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Poskod *</label>
                    <input type="text" name="sasaranPoskod" value={formData.sasaranPoskod} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>
                </div>

                {/* Mini interactive map coordinates entry */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-3">
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-700">Koordinat Peta (Geolokasi)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Latitude (Lat)</span>
                        <input type="text" name="sasaranLat" value={formData.sasaranLat} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono text-slate-850 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Longitude (Lng)</span>
                        <input type="text" name="sasaranLng" value={formData.sasaranLng} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-mono text-slate-850 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Penerangan Lokasi Tambahan</span>
                      <input type="text" name="sasaranPenerangan" value={formData.sasaranPenerangan} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                    </div>
                    <label className="flex items-center gap-2 text-xs text-slate-500 cursor-pointer pt-1 font-medium">
                      <input type="checkbox" name="sasaranTandaPeta" checked={formData.sasaranTandaPeta} onChange={handleChange} className="accent-indigo-600 w-4 h-4" />
                      <span>Tandakan lokasi sasaran di dalam Peta Penguatkuasaan</span>
                    </label>
                  </div>

                  {/* Simulated map graphic */}
                  <div className="bg-slate-100 border border-slate-200 rounded-2xl p-2 flex flex-col justify-between h-40 relative overflow-hidden shadow-inner">
                    <div className="absolute inset-0 opacity-15 flex flex-col justify-between">
                      <div className="h-full border-r border-dashed border-slate-400 ml-[50%]"></div>
                      <div className="w-full border-b border-dashed border-slate-400 mt-[50%] -ml-60"></div>
                    </div>
                    {/* Simulated marker */}
                    <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                      <MapPin className="w-6 h-6 text-rose-500 fill-rose-500/20 animate-bounce" />
                      <div className="bg-white border border-slate-200 text-[8px] px-1.5 py-0.5 rounded-lg shadow text-slate-700 font-bold font-mono mt-1 whitespace-nowrap">
                        Puchong: {formData.sasaranLat}, {formData.sasaranLng}
                      </div>
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono font-bold uppercase z-10">Peta Satelit Sempadan</div>
                    <span className="text-[8px] text-slate-400 text-right font-mono font-bold z-10">Klik untuk reset koordinat</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Maklumat Kejadian */}
            {step === 4 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
                    Langkah 4: Butiran Kejadian Kesalahan Imigresen
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Tarikh Kejadian *</label>
                    <input type="date" name="kejadianTarikh" value={formData.kejadianTarikh} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Masa Kejadian *</label>
                    <input type="text" name="kejadianMasa" value={formData.kejadianMasa} onChange={handleChange} placeholder="cth: 02:30 PM" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Kekerapan Kejadian *</label>
                    <select name="kejadianKekerapan" value={formData.kejadianKekerapan} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all">
                      <option value="Sekali sahaja">Sekali Sahaja</option>
                      <option value="Berulang">Berulang (Berulangkali)</option>
                      <option value="Berterusan">Berterusan / Kekal</option>
                      <option value="Setiap Hari">Setiap Hari Kerja</option>
                      <option value="Setiap Minggu">Hujung Minggu Sahaja</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold text-slate-500">Jenis Kesalahan Yang Disyaki *</label>
                    <select name="kejadianKesalahan" value={formData.kejadianKesalahan} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all">
                      <option value="Pekerja Asing Tanpa Permit">Pekerja Asing Tanpa Permit (PATI bekerja secara haram)</option>
                      <option value="Tinggal Lebih Tempoh">Tinggal Lebih Tempoh (Overstay pas tamat tempoh)</option>
                      <option value="Sindiket Penyeludupan">Sindiket Penyeludupan / Ejen Pemalsuan Pasport</option>
                      <option value="Melindungi PATI">Melindungi PATI / Pemilik Premis Melindungi Warga Asing</option>
                      <option value="Lain-lain">Lain-lain kesalahan di bawah Akta Imigresen</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Anggaran Bilangan Terlibat *</label>
                    <select name="kejadianBilangan" value={formData.kejadianBilangan} onChange={handleChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all">
                      <option value="1 - 5 orang">1 - 5 orang</option>
                      <option value="6 - 10 orang">6 - 10 orang</option>
                      <option value="11 - 20 orang">11 - 20 orang</option>
                      <option value="25 - 50 orang">25 - 50 orang</option>
                      <option value="Lebih 50 orang">Lebih daripada 50 orang</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Warganegara Terlibat (Anggaran) *</label>
                    <input type="text" name="kejadianWarganegara" value={formData.kejadianWarganegara} onChange={handleChange} placeholder="cth: Bangladesh, Indonesia, Myanmar" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500">Tempat Kejadian Khusus (jika ada)</label>
                    <input type="text" name="kejadianTempat" value={formData.kejadianTempat} onChange={handleChange} placeholder="Jika berbeza dari alamat sasaran" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Huraian Butiran Kejadian * (PENTING: Penerangan terperinci untuk analisis AI)</label>
                  <textarea 
                    name="kejadianButiran" 
                    value={formData.kejadianButiran} 
                    onChange={handleChange} 
                    rows={4} 
                    placeholder="Sila tulis secara terperinci mengenai kesalahan yang berlaku. AI akan menganalisis teks ini untuk menentukan tahap risiko (High Profile, Medium, Low) dan menjana cadangan tindakan operasi penguatkuasaan."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all font-sans" 
                  />
                  <div className="text-[10px] text-slate-400 font-semibold">
                    Tips: Sebutkan jika ada elemen "sindiket", "dokumen palsu", "kemasukan haram", "beroperasi berkumpulan" untuk ketepatan analisis model.
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Pengesahan & Hantar */}
            {step === 5 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-base text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
                    Langkah 5: Semakan &amp; Pengesahan Hantar Aduan
                  </h3>
                </div>

                <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl space-y-4 text-xs text-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block font-mono">Ringkasan Aduan Sebelum Penghantaran</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500 font-semibold">Sumber Aduan:</span>
                      <span className="font-bold text-slate-800">{formData.sumber}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500 font-semibold">Kategori Aduan:</span>
                      <span className="font-bold text-slate-800">{formData.kategoriAduan}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500 font-semibold">Nama Pengadu:</span>
                      <span className="font-bold text-slate-800">{formData.pengaduNama}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500 font-semibold">No. KP / Passport:</span>
                      <span className="font-bold text-slate-800 font-mono">{formData.pengaduKp}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500 font-semibold">Sasaran Premis:</span>
                      <span className="font-bold text-slate-800">{formData.sasaranNama}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500 font-semibold">Lokasi / Alamat:</span>
                      <span className="font-bold text-slate-800 truncate max-w-[200px]" title={formData.sasaranAlamat}>{formData.sasaranAlamat}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500 font-semibold">Kesalahan Disyaki:</span>
                      <span className="font-bold text-slate-800">{formData.kejadianKesalahan}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-200 pb-1.5">
                      <span className="text-slate-500 font-semibold">Bilangan Anggaran:</span>
                      <span className="font-bold text-slate-800">{formData.kejadianBilangan}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white border border-slate-200 rounded-xl">
                    <span className="text-[10px] text-slate-400 uppercase font-bold font-mono block mb-1">Butiran Kejadian</span>
                    <p className="text-[11px] text-slate-700 line-clamp-3 italic">"{formData.kejadianButiran}"</p>
                  </div>
                </div>

                <div className="border border-amber-200 bg-amber-50 p-4 rounded-2xl space-y-3">
                  <div className="flex items-start gap-2.5 text-amber-700">
                    <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold uppercase">Perhatian &amp; Tanggungan Akta</h4>
                      <p className="text-[11px] text-amber-900 mt-1 leading-normal font-medium">
                        Sila pastikan maklumat yang diberikan adalah benar dan lengkap. Aduan palsu adalah menjadi kesalahan di bawah Akta Imigresen 1959/63 atau undang-undang berkaitan di bawah perundangan Malaysia.
                      </p>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer pt-1">
                    <input type="checkbox" name="sayaSetuju" checked={formData.sayaSetuju} onChange={handleChange} className="accent-indigo-600 w-4 h-4 mt-0.5 shrink-0" />
                    <span className="leading-tight font-bold text-slate-700">Saya bersetuju dan mengaku bahawa maklumat yang diberikan di atas adalah benar dan lengkap bagi siasatan pihak Jabatan Imigresen Malaysia.</span>
                  </label>
                </div>
              </div>
            )}

            {/* Step 6: AI Response & Results Screen */}
            {step === 6 && aiResult && (
              <div className="space-y-6 animate-fade-in py-2">
                <div className="text-center space-y-2 border-b border-slate-100 pb-5">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 mb-2 shadow-sm">
                    <Check className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-base font-extrabold text-slate-950 uppercase tracking-wider">Aduan Berjaya Dihantar!</h3>
                  <p className="text-xs text-slate-600 max-w-md mx-auto font-medium">No Rujukan Aduan anda: <span className="font-mono text-indigo-600 font-extrabold">{aiResult.rujukan}</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* AI Classification Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-bl-full" />
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">1. Pengkelasan Kategori AI</h4>
                    </div>

                    <div className="space-y-3.5 pt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-semibold">Kategori Risiko:</span>
                        <span className={`text-[11px] font-extrabold uppercase font-mono px-2 py-0.5 rounded-lg border
                          ${aiResult.kategori === "High Profile" 
                            ? "bg-red-50 text-red-700 border-red-200" 
                            : aiResult.kategori === "Medium" 
                            ? "bg-orange-50 text-orange-700 border-orange-200" 
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}
                        >
                          {aiResult.kategori}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Justifikasi Klasifikasi</span>
                        <p className="text-xs text-slate-600 leading-normal bg-white p-2.5 rounded-2xl border border-slate-200 italic">
                          "{aiResult.justifikasiAI}"
                        </p>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Kriteria Dikesan</span>
                        <div className="space-y-1.5">
                          {aiResult.kriteriaAI && aiResult.kriteriaAI.map((kri, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>{kri}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendation Card */}
                  {aiResult.cadanganOperasiAI && (
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/5 rounded-bl-full" />
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">2. Cadangan Operasi AI</h4>
                      </div>

                      <div className="space-y-3 pt-1">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-xs text-slate-500 font-semibold">Operasi Cadangan:</span>
                          <span className="text-xs font-bold text-slate-800">{aiResult.cadanganOperasiAI.tajuk}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-xs text-slate-500 font-semibold">Tahap Prioriti:</span>
                          <span className={`text-[10px] font-bold uppercase font-mono px-1.5 py-0.2 rounded border
                            ${aiResult.cadanganOperasiAI.prioriti === "Tinggi" 
                              ? "bg-red-50 text-red-750 border-red-200" 
                              : aiResult.cadanganOperasiAI.prioriti === "Sederhana" 
                              ? "bg-orange-50 text-orange-750 border-orange-200" 
                              : "bg-emerald-50 text-emerald-750 border-emerald-200"}`}
                          >
                            {aiResult.cadanganOperasiAI.prioriti}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-xs text-slate-500 font-semibold">Lokasi Tindakan:</span>
                          <span className="text-xs font-extrabold text-indigo-600 font-mono flex items-center gap-0.5">
                            <MapPin className="w-3.5 h-3.5" /> {aiResult.cadanganOperasiAI.lokasi}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <span className="text-xs text-slate-500 font-semibold">Anggaran Impak:</span>
                          <span className="text-xs font-bold text-emerald-600 font-mono">{aiResult.cadanganOperasiAI.impak}</span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 uppercase font-bold font-mono">Tindakan Khusus Diperlukan</span>
                          <p className="text-xs text-slate-600 leading-normal bg-white p-2.5 rounded-2xl border border-slate-200">
                            {aiResult.cadanganOperasiAI.tindakan}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-200 justify-center">
                  <button 
                    onClick={onSuccess}
                    className="w-full sm:w-auto bg-slate-50 border border-slate-200 hover:bg-slate-100 text-xs font-bold px-6 py-2.5 rounded-xl text-slate-755 transition-colors cursor-pointer shadow-sm"
                  >
                    Pergi ke Senarai Aduan
                  </button>
                  <button 
                    onClick={() => {
                      setStep(1);
                      setAiResult(null);
                    }}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-xs font-bold px-6 py-2.5 rounded-xl text-white transition-colors cursor-pointer shadow-sm"
                  >
                    Daftar Aduan Baru Seterusnya
                  </button>
                </div>
              </div>
            )}

            {/* Bottom Buttons Row (Steps 1 to 5) */}
            {step <= 5 && (
              <div className="flex items-center justify-between border-t border-slate-200 pt-5 mt-6">
                <button 
                  type="button" 
                  onClick={handleBack}
                  disabled={step === 1 || isSubmitting}
                  className="flex items-center gap-1 bg-slate-50 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-600 px-4 py-2 rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="w-4 h-4" /> Kembali
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-400 font-mono font-bold">Langkah {step} / 5</span>
                </div>

                {step === 5 ? (
                  <button 
                    type="button" 
                    onClick={handleFormSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-xs font-bold text-white px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        Sedang Menganalisis...
                      </>
                    ) : (
                      <>
                        Hantar Aduan <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button 
                    type="button" 
                    onClick={handleNext}
                    className="flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-xs font-bold text-indigo-600 px-5 py-2.5 rounded-xl border border-indigo-200 transition-colors cursor-pointer shadow-sm"
                  >
                    Seterusnya <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Right Side: Quick Info / Tips Column (1 Column of Grid) - Hide on Step 6 */}
        {step <= 5 && (
          <div className="space-y-4">
            
            {/* Live Data Summary of Wizard */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3.5">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-indigo-600 rounded-sm"></span>
                  Ringkasan Aduan
                </h4>
              </div>
              <div className="space-y-2 text-[10px] text-slate-500 font-mono">
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span>No. Rujukan:</span>
                  <span className="text-slate-800 text-right font-bold">IM.101/W-ES/...</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span>Tarikh Aduan:</span>
                  <span className="text-slate-700 text-right font-bold">{formData.tarikhAduan || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span>Sumber Aduan:</span>
                  <span className="text-slate-700 text-right font-bold">{formData.sumber || "-"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-1">
                  <span>Kategori Aduan:</span>
                  <span className="text-slate-700 text-right font-bold truncate max-w-[120px]" title={formData.kategoriAduan}>{formData.kategoriAduan || "-"}</span>
                </div>
                {step >= 2 && (
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span>Nama Pengadu:</span>
                    <span className="text-slate-700 text-right font-bold truncate max-w-[120px]">{formData.pengaduNama || "-"}</span>
                  </div>
                )}
                {step >= 3 && (
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span>Nama Sasaran:</span>
                    <span className="text-slate-700 text-right font-bold truncate max-w-[120px]">{formData.sasaranNama || "-"}</span>
                  </div>
                )}
                {step >= 4 && (
                  <div className="flex justify-between border-b border-slate-50 pb-1">
                    <span>Kesalahan:</span>
                    <span className="text-slate-700 text-right font-bold truncate max-w-[120px]">{formData.kejadianKesalahan || "-"}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Step-specific Tips card */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-amber-500 rounded-sm"></span>
                  Tips &amp; Panduan
                </h4>
              </div>
              <ul className="space-y-2 text-[11px] text-slate-600 list-disc list-inside font-medium leading-relaxed">
                {step === 1 && (
                  <>
                    <li>Pilih sumber yang betul untuk klasifikasi rekod.</li>
                    <li>Sub kategori membantu menyusun sistem penugasan pegawai operasi imigresen.</li>
                  </>
                )}
                {step === 2 && (
                  <>
                    <li>Maklumat peribadi pengadu dilindungi di bawah Akta Perlindungan Pemberi Maklumat 2010 (Akta 711).</li>
                    <li>Muat naik bukti lampiran menyokong pengesahan awal.</li>
                  </>
                )}
                {step === 3 && (
                  <>
                    <li>Berikan alamat premis setepatnya.</li>
                    <li>Gunakan koordinat GPS (Lat/Lng) untuk memudahkan peta hotspot merangka zon tangkapan.</li>
                  </>
                )}
                {step === 4 && (
                  <>
                    <li>Penerangan butiran kesalahan yang lengkap membantu Enjin AI melabel isu ini secara automatik.</li>
                    <li>Nyatakan anggaran bilangan pekerja asing terbabit.</li>
                  </>
                )}
                {step === 5 && (
                  <>
                    <li>Sila semak semula semua maklumat sebelum klik Hantar.</li>
                    <li>AI akan menganalisis aduan ini dalam tempoh 1-3 saat sejurus butang hantar diklik.</li>
                  </>
                )}
              </ul>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
