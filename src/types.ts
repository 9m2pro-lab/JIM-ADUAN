export interface Complaint {
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

export interface OperationRecommendation {
  id: string;
  tajuk: string;
  prioriti: "Tinggi" | "Sederhana" | "Rendah";
  lokasi: string;
  impak: string;
  tindakan: string;
  status: "Menunggu" | "Disahkan" | "Ditolak";
}
