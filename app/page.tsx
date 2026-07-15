"use client";

import { FormEvent, ReactNode, useMemo, useState } from "react";

type View = "dashboard" | "aduan" | "semakan" | "maklumat" | "bantuan" | "berjaya";

const steps = [
  ["Maklumat Aduan", "Butiran asas aduan"],
  ["Maklumat Pengadu", "Butiran peribadi"],
  ["Maklumat Sasaran", "Premis / Individu / Syarikat"],
  ["Maklumat Aduan", "Butiran kejadian"],
  ["Pengesahan", "Semak dan hantar"],
];

const fields = {
  name: "Ahmad Bin Hassan",
  id: "801010-10-1234",
  phone: "012-334 6789",
  email: "ahmad.hassan@email.com",
  premise: "ABC Construction Sdn Bhd",
  address: "Lot 12, Jalan Industri 4/7, Taman Perindustrian, 47180 Puchong, Selangor",
};

function Icon({ children }: { children: ReactNode }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

function PortalHeader({ view, setView }: { view: View; setView: (v: View) => void }) {
  return (
    <header className="portal-header">
      <button className="brand" onClick={() => setView("dashboard")} aria-label="Kembali ke dashboard">
        <img src="/logo-jim.png" alt="Logo Jabatan Imigresen Malaysia" />
        <span><b>JABATAN IMIGRESEN MALAYSIA</b><small>e-Aduan Penguatkuasaan</small></span>
      </button>
      <nav aria-label="Navigasi utama">
        {(["dashboard", "aduan", "semakan", "maklumat", "bantuan"] as View[]).map((item) => (
          <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}>
            {item === "dashboard" ? "Utama" : item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </nav>
      <div className="header-tools"><span>A−</span><span>A</span><span>A+</span><span>☾</span><span className="bell">♢<b>3</b></span><span className="avatar">MF</span></div>
    </header>
  );
}

function StatCard({ icon, label, value, trend, danger }: { icon: string; label: string; value: string; trend: string; danger?: boolean }) {
  return (
    <article className="stat-card">
      <Icon>{icon}</Icon><div><small>{label}</small><strong>{value}</strong><span className={danger ? "red" : "green"}>{trend}</span></div>
    </article>
  );
}

function Dashboard({ setView }: { setView: (v: View) => void }) {
  const side = [["▦","Dashboard"],["◇","Aduan"],["⌘","Operasi"],["▥","Analitik"],["✦","AI Cadangan"],["◎","AI Pengesahan"],["⚑","Hasil Operasi"],["⌖","Peta Hotspot"],["▤","Laporan"],["♢","Notifikasi"],["⚙","Tetapan"]];
  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="admin-brand"><img src="/logo-jim.png" alt=""/><span><b>JABATAN IMIGRESEN MALAYSIA</b><small>WILAYAH PERSEKUTUAN KUALA LUMPUR</small></span></div>
        <div className="side-nav">{side.map(([ic,label],i)=><button key={label} className={i===0?"active":""} onClick={()=> label === "Aduan" && setView("aduan")}><Icon>{ic}</Icon>{label}{label==="Notifikasi"&&<em>3</em>}</button>)}</div>
        <div className="ai-badge"><b>AI</b><span>POWERED</span></div>
      </aside>
      <section className="dashboard-main">
        <div className="dash-topbar"><div><span className="live-dot"/> SISTEM AKTIF</div><div>18 JUN 2025 <i/> 3:52 PM <span className="avatar">MF</span></div></div>
        <div className="demo-bar"><span><b>DEMO INTERAKTIF</b> Data simulasi untuk pengalaman pelanggan</span><button onClick={()=>setView("aduan")}>Cuba Hantar Aduan →</button></div>
        <section className="stats-row">
          <StatCard icon="✓" label="JUMLAH ADUAN DITERIMA" value="1,247" trend="▲ 18.6% dari semalam"/>
          <StatCard icon="◉" label="ADUAN DALAM PROSES" value="420" trend="▲ 12.3% dari semalam"/>
          <StatCard icon="◈" label="ADUAN SELESAI" value="789" trend="▲ 15.9% dari semalam"/>
          <StatCard icon="⌁" label="PURATA MASA RESPONS" value="2.1 jam" trend="▼ 8% lebih pantas"/>
          <StatCard icon="⚠" label="ADUAN KRITIKAL (HIGH)" value="58" trend="▼ 5% dari semalam" danger/>
          <article className="stat-card score"><div className="mini-ring"><b>92%</b></div><div><small>PRESTASI OPERASI</small><span className="green">Sangat Baik</span></div></article>
        </section>
        <section className="dash-grid">
          <article className="dash-panel source-panel"><PanelTitle n="1" title="SUMBER PENERIMAAN ADUAN"/><div className="source-body"><ul><li><b>SISPAA</b><span>512</span><em>41%</em></li><li><b>E-MEL</b><span>298</span><em>24%</em></li><li><b>SURAT</b><span>126</span><em>10%</em></li><li><b>HADIR (WALK IN)</b><span>152</span><em>12%</em></li><li><b>TELEFON</b><span>98</span><em>8%</em></li><li><b>LOKASI GPS</b><span>61</span><em>5%</em></li></ul><div className="donut"><span><b>1,247</b>JUMLAH</span></div></div></article>
          <article className="dash-panel category-panel"><PanelTitle n="2" title="PENGKELASAN KATEGORI ADUAN"/><div className="category-body"><div className="category-donut"><span><b>1,247</b>JUMLAH</span></div><ul><li><i className="high"/>HIGH PROFILE <b>58</b></li><li><i className="medium"/>MEDIUM <b>512</b></li><li><i className="low"/>LOW <b>677</b></li></ul></div><div className="alert-strip">HIGH PROFILE ALERT <b>58</b></div></article>
          <article className="dash-panel map-panel"><PanelTitle n="3" title="ANALISIS HOTSPOT – ADUAN SPATIAL"/><div className="heat-map"><span className="heat h1"/><span className="heat h2"/><span className="heat h3"/><span className="heat h4"/><b>KUALA<br/>LUMPUR</b></div><ol><li>KL Sentral <em>Tinggi</em></li><li>Pudu <em>Tinggi</em></li><li>Chow Kit <em>Tinggi</em></li><li>Bukit Bintang <em>Sederhana</em></li><li>Brickfields <em>Sederhana</em></li></ol></article>
          <article className="dash-panel ai-panel"><PanelTitle n="4" title="AI CADANGAN OPERASI"/><div className="recommend"><span>⌖</span><p><b>Peruntukan anggota tambahan di KL Sentral</b><small>Berdasarkan corak aduan tinggi antara 9:00 AM – 1:00 PM</small></p><em>PRIORITI TINGGI</em></div><div className="recommend"><span>◈</span><p><b>Ops Tapis di Chow Kit</b><small>Peningkatan aduan berkaitan PATI dan dokumen tamat tempoh</small></p><em>SEDERHANA</em></div><div className="confidence"><span>KEYAKINAN AI</span><i/><b>92%</b></div></article>
          <article className="dash-panel approval-panel"><PanelTitle n="5" title="AI PENGESAHAN"/><div className="big-ring"><span><b>92%</b>DISAHKAN</span></div><ul><li>Relevan dengan trend aduan <b>✓ Disahkan</b></li><li>Sumber mencukupi <b>✓ Disahkan</b></li><li>Risiko operasi <b>✓ Rendah</b></li></ul></article>
          <article className="dash-panel results-panel"><PanelTitle n="6" title="HASIL OPERASI"/><div className="result-kpis"><span><small>OPERASI DIJALANKAN</small><b>24</b></span><span><small>TANGKAPAN</small><b>156</b></span><span><small>NOTIS DIBERIKAN</small><b>312</b></span><span><small>KOMPAUN</small><b>RM 45,600</b></span></div><div className="line-chart"><i/><i/><i/><i/><i/><i/></div><div className="legend">● Operasi　<span>● Tangkapan</span>　<em>● Notis</em>　<b>● Kompaun</b></div></article>
        </section>
      </section>
    </main>
  );
}

function PanelTitle({n,title}:{n:string;title:string}) { return <div className="panel-title"><b>{n}</b>{title}</div> }

function Field({ label, children, className="" }: { label: string; children: ReactNode; className?: string }) {
  return <label className={`field ${className}`}><span>{label}</span>{children}</label>;
}
function Input({ value, type="text", placeholder }: { value?: string; type?: string; placeholder?: string }) { return <input type={type} defaultValue={value} placeholder={placeholder}/> }
function Select({ value, options }: { value?: string; options: string[] }) { return <select defaultValue={value || options[0]}>{options.map(o=><option key={o}>{o}</option>)}</select> }

function Stepper({ step }: { step: number }) {
  return <div className="stepper">{steps.map(([title,sub],i)=>{const n=i+1; const done=n<step; return <div key={title+sub} className={n===step?"current":done?"done":""}><span>{done?"✓":n}</span><p><b>{title}</b><small>{sub}</small></p></div>})}</div>
}

function TipBox({ children, title="Tips" }: { children: ReactNode; title?: string }) { return <aside className="tip-card"><h3>{title}</h3>{children}</aside> }

function ComplaintForm({ setView }: { setView: (v: View) => void }) {
  const [step,setStep]=useState(1); const [toast,setToast]=useState(""); const [agreed,setAgreed]=useState(false); const [fileName,setFileName]=useState("");
  const showToast=(t:string)=>{setToast(t); window.setTimeout(()=>setToast(""),2400)};
  const next=(e?:FormEvent)=>{e?.preventDefault(); setStep(s=>Math.min(5,s+1)); window.scrollTo({top:0,behavior:"smooth"})};
  const back=()=>{if(step===1)setView("dashboard"); else setStep(s=>s-1); window.scrollTo({top:0,behavior:"smooth"})};
  return (
    <div className="portal-page">
      <div className="page-head"><div><h1>Borang Aduan Baru</h1><p>Utama　›　Aduan　›　Borang Aduan Baru</p></div><span className="demo-pill">MOD DEMO</span></div>
      <Stepper step={step}/>
      <form onSubmit={step===5?(e)=>{e.preventDefault();if(agreed)setView("berjaya")}:next}>
        <div className="form-layout"><section className="form-card"><div className="section-title">{step===3?"Maklumat Sasaran (Premis / Individu / Syarikat)":step===4?"Maklumat Aduan (Butiran Kejadian)":step===5?"Pengesahan Maklumat":steps[step-1][0]}</div>
          {step===1&&<StepOne/>}{step===2&&<StepTwo fileName={fileName} setFileName={setFileName}/>} {step===3&&<StepThree/>}{step===4&&<StepFour/>}{step===5&&<StepFive agreed={agreed} setAgreed={setAgreed} fileName={fileName}/>} 
          <div className="form-actions"><button type="button" className="btn ghost" onClick={back}>Kembali</button><div>{step<5&&<button type="button" className="btn secondary" onClick={()=>showToast("Draf berjaya disimpan untuk demo")}>Simpan Draf</button>}<button className={`btn primary ${step===5?"submit":""}`} type="submit" disabled={step===5&&!agreed}>{step===5?"Hantar Aduan":"Seterusnya"}</button></div></div>
        </section>{step>1&&<FormAside step={step}/>}</div>
      </form>{toast&&<div className="toast">✓ {toast}</div>}
    </div>
  );
}

function StepOne(){return <><div className="field-grid three"><Field label="Sumber Aduan *"><Select options={["SISPAA","E-mel","Hadir (Walk-in)","Telefon","Surat"]}/></Field><Field label="Kategori Aduan *"><Select value="Pekerja Asing Tanpa Permit" options={["Sila Pilih","Pekerja Asing Tanpa Permit","Salah Guna Pas","Dokumen Palsu"]}/></Field><Field label="Sub Kategori"><Select options={["Tiada","Majikan","Premis","Individu"]}/></Field><Field label="Tarikh Aduan *"><Input type="date" value="2025-06-18"/></Field><Field label="Masa Aduan *"><Input type="time" value="10:21"/></Field><Field label="Saluran Aduan *"><Select options={["Portal e-Aduan","Aplikasi Mudah Alih","Kaunter"]}/></Field><Field label="ID Rujukan (Jika ada)"><Input placeholder="Contoh: SIS-2025-001"/></Field><Field label="No. Aduan Lama (Jika ada)"><Input/></Field></div><div className="notice"><b>ⓘ　Perhatian</b><span>Sila pastikan maklumat yang diberikan adalah benar dan lengkap. Aduan palsu adalah menjadi kesalahan di bawah Akta Imigresen 1959/63.</span></div></>}

function StepTwo({fileName,setFileName}:{fileName:string;setFileName:(s:string)=>void}){return <><div className="field-grid three"><Field label="Nama Pengadu *"><Input value={fields.name}/></Field><Field label="No. Kad Pengenalan / No. Pasport *"><Input value={fields.id}/></Field><Field label="Warganegara *"><Select options={["Malaysia","Indonesia","Bangladesh","Lain-lain"]}/></Field><Field label="Tarikh Lahir"><Input type="date" value="1980-10-10"/></Field><Field label="Jantina"><Select options={["Lelaki","Perempuan"]}/></Field><Field label="Kaum"><Select options={["Melayu","Cina","India","Lain-lain"]}/></Field><Field label="Alamat Surat Menyurat *" className="wide"><textarea defaultValue="No 12, Jalan Melati 3, Taman Melati, 53100 Kuala Lumpur, Wilayah Persekutuan Kuala Lumpur."/></Field><Field label="No. Telefon Bimbit *"><Input value={fields.phone}/></Field><Field label="No. Telefon Rumah"><Input value="03-1234 5678"/></Field><Field label="E-mel"><Input value={fields.email} type="email"/></Field><Field label="Pekerjaan"><Input value="Pekerja Swasta"/></Field><Field label="Hubungan Dengan Aduan *" className="span2"><Select options={["Orang Awam","Pekerja","Majikan","Wakil"]}/></Field></div><div className="upload-inline"><input id="file" type="file" onChange={e=>setFileName(e.target.files?.[0]?.name||"")}/><label htmlFor="file"><b>↥ Lampiran Sokongan</b><span>{fileName||"Pilih gambar atau dokumen (maksimum 10MB)"}</span></label></div><div className="notice"><b>ⓘ　Perlindungan Identiti</b><span>Maklumat peribadi anda akan dirahsiakan dan dilindungi di bawah Akta Perlindungan Pemberi Maklumat 2010 (Akta 711).</span></div></>}

function StepThree(){return <><div className="radio-row"><b>Jenis Sasaran *</b>{["Premis / Tempat","Individu","Syarikat","Lain-lain"].map((x,i)=><label key={x}><input type="radio" name="target" defaultChecked={i===0}/>{x}</label>)}</div><div className="field-grid two"><Field label="Nama Premis / Tempat *"><Input value={fields.premise}/></Field><Field label="No. Pendaftaran Syarikat / Perniagaan (SSM)"><Input value="202001012345 (1357923-M)"/></Field><Field label="Alamat Premis / Tempat *" className="wide"><textarea defaultValue={fields.address}/></Field></div><div className="field-grid four"><Field label="Negeri *"><Select options={["Selangor","Kuala Lumpur"]}/></Field><Field label="Daerah *"><Select options={["Petaling","Klang","Gombak"]}/></Field><Field label="Mukim / Bandar *"><Select options={["Puchong","Petaling Jaya"]}/></Field><Field label="Poskod *"><Input value="47180"/></Field></div><div className="map-block"><div className="map-image"><img src="/map-kl.jpg" alt="Peta lokasi sasaran"/><span className="pin">●</span></div><div><Field label="Lokasi di Peta"><Input value="3.0331, 101.5984"/></Field><Field label="Penerangan Lokasi"><textarea defaultValue="Berhampiran kilang XYZ, belakang kawasan perumahan Sri Puchong."/></Field><label className="check"><input type="checkbox" defaultChecked/> Tandakan lokasi pada peta</label></div></div></>}

function StepFour(){return <><div className="field-grid three"><Field label="Tarikh Kejadian *"><Input type="date" value="2025-06-17"/></Field><Field label="Masa Kejadian *"><Input type="time" value="14:30"/></Field><Field label="Kekerapan Kejadian *"><Select options={["Berulang","Sekali sahaja","Tidak pasti"]}/></Field><Field label="Tempat Kejadian (Jika berbeza dari maklumat sasaran)" className="wide"><Input value="Tapak pembinaan berhampiran dengan Jalan Industri 4/7, Taman Perindustrian Puchong."/></Field><Field label="Jenis Kesalahan Yang Disyaki *"><Select options={["Pekerja Asing Tanpa Permit","Penyalahgunaan Pas","Dokumen Palsu"]}/></Field><Field label="Bilangan Individu Terlibat (Anggaran)"><Select options={["25 – 50 orang","1 – 10 orang","11 – 24 orang","Lebih 50 orang"]}/></Field><Field label="Warganegara Terlibat"><Input value="Bangladesh, Indonesia"/></Field><Field label="Butiran Kejadian *" className="wide"><textarea rows={5} defaultValue="Terdapat sekumpulan pekerja asing dipercayai bekerja di tapak pembinaan tanpa permit yang sah. Mereka bekerja pada waktu siang dan kadang-kadang sehingga lewat petang. Tiada pengawasan daripada pihak berkuasa."/></Field></div><label className="check"><input type="checkbox" defaultChecked/> Saya telah melampirkan gambar / dokumen sokongan berkaitan kejadian ini.</label></>}

function StepFive({agreed,setAgreed,fileName}:{agreed:boolean;setAgreed:(v:boolean)=>void;fileName:string}){return <><div className="review-alert">ⓘ　Sila semak dan sahkan maklumat aduan anda sebelum dihantar.</div><div className="review-grid"><Review title="Ringkasan Maklumat Aduan" items={[["No. Rujukan (Draf)","IM.W01/W-ES/5/VI/26/493"],["Tarikh Aduan","18/06/2025 10:21 AM"],["Sumber Aduan","SISPAA"],["Kategori Aduan","Pekerja Asing Tanpa Permit"]]}/><Review title="Maklumat Sasaran" items={[["Nama Premis",fields.premise],["No. Pendaftaran","202001012345"],["Alamat",fields.address]]}/><Review title="Maklumat Pengadu" items={[["Nama Pengadu",fields.name],["No. Pengenalan",fields.id],["No. Telefon",fields.phone],["E-mel",fields.email]]}/><Review title="Ringkasan Kejadian" items={[["Kekerapan","Berulang"],["Jenis Kesalahan","Pekerja Asing Tanpa Permit"],["Bilangan Terlibat","25 – 50 orang"],["Warganegara","Bangladesh, Indonesia"]]}/></div><div className="attachments"><h3>Lampiran Sokongan</h3>{["IMG_001.jpg","IMG_002.jpg","Video_001.mp4",fileName||"Dokumen.pdf"].map((x,i)=><div key={x}><span>{i===2?"▶":i===3?"PDF":"▧"}</span><b>{x}</b><small>{i===2?"4.5 MB":"1.2 MB"}</small></div>)}</div><label className="agree"><input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}/> Saya mengaku bahawa maklumat yang diberikan adalah benar dan lengkap.</label></>}

function Review({title,items}:{title:string;items:string[][]}){return <div><h3>{title}</h3>{items.map(([a,b])=><p key={a}><span>{a}</span><b>{b}</b></p>)}</div>}

function FormAside({step}:{step:number}){return <div className="form-aside"><TipBox title="Ringkasan Aduan"><dl><dt>No. Rujukan</dt><dd>IM.W01/W-ES/5/VI/26/493</dd><dt>Sumber Aduan</dt><dd>SISPAA</dd><dt>Kategori</dt><dd>Pekerja Asing Tanpa Permit</dd><dt>Nama Pengadu</dt><dd>{fields.name}</dd></dl></TipBox><TipBox><p>✓ Sila berikan maklumat yang lengkap dan tepat.</p><p>✓ Maklumat anda dirahsiakan.</p><p>✓ Anda boleh menyemak status selepas dihantar.</p>{step===5&&<p>ⓘ Aduan akan dihantar kepada unit penguatkuasaan berkaitan.</p>}</TipBox></div>}

function Tracking(){const [ref,setRef]=useState("IM.W01/W-ES/5/VI/26/493"); const [shown,setShown]=useState(true); return <div className="content-page"><div className="intro"><span>SEMAKAN ADUAN</span><h1>Jejaki status aduan anda</h1><p>Masukkan nombor rujukan yang diterima selepas aduan dihantar.</p></div><div className="track-search"><input value={ref} onChange={e=>setRef(e.target.value)} aria-label="Nombor rujukan"/><button onClick={()=>setShown(true)}>Semak Status</button></div>{shown&&<div className="status-card"><div className="status-head"><div><small>NO. RUJUKAN</small><b>{ref}</b></div><span>DALAM TINDAKAN</span></div><div className="timeline"><div className="done"><i>✓</i><b>Aduan diterima</b><small>18 Jun 2025 · 10:24 AM</small></div><div className="done"><i>✓</i><b>Semakan awal selesai</b><small>18 Jun 2025 · 11:10 AM</small></div><div className="current"><i>3</i><b>Dalam tindakan unit operasi</b><small>Dikemas kini 19 Jun 2025 · 9:30 AM</small></div><div><i>4</i><b>Keputusan</b><small>Menunggu tindakan</small></div></div><div className="officer-note"><b>Kemas kini terkini</b><p>Maklumat telah disahkan dan disalurkan kepada Unit Penguatkuasaan WPKL untuk tindakan lanjut.</p></div></div>}</div>}

function InfoPage({help=false}:{help?:boolean}){const items=help?["Bagaimana membuat aduan?","Maklumat apa yang diperlukan?","Bagaimana identiti saya dilindungi?","Bilakah aduan akan diproses?"]:["Aduan berkaitan pendatang asing tanpa izin","Penyalahgunaan pas atau permit","Aktiviti pemalsuan dokumen imigresen","Majikan yang menggaji pekerja tanpa permit sah"]; return <div className="content-page"><div className="intro"><span>{help?"PUSAT BANTUAN":"MAKLUMAT"}</span><h1>{help?"Kami sedia membantu":"Salurkan maklumat, bantu penguatkuasaan"}</h1><p>{help?"Jawapan ringkas untuk membantu anda menggunakan sistem e-Aduan.":"Aduan yang tepat membantu Jabatan Imigresen Malaysia merancang tindakan yang lebih berkesan."}</p></div><div className="info-grid">{items.map((x,i)=><article key={x}><span>{help?"?":i+1}</span><h3>{x}</h3><p>{help?"Klik untuk melihat penerangan dan panduan langkah demi langkah.":"Sertakan lokasi, masa kejadian dan bukti sokongan jika tersedia."}</p></article>)}</div></div>}

function Success({setView}:{setView:(v:View)=>void}){return <div className="success-page"><div className="success-mark">✓</div><span>ADUAN BERJAYA DIHANTAR</span><h1>Terima kasih atas kerjasama anda</h1><p>Aduan telah direkodkan dan akan disalurkan kepada unit penguatkuasaan berkaitan.</p><div className="reference"><small>NOMBOR RUJUKAN</small><b>IM.W01/W-ES/5/VI/26/493</b><button onClick={()=>navigator.clipboard?.writeText("IM.W01/W-ES/5/VI/26/493")}>Salin nombor</button></div><div className="success-actions"><button className="btn primary" onClick={()=>setView("semakan")}>Semak Status Aduan</button><button className="btn ghost" onClick={()=>setView("dashboard")}>Kembali ke Utama</button></div></div>}

export default function Home(){const [view,setView]=useState<View>("dashboard"); const portal=view!=="dashboard"; const content=useMemo(()=>{if(view==="aduan")return <ComplaintForm setView={setView}/>;if(view==="semakan")return <Tracking/>;if(view==="maklumat")return <InfoPage/>;if(view==="bantuan")return <InfoPage help/>;if(view==="berjaya")return <Success setView={setView}/>;return <Dashboard setView={setView}/>},[view]); return <>{portal&&<PortalHeader view={view} setView={setView}/>} {content}{portal&&<footer><span>© 2025 Jabatan Imigresen Malaysia. Hak Cipta Terpelihara.</span><span>Dasar Privasi　|　Terma Penggunaan　|　Panduan Pengguna</span><span>Demo pengalaman pelanggan</span></footer>}</>}
