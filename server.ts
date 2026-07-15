import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API client initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Gemini API:", error);
  }
} else {
  console.log("No GEMINI_API_KEY environment variable found. Falling back to simulated AI mode.");
}

// Robust content generation helper with retries and model fallback
async function generateContentWithRetry(
  prompt: string,
  config: any = { responseMimeType: "application/json" },
  maxRetries = 2
): Promise<string | null> {
  if (!ai) return null;

  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];
  
  for (const model of modelsToTry) {
    let delay = 1000;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Calling Gemini with model ${model} (Attempt ${attempt}/${maxRetries})...`);
        const response = await ai.models.generateContent({
          model: model,
          contents: prompt,
          config: config,
        });
        
        const text = response.text?.trim();
        if (text) {
          return text;
        }
      } catch (err: any) {
        console.warn(`Attempt ${attempt} with model ${model} failed: ${err.message || err}`);
        if (attempt < maxRetries) {
          const jitter = Math.random() * 200;
          await new Promise((resolve) => setTimeout(resolve, delay + jitter));
          delay *= 2;
        }
      }
    }
  }
  
  return null;
}

// In-memory data store for our session
interface Complaint {
  id: string;
  rujukan: string;
  sumber: string;
  kategori: "High Profile" | "Medium" | "Low";
  subKategori: string;
  tarikhAduan: string;
  masaAduan: string;
  saluran: string;
  pengadu: {
    nama: string;
    kpPasport: string;
    warganegara: string;
    telefon: string;
    email: string;
  };
  sasaran: {
    jenis: string;
    nama: string;
    ssm?: string;
    alamat: string;
    negeri: string;
    daerah: string;
    mukim: string;
    poskod: string;
    lat: number;
    lng: number;
  };
  kejadian: {
    tarikh: string;
    masa: string;
    kekerapan: string;
    tempat: string;
    kesalahan: string;
    bilangan: string;
    warganegara: string;
    butiran: string;
  };
  status: "Diterima" | "Dalam Proses" | "Selesai";
  justifikasiAI?: string;
  kriteriaAI?: string[];
  cadanganOperasiAI?: {
    tajuk: string;
    prioriti: "Tinggi" | "Sederhana" | "Rendah";
    lokasi: string;
    impak: string;
    tindakan: string;
  };
}

interface OperationRecommendation {
  id: string;
  tajuk: string;
  prioriti: "Tinggi" | "Sederhana" | "Rendah";
  lokasi: string;
  impak: string;
  tindakan: string;
  status: "Menunggu" | "Disahkan" | "Ditolak";
}

// Initial pre-populated data
let complaints: Complaint[] = [
  {
    id: "1",
    rujukan: "IM.101/W-ES/5/1/1/26/493",
    sumber: "SISPAA",
    kategori: "High Profile",
    subKategori: "Penyeludupan Manusia & Sindiket",
    tarikhAduan: "2025-06-18",
    masaAduan: "10:21 AM",
    saluran: "Sistem SISPAA",
    pengadu: {
      nama: "Ahmad Bin Hassan",
      kpPasport: "801010-10-1234",
      warganegara: "Malaysia",
      telefon: "012-334 6789",
      email: "ahmad.hassan@email.com",
    },
    sasaran: {
      jenis: "Premis / Tempat",
      nama: "ABC Construction Sdn Bhd",
      ssm: "202001012345 (1357923-M)",
      alamat: "Lot 12, Jalan Industri 4/7, Taman Perindustrian, 47180 Puchong, Selangor",
      negeri: "Selangor",
      daerah: "Petaling",
      mukim: "Puchong",
      poskod: "47180",
      lat: 3.0331,
      lng: 101.5984,
    },
    kejadian: {
      tarikh: "2025-06-17",
      masa: "02:30 PM",
      kekerapan: "Berulang",
      tempat: "Tapak pembinaan berdekatan dengan Jalan Industri 4/7, Taman Perindustrian Puchong.",
      kesalahan: "Pekerja Asing Tanpa Permit",
      bilangan: "25 - 50 orang",
      warganegara: "Bangladesh, Indonesia",
      butiran: "Terdapat sekumpulan pekerja asing dipercayai bekerja di tapak pembinaan tanpa permit yang sah. Mereka bekerja pada waktu siang dan kadang-kadang sehingga lewat petang. Tiada pengawasan daripada pihak berkuasa.",
    },
    status: "Dalam Proses",
    justifikasiAI: "Melibatkan sindiket pembekalan PATI secara besar-besaran untuk projek pembinaan komersial serta penggunaan dokumen palsu.",
    kriteriaAI: ["Melibatkan sindiket / penyeludupan PATI", "Ancaman keselamatan negara", "Bilangan sasaran melebihi 20 orang"],
    cadanganOperasiAI: {
      tajuk: "Ops Kehadiran & Pemeriksaan",
      prioriti: "Tinggi",
      lokasi: "KL Sentral",
      impak: "+25% Pengurangan aduan",
      tindakan: "Tingkatkan kehadiran beruniform dan melakukan pemeriksaan dokumen secara mengejut di laluan masuk utama.",
    }
  },
  {
    id: "2",
    rujukan: "IM.101/W-ES/5/1/1/26/494",
    sumber: "E-mel",
    kategori: "Medium",
    subKategori: "Pekerja Asing Tanpa Permit (PATI)",
    tarikhAduan: "2025-06-17",
    masaAduan: "09:15 AM",
    saluran: "E-mel Rasmi",
    pengadu: {
      nama: "Siti Rahmah binti Ali",
      kpPasport: "850512-14-5432",
      warganegara: "Malaysia",
      telefon: "017-654 3210",
      email: "siti.rahmah@email.com",
    },
    sasaran: {
      jenis: "Premis / Tempat",
      nama: "Restoran Selera Kampung",
      ssm: "202103445522",
      alamat: "No 45, Jalan Pudu, Wilayah Persekutuan Kuala Lumpur",
      negeri: "W.P. Kuala Lumpur",
      daerah: "Cheras",
      mukim: "Kuala Lumpur",
      poskod: "55100",
      lat: 3.1412,
      lng: 101.7123,
    },
    kejadian: {
      tarikh: "2025-06-16",
      masa: "08:00 PM",
      kekerapan: "Setiap Hari",
      tempat: "Bahagian dapur dan pelayan restoran Selera Kampung",
      kesalahan: "Pekerja Asing Tanpa Permit",
      bilangan: "5 - 10 orang",
      warganegara: "Myanmar, India",
      butiran: "Hampir keseluruhan pelayan dan tukang masak di dapur restoran ini adalah warga asing yang dipercayai tidak mempunyai permit kerja yang sah. Kebanyakan mereka bertutur dalam bahasa asing dan kelihatan takut apabila ada pelanggan beruniform.",
    },
    status: "Dalam Proses",
    justifikasiAI: "PATI bekerja secara terbuka di premis makanan tumpuan ramai tanpa permit yang sah, disyaki melanggar syarat pas lawatan sosial.",
    kriteriaAI: ["PATI bekerja tanpa dokumen sah", "Aktiviti mencurigakan di premis perniagaan"],
    cadanganOperasiAI: {
      tajuk: "Ops Tapisan & Sekatan Jalan Raya",
      prioriti: "Tinggi",
      lokasi: "Pudu",
      impak: "+20% Pengurangan aduan",
      tindakan: "Laksanakan pemeriksaan menyeluruh ke atas semua premis perniagaan makanan di sepanjang Jalan Pudu.",
    }
  },
  {
    id: "3",
    rujukan: "IM.101/W-ES/5/1/1/26/495",
    sumber: "Surat",
    kategori: "Medium",
    subKategori: "Tinggal Lebih Tempoh (Overstay)",
    tarikhAduan: "2025-06-16",
    masaAduan: "02:00 PM",
    saluran: "Surat Fizikal",
    pengadu: {
      nama: "Tan Kah Heng",
      kpPasport: "721130-14-6111",
      warganegara: "Malaysia",
      telefon: "013-445 1122",
      email: "tan.kh@email.com",
    },
    sasaran: {
      jenis: "Individu",
      nama: "Pangsapuri Seri Perak (Rumah Sewa)",
      alamat: "Blok B, Aras 4, Pangsapuri Seri Perak, Sentul",
      negeri: "W.P. Kuala Lumpur",
      daerah: "Sentul",
      mukim: "Batu",
      poskod: "51000",
      lat: 3.1824,
      lng: 101.6925,
    },
    kejadian: {
      tarikh: "2025-06-15",
      masa: "11:00 PM",
      kekerapan: "Berterusan",
      tempat: "Kawasan kejiranan Blok B Pangsapuri Seri Perak",
      kesalahan: "Tinggal Lebih Tempoh",
      bilangan: "11 - 20 orang",
      warganegara: "Bangladesh, Nepal",
      butiran: "Sebuah unit pangsapuri disewa oleh sekumpulan warga asing yang sangat padat. Kebanyakan mereka disyaki telah tamat tempoh pas lawatan dan ada yang bekerja sebagai buruh kasar di sekitar Sentul tanpa dokumen pasport.",
    },
    status: "Selesai",
    justifikasiAI: "Aduan disokong oleh laporan komuniti mengenai kepadatan penduduk yang melampau di rumah flat kos rendah serta aduan gangguan ketenteraman.",
    kriteriaAI: ["Tinggal melebihi tempoh dibenarkan", "Kepadatan kediaman luar biasa"],
    cadanganOperasiAI: {
      tajuk: "Ops Saringan Premis Perniagaan",
      prioriti: "Sederhana",
      lokasi: "Chow Kit",
      impak: "+18% Pengurangan aduan",
      tindakan: "Pemeriksaan kediaman bersepadu (Ops Sapu) di kawasan perumahan Sentul dengan kerjasama pihak pengurusan flat.",
    }
  },
  {
    id: "4",
    rujukan: "IM.101/W-ES/5/1/1/26/496",
    sumber: "Hadir (Walk-in)",
    kategori: "Low",
    subKategori: "Pertanyaan Prosedur & Maklum Balas",
    tarikhAduan: "2025-06-15",
    masaAduan: "11:30 AM",
    saluran: "Kaunter Pengaduan",
    pengadu: {
      nama: "Johnathan Smith",
      kpPasport: "542311542 (Passport UK)",
      warganegara: "United Kingdom",
      telefon: "011-998 8776",
      email: "j.smith@example.com",
    },
    sasaran: {
      jenis: "Individu",
      nama: "Johnathan Smith",
      alamat: "The Red Residences, KLCC, Kuala Lumpur",
      negeri: "W.P. Kuala Lumpur",
      daerah: "Kuala Lumpur",
      mukim: "Kuala Lumpur",
      poskod: "50450",
      lat: 3.1593,
      lng: 101.7138,
    },
    kejadian: {
      tarikh: "2025-06-15",
      masa: "11:15 AM",
      kekerapan: "Sekali sahaja",
      tempat: "Kaunter Jabatan Imigresen",
      kesalahan: "Tiada Kesalahan (Pertanyaan)",
      bilangan: "1 orang",
      warganegara: "United Kingdom",
      butiran: "Hadir ke kaunter untuk membuat aduan/pertanyaan mengenai kelewatan sistem kemaskini pas MM2H (Malaysia My Second Home) serta kelayakan permohonan pembantu rumah asing secara sah.",
    },
    status: "Selesai",
    justifikasiAI: "Isu pentadbiran am, tiada kesalahan jenayah imigresen dikesan. Boleh diselesaikan melalui penerangan prosedur.",
    kriteriaAI: ["Pertanyaan prosedur", "Maklumat am tentang imigresen"],
    cadanganOperasiAI: {
      tajuk: "Ops Kesedaran & Hebahan Komuniti",
      prioriti: "Sederhana",
      lokasi: "Bukit Bintang",
      impak: "+15% Pengurangan aduan",
      tindakan: "Penyelesaian khidmat pelanggan kaunter bersepadu dan edaran risalah MM2H.",
    }
  }
];

let recommendations: OperationRecommendation[] = [
  {
    id: "rec_1",
    tajuk: "Ops Kehadiran & Pemeriksaan",
    prioriti: "Tinggi",
    lokasi: "KL Sentral",
    impak: "+25% Pengurangan aduan",
    tindakan: "Tingkatkan kehadiran beruniform dan pemeriksaan dokumen di kawasan tumpuan di KL Sentral antara jam 9:00 AM - 1:00 PM.",
    status: "Disahkan"
  },
  {
    id: "rec_2",
    tajuk: "Ops Tapisan & Sekatan Jalan Raya",
    prioriti: "Tinggi",
    lokasi: "Pudu",
    impak: "+20% Pengurangan aduan",
    tindakan: "Laksanakan sekatan jalan raya secara berkala pada waktu puncak petang di laluan keluar-masuk Jalan Pudu untuk memeriksa pengangkutan pekerja asing.",
    status: "Disahkan"
  },
  {
    id: "rec_3",
    tajuk: "Ops Saringan Premis Perniagaan",
    prioriti: "Sederhana",
    lokasi: "Chow Kit",
    impak: "+18% Pengurangan aduan",
    tindakan: "Saringan ke atas premis perniagaan borong dan runcit yang berisiko menggajikan PATI di sekitar pasar Chow Kit.",
    status: "Menunggu"
  },
  {
    id: "rec_4",
    tajuk: "Ops Kesedaran & Hebahan Komuniti",
    prioriti: "Sederhana",
    lokasi: "Bukit Bintang",
    impak: "+15% Pengurangan aduan",
    tindakan: "Tingkatkan hebahan kepada komuniti dan pemilik premis perniagaan mengenai kesalahan melindungi PATI (Akta Imigresen 1959/63).",
    status: "Menunggu"
  },
  {
    id: "rec_5",
    tajuk: "Ops Rondaan Berfokus",
    prioriti: "Rendah",
    lokasi: "Brickfields",
    impak: "+10% Pengurangan aduan",
    tindakan: "Rondaan berfokus di lokasi penginapan pekerja asing berhampiran tapak pembinaan Brickfields semasa cuti hujung minggu.",
    status: "Menunggu"
  }
];

// Helper to generate smart simulated classification fallback
function simulateAIClassification(complaint: any) {
  const butiran = (complaint.kejadian.butiran || "").toLowerCase();
  const kesalahan = (complaint.kejadian.kesalahan || "").toLowerCase();
  const warganegara = (complaint.kejadian.warganegara || "").toLowerCase();
  const bilangan = complaint.kejadian.bilangan || "";
  
  let kategori: "High Profile" | "Medium" | "Low" = "Medium";
  let kriteria: string[] = [];
  let tajuk = "Ops Saringan Premis";
  let prioriti: "Tinggi" | "Sederhana" | "Rendah" = "Sederhana";
  let impak = "+15% Pengurangan aduan";
  let tindakan = "Melakukan pemeriksaan berjadual.";

  // High profile conditions
  if (
    butiran.includes("sindiket") || 
    butiran.includes("palsu") || 
    butiran.includes("penyeludup") || 
    kesalahan.includes("sindiket") ||
    bilangan.includes("25") || 
    bilangan.includes("50") ||
    bilangan.includes("lebih")
  ) {
    kategori = "High Profile";
    kriteria = ["Melibatkan sindiket / penyeludupan PATI", "Ancaman keselamatan negara", "Bilangan sasaran yang tinggi"];
    tajuk = "Ops Tapis Bersepadu";
    prioriti = "Tinggi";
    impak = "+28% Pengurangan aduan";
    tindakan = "Melakukan operasi serbuan taktikal pada waktu malam berpandukan risikan berfokus.";
  } else if (butiran.includes("tanya") || butiran.includes("prosedur") || kesalahan.includes("tiada") || butiran.includes("mm2h")) {
    kategori = "Low";
    kriteria = ["Pertanyaan prosedur am", "Isu pentadbiran / tiada kesalahan"];
    tajuk = "Ops Mesra Kaunter";
    prioriti = "Rendah";
    impak = "+8% Pengurangan aduan";
    tindakan = "Mengadakan kaunter penasihatan bergerak di kawasan tumpuan awam.";
  } else {
    kategori = "Medium";
    kriteria = ["PATI bekerja tanpa permit sah", "Tinggal melebihi tempoh dibenarkan"];
    tajuk = "Ops Sapu Premis";
    prioriti = "Sederhana";
    impak = "+18% Pengurangan aduan";
    tindakan = "Melakukan pemeriksaan dokumen menyeluruh ke atas semua pekerja asing di premis sasaran.";
  }

  const location = complaint.sasaran.daerah || complaint.sasaran.mukim || "KL";

  return {
    kategori,
    justifikasi: `Analisis AI menunjukkan kes ini berkategori ${kategori} kerana aduan menyebut tentang kesalahan "${complaint.kejadian.kesalahan}" yang melibatkan warga ${complaint.kejadian.warganegara} di kawasan ${location}.`,
    kriteria,
    cadanganOperasiAI: {
      tajuk,
      prioriti,
      lokasi: location,
      impak,
      tindakan
    }
  };
}

// REST APIs
// 1. Get all complaints
app.get("/api/aduan", (req, res) => {
  res.json(complaints);
});

// 2. Submit a new complaint with AI Analysis
app.post("/api/aduan", async (req, res) => {
  const data = req.body;
  const id = (complaints.length + 1).toString();
  const rujukan = `IM.101/W-ES/5/1/1/26/${490 + complaints.length + 1}`;
  
  const newComplaint: Complaint = {
    id,
    rujukan,
    sumber: data.sumber || "SISPAA",
    kategori: "Medium", // Will be overwritten by AI
    subKategori: data.subKategori || "PATI",
    tarikhAduan: data.tarikhAduan || new Date().toISOString().split("T")[0],
    masaAduan: data.masaAduan || "12:00 PM",
    saluran: data.saluran || "Sistem e-Aduan",
    pengadu: {
      nama: data.pengadu?.nama || "Tanpa Nama",
      kpPasport: data.pengadu?.kpPasport || "-",
      warganegara: data.pengadu?.warganegara || "Malaysia",
      telefon: data.pengadu?.telefon || "-",
      email: data.pengadu?.email || "-",
    },
    sasaran: {
      jenis: data.sasaran?.jenis || "Premis / Tempat",
      nama: data.sasaran?.nama || "Sasaran Tidak Dinamakan",
      ssm: data.sasaran?.ssm || "",
      alamat: data.sasaran?.alamat || "Kuala Lumpur",
      negeri: data.sasaran?.negeri || "W.P. Kuala Lumpur",
      daerah: data.sasaran?.daerah || "Kuala Lumpur",
      mukim: data.sasaran?.mukim || "Kuala Lumpur",
      poskod: data.sasaran?.poskod || "",
      lat: parseFloat(data.sasaran?.lat) || 3.1412,
      lng: parseFloat(data.sasaran?.lng) || 101.6925,
    },
    kejadian: {
      tarikh: data.kejadian?.tarikh || new Date().toISOString().split("T")[0],
      masa: data.kejadian?.masa || "12:00 PM",
      kekerapan: data.kejadian?.kekerapan || "Sekali sahaja",
      tempat: data.kejadian?.tempat || "Kuala Lumpur",
      kesalahan: data.kejadian?.kesalahan || "Bekerja Tanpa Permit",
      bilangan: data.kejadian?.bilangan || "1 - 5 orang",
      warganegara: data.kejadian?.warganegara || "Lain-lain",
      butiran: data.kejadian?.butiran || "Tiada butiran tambahan disediakan.",
    },
    status: "Diterima",
  };

  // Attempt Gemini AI Analysis
  if (ai) {
    try {
      console.log(`Running real Gemini AI analysis for new complaint ${rujukan}...`);
      const prompt = `Anda adalah sistem AI Pintar ("Sistem Aduan Bersepadu") untuk Jabatan Imigresen Malaysia.
Analisis aduan berikut dan jana klasifikasi serta cadangan operasi dalam format JSON tulen.

Butiran Kejadian: ${newComplaint.kejadian.butiran}
Kesalahan Disyaki: ${newComplaint.kejadian.kesalahan}
Bilangan Terlibat: ${newComplaint.kejadian.bilangan}
Warganegara Terlibat: ${newComplaint.kejadian.warganegara}
Lokasi / Alamat Sasaran: ${newComplaint.sasaran.alamat} (Daerah: ${newComplaint.sasaran.daerah})

Sila klasifikasikan aduan ini kepada salah satu kategori berikut:
- "High Profile" (jika melibatkan sindiket, pemalsuan dokumen profesional, ancaman keselamatan besar, atau kumpulan PATI > 20 orang).
- "Medium" (jika melibatkan PATI biasa bekerja tanpa permit sah, tinggal lebih masa di kediaman, dsb).
- "Low" (jika hanya pertanyaan am, maklumat tidak lengkap, atau tiada unsur kesalahan jenayah imigresen).

Jana jawapan anda dalam format JSON tulen berikut:
{
  "kategori": "High Profile" | "Medium" | "Low",
  "justifikasi": "Sebab-sebab klasifikasi yang ringkas dan padat dalam Bahasa Melayu.",
  "kriteria": ["Kriteria 1", "Kriteria 2"],
  "operasi": {
    "tajuk": "Nama cadangan operasi kreatif bermula dengan Ops (cth: Ops Tapis, Ops Sapu, Ops Sangkar, Ops Belanja)",
    "prioriti": "Tinggi" | "Sederhana" | "Rendah",
    "lokasi": "Nama kawasan tumpuan di Kuala Lumpur (pilih dari: KL Sentral, Pudu, Chow Kit, Bukit Bintang, Brickfields, Sentul, Kepong, Titiwangsa, Ampang, Cheras, Bangsar)",
    "impak": "+X% Pengurangan aduan",
    "tindakan": "Cadangan langkah penguatkuasaan khusus yang ringkas."
  }
}`;

      const responseText = await generateContentWithRetry(prompt, {
        responseMimeType: "application/json",
      });

      if (!responseText) {
        throw new Error("Gemini returned empty or failed all attempts.");
      }

      console.log("Raw Gemini Response:", responseText);

      const aiResult = JSON.parse(responseText);
      newComplaint.kategori = aiResult.kategori || "Medium";
      newComplaint.justifikasiAI = aiResult.justifikasi || "Klasifikasi dibuat oleh AI berdasarkan parameter aduan.";
      newComplaint.kriteriaAI = aiResult.kriteria || ["PATI bekerja tanpa permit sah"];
      if (aiResult.operasi) {
        newComplaint.cadanganOperasiAI = {
          tajuk: aiResult.operasi.tajuk || "Ops Saringan Am",
          prioriti: aiResult.operasi.prioriti || "Sederhana",
          lokasi: aiResult.operasi.lokasi || "Kuala Lumpur",
          impak: aiResult.operasi.impak || "+15% Pengurangan aduan",
          tindakan: aiResult.operasi.tindakan || "Pemeriksaan berjadual.",
        };

        // Also add a new operation recommendation in list
        const newRec: OperationRecommendation = {
          id: `rec_${recommendations.length + 1}`,
          tajuk: aiResult.operasi.tajuk || "Ops Saringan Am",
          prioriti: aiResult.operasi.prioriti || "Sederhana",
          lokasi: aiResult.operasi.lokasi || "Kuala Lumpur",
          impak: aiResult.operasi.impak || "+15% Pengurangan aduan",
          tindakan: aiResult.operasi.tindakan || "Pemeriksaan berjadual.",
          status: "Menunggu"
        };
        recommendations.unshift(newRec);
      }
    } catch (err) {
      console.error("Gemini call failed, falling back to simulated analysis:", err);
      const fallback = simulateAIClassification(newComplaint);
      newComplaint.kategori = fallback.kategori;
      newComplaint.justifikasiAI = fallback.justifikasi;
      newComplaint.kriteriaAI = fallback.kriteria;
      newComplaint.cadanganOperasiAI = fallback.cadanganOperasiAI;

      recommendations.unshift({
        id: `rec_${recommendations.length + 1}`,
        tajuk: fallback.cadanganOperasiAI.tajuk,
        prioriti: fallback.cadanganOperasiAI.prioriti,
        lokasi: fallback.cadanganOperasiAI.lokasi,
        impak: fallback.cadanganOperasiAI.impak,
        tindakan: fallback.cadanganOperasiAI.tindakan,
        status: "Menunggu"
      });
    }
  } else {
    // Simulated fallback
    const fallback = simulateAIClassification(newComplaint);
    newComplaint.kategori = fallback.kategori;
    newComplaint.justifikasiAI = fallback.justifikasi;
    newComplaint.kriteriaAI = fallback.kriteria;
    newComplaint.cadanganOperasiAI = fallback.cadanganOperasiAI;

    recommendations.unshift({
      id: `rec_${recommendations.length + 1}`,
      tajuk: fallback.cadanganOperasiAI.tajuk,
      prioriti: fallback.cadanganOperasiAI.prioriti,
      lokasi: fallback.cadanganOperasiAI.lokasi,
      impak: fallback.cadanganOperasiAI.impak,
      tindakan: fallback.cadanganOperasiAI.tindakan,
      status: "Menunggu"
    });
  }

  complaints.unshift(newComplaint);
  res.status(201).json(newComplaint);
});

// 3. Get all recommendations
app.get("/api/cadangan", (req, res) => {
  res.json(recommendations);
});

// 4. Update recommendation status (Validate / Reject)
app.patch("/api/cadangan/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const rec = recommendations.find((r) => r.id === id);
  if (rec) {
    rec.status = status;
    res.json(rec);
  } else {
    res.status(404).json({ error: "Recommendation not found" });
  }
});

// Helper to return simulated recommendations
function getSimulatedRecommendations(): OperationRecommendation[] {
  return [
    {
      id: "rec_regen_1",
      tajuk: "Ops Tapis & Saring (Regenerated)",
      prioriti: "Tinggi",
      lokasi: "Chow Kit",
      impak: "+30% Pengurangan aduan",
      tindakan: "Pemeriksaan bersepadu di pasar-pasar borong sekitar Chow Kit bermula 3:00 AM.",
      status: "Menunggu"
    },
    {
      id: "rec_regen_2",
      tajuk: "Ops Sangkar PATI (Regenerated)",
      prioriti: "Tinggi",
      lokasi: "KL Sentral",
      impak: "+24% Pengurangan aduan",
      tindakan: "Sekatan keluar di hab pengangkutan utama untuk menyaring pergerakan PATI rentas negeri.",
      status: "Menunggu"
    },
    {
      id: "rec_regen_3",
      tajuk: "Ops Sapu Kediaman (Regenerated)",
      prioriti: "Sederhana",
      lokasi: "Pudu",
      impak: "+20% Pengurangan aduan",
      tindakan: "Serbuan fajar ke atas rumah-rumah flat sewa yang disyaki menjadi rumah transit PATI.",
      status: "Menunggu"
    },
    {
      id: "rec_regen_4",
      tajuk: "Ops Belanja Selamat (Regenerated)",
      prioriti: "Sederhana",
      lokasi: "Bukit Bintang",
      impak: "+15% Pengurangan aduan",
      tindakan: "Saringan dokumentasi ke atas pekerja asing sektor peruncitan dan perkhidmatan di pusat membeli-belah.",
      status: "Menunggu"
    },
    {
      id: "rec_regen_5",
      tajuk: "Ops Rondaan Taktikal (Regenerated)",
      prioriti: "Rendah",
      lokasi: "Brickfields",
      impak: "+12% Pengurangan aduan",
      tindakan: "Rondaan kaki secara berkala oleh anggota beruniform di sekitar kedai-kedai runcit India-Pakistan.",
      status: "Menunggu"
    }
  ];
}

// 5. Regenerate recommendations (Simulate running AI model)
app.post("/api/cadangan/regenerate", async (req, res) => {
  // Reset recommendations list to dynamic variations to simulate regenerating
  try {
    if (ai) {
      console.log("Regenerating operation recommendations using Gemini...");
      const prompt = `Jana 5 cadangan operasi taktikal imigresen yang unik untuk Jabatan Imigresen Malaysia Wilayah Persekutuan Kuala Lumpur berdasarkan trend aduan terkini. 
Setiap cadangan mesti mempunyai:
1. tajuk (cth: Ops Tapis, Ops Sapu, Ops Kutip)
2. prioriti ('Tinggi' | 'Sederhana' | 'Rendah')
3. lokasi (kawasan tumpuan KL, cth: KL Sentral, Pudu, Chow Kit, Bukit Bintang, Brickfields, Sentul, Kepong, Cheras, Bangsar)
4. impak (cth: +25% Pengurangan aduan)
5. tindakan (huraian singkat)

Kembalikan jawapan anda dalam format JSON sahaja berupa sebuah senarai (array) objek:
[
  {
    "tajuk": "Ops...",
    "prioriti": "Tinggi",
    "lokasi": "Pudu",
    "impak": "+25% Pengurangan aduan",
    "tindakan": "Tindakan..."
  }
]`;

      const responseText = await generateContentWithRetry(prompt, {
        responseMimeType: "application/json"
      });

      if (!responseText) {
        throw new Error("Gemini returned empty or failed all attempts for recommendations.");
      }

      const results = JSON.parse(responseText);
      if (Array.isArray(results) && results.length > 0) {
        recommendations = results.map((r, i) => ({
          id: `rec_regen_${i}`,
          tajuk: r.tajuk || "Ops Saringan Baru",
          prioriti: r.prioriti || "Sederhana",
          lokasi: r.lokasi || "Kuala Lumpur",
          impak: r.impak || "+15% Pengurangan",
          tindakan: r.tindakan || "Pemeriksaan berjadual.",
          status: "Menunggu"
        }));
      } else {
        recommendations = getSimulatedRecommendations();
      }
    } else {
      // Offline simulation shuffle/regenerate
      recommendations = getSimulatedRecommendations();
    }
  } catch (err) {
    console.warn("Error regenerating recommendations, falling back to simulated data:", err);
    recommendations = getSimulatedRecommendations();
  }
  res.json(recommendations);
});

// Vite & Static file handler
const isProd = process.env.NODE_ENV === "production";

async function bootstrap() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

bootstrap();
