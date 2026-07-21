"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type View = "dashboard" | "aduan" | "semakan" | "maklumat" | "bantuan" | "berjaya";
type Lang = "BM" | "EN";
type Theme = "dark" | "light";
type FontSize = "normal" | "large" | "xlarge";

const tr = (lang: Lang, bm: string, en: string) => lang === "BM" ? bm : en;

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

function PortalHeader({ view, setView, lang }: { view: View; setView: (v: View) => void; lang: Lang }) {
  const navLabels: Record<View, string> = {
    dashboard: tr(lang,"Utama","Home"), aduan: tr(lang,"Aduan","Complaint"), semakan: tr(lang,"Semakan","Tracking"),
    maklumat: tr(lang,"Maklumat","Information"), bantuan: tr(lang,"Bantuan","Help"), berjaya: tr(lang,"Berjaya","Success"),
  };
  return (
    <header className="portal-header">
      <button className="brand" onClick={() => setView("dashboard")} aria-label={tr(lang,"Kembali ke dashboard","Return to dashboard")}>
        <img src="/logo-jim.png" alt="Logo Jabatan Imigresen Malaysia" />
        <span><b>JABATAN IMIGRESEN MALAYSIA</b><small>{tr(lang,"e-Aduan Penguatkuasaan","e-Enforcement Complaint")}</small></span>
      </button>
      <nav aria-label="Navigasi utama">
        {(["dashboard", "aduan", "semakan", "maklumat", "bantuan"] as View[]).map((item) => (
          <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}>
            {navLabels[item]}
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

function Dashboard({ setView, lang }: { setView: (v: View) => void; lang: Lang }) {
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [adminNotice, setAdminNotice] = useState("");
  const [period, setPeriod] = useState<"Hari Ini"|"7 Hari"|"30 Hari">("Hari Ini");
  const [liveMode, setLiveMode] = useState(true);
  const [hotspot, setHotspot] = useState(0);
  const [lastSync, setLastSync] = useState("3:52 PM");
  const periodData={
    "Hari Ini":{received:"1,247",process:"420",done:"789",critical:"58",response:"2.1 jam",ops:"24",arrests:"156"},
    "7 Hari":{received:"7,842",process:"1,306",done:"6,478",critical:"214",response:"2.4 jam",ops:"137",arrests:"684"},
    "30 Hari":{received:"31,608",process:"3,914",done:"27,122",critical:"906",response:"2.8 jam",ops:"528",arrests:"2,431"},
  }[period];
  const hotspotData=[
    {name:"KL Sentral",cases:156,risk:"Tinggi",detail:"Puncak aduan 9:00 AM – 1:00 PM"},
    {name:"Pudu",cases:132,risk:"Tinggi",detail:"Peningkatan PATI dan dokumen tamat tempoh"},
    {name:"Chow Kit",cases:98,risk:"Tinggi",detail:"23 aduan memerlukan semakan silang"},
    {name:"Bukit Bintang",cases:76,risk:"Sederhana",detail:"Aktiviti tertumpu di premis perniagaan"},
    {name:"Brickfields",cases:65,risk:"Sederhana",detail:"Trend stabil dalam tempoh 24 jam"},
  ];
  const notify=(message:string)=>{setAdminNotice(message);window.setTimeout(()=>setAdminNotice(""),2800)};
  const side = [["▦","Dashboard"],["◇","Aduan"],["⌘","Operasi"],["▥","AI Pengkelasan"],["✦","AI Cadangan"],["◎","AI Pengesahan"],["⚑","Hasil Operasi"],["⌖","Peta Hotspot"],["▤","Laporan"],["♢","Notifikasi"],["⚙","Tetapan"]];
  const targets: Record<string, string> = {
    Operasi: ".results-panel",
    "AI Cadangan": ".ai-panel",
    "AI Pengesahan": ".approval-panel",
    "Hasil Operasi": ".results-panel",
    "Peta Hotspot": ".map-panel",
  };
  const sideEn: Record<string,string> = {Dashboard:"Dashboard",Aduan:"Complaints",Operasi:"Operations","AI Pengkelasan":"AI Classification","AI Cadangan":"AI Recommendations","AI Pengesahan":"AI Validation","Hasil Operasi":"Operation Results","Peta Hotspot":"Hotspot Map",Laporan:"Reports",Notifikasi:"Notifications",Tetapan:"Settings"};
  const sideLabel=(label:string)=>lang==="BM"?label:(sideEn[label]||label);
  const handleMenu = (label: string) => {
    setActiveMenu(label);
    if (label === "Aduan") { setView("aduan"); return; }
    if (label === "Dashboard") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    if (label === "AI Pengkelasan") { setAdminNotice("1,247 aduan demo telah dikelaskan oleh AI"); window.setTimeout(() => setAdminNotice(""), 2800); return; }
    const target = targets[label];
    if (target) {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth", block: "center" });
      setAdminNotice(`${label} dipaparkan pada dashboard`);
    } else if (label === "Laporan") setAdminNotice("Laporan ringkasan demo sedia untuk pratonton");
    else if (label === "Notifikasi") setAdminNotice("3 notifikasi demo: 2 aduan baharu dan 1 tindakan selesai");
    else setAdminNotice("Tetapan demo menggunakan konfigurasi lalai yang selamat");
    window.setTimeout(() => setAdminNotice(""), 2800);
  };
  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="admin-brand"><img src="/logo-jim.png" alt="Logo rasmi Jabatan Imigresen Malaysia"/><span><b>JABATAN IMIGRESEN MALAYSIA</b><small>WILAYAH PERSEKUTUAN KUALA LUMPUR</small></span></div>
        <div className="side-nav">{side.map(([ic,label])=><button key={label} className={activeMenu===label?"active":""} onClick={()=>handleMenu(label)} aria-label={`${tr(lang,"Buka","Open")} ${sideLabel(label)}`}><Icon>{ic}</Icon>{sideLabel(label)}{label==="Notifikasi"&&<em>3</em>}</button>)}</div>
        <div className="ai-badge"><b>AI</b><span>POWERED</span></div>
      </aside>
      <section className="dashboard-main">
        <div className="dash-topbar"><div><span className={`live-dot ${liveMode?"":"paused"}`}/> {liveMode?tr(lang,"DATA LANGSUNG AKTIF","LIVE DATA ACTIVE"):tr(lang,"KEMAS KINI DIJEDA","UPDATES PAUSED")}</div><div>18 JUN 2025 <i/> {tr(lang,"Sinkron terakhir","Last synced")} {lastSync} <span className="avatar">MF</span></div></div>
        <section className="command-hero"><div><span className="eyebrow">{tr(lang,"PUSAT KAWALAN · WPKL","COMMAND CENTRE · WPKL")}</span><h1>{tr(lang,"Dashboard Operasi Jabatan Imigresen","Immigration Operations Dashboard")}</h1><p className="hero-greeting">{tr(lang,"Selamat petang, Muhammad Faiz.","Good afternoon, Muhammad Faiz.")} <span>{tr(lang,"Pantau aduan, risiko dan keberkesanan operasi dalam satu paparan masa nyata.","Monitor complaints, risks and operational effectiveness in one real-time view.")}</span></p></div><div className="hero-controls"><div className="period-switch" aria-label={tr(lang,"Tempoh laporan","Report period")}>{(["Hari Ini","7 Hari","30 Hari"] as const).map(x=><button key={x} className={period===x?"active":""} onClick={()=>setPeriod(x)}>{x==="Hari Ini"?tr(lang,x,"Today"):x==="7 Hari"?tr(lang,x,"7 Days"):tr(lang,x,"30 Days")}</button>)}</div><button className={`live-toggle ${liveMode?"active":""}`} onClick={()=>{setLiveMode(v=>!v);notify(liveMode?tr(lang,"Auto-kemas kini dijeda","Auto refresh paused"):tr(lang,"Auto-kemas kini diaktifkan","Auto refresh enabled"))}}><i/> {liveMode?"Live":tr(lang,"Dijeda","Paused")}</button><button className="refresh-btn" onClick={()=>{setLastSync(new Date().toLocaleTimeString("en-MY",{hour:"numeric",minute:"2-digit"}));notify(tr(lang,"Dashboard dikemas kini dengan data demo terbaru","Dashboard refreshed with the latest demo data"))}}>↻ {tr(lang,"Segar Semula","Refresh")}</button></div></section>
        <div className="demo-bar"><span><b>{tr(lang,"DEMO INTERAKTIF","INTERACTIVE DEMO")}</b> {tr(lang,"Data simulasi untuk pengalaman pelanggan","Simulated data for customer experience")}</span><div className="demo-actions"><button className="outline" onClick={()=>setActiveMenu(activeMenu==="AI Pengkelasan"?"Dashboard":"AI Pengkelasan")}>{activeMenu==="AI Pengkelasan"?tr(lang,"Kembali Dashboard","Back to Dashboard"):tr(lang,"AI Pengkelasan","AI Classification")}</button><button onClick={()=>setView("aduan")}>{tr(lang,"Cuba Hantar Aduan","Try Submitting a Complaint")} →</button></div></div>
        {activeMenu==="AI Pengkelasan"?<ClassificationDemo lang={lang}/>:<><div className="activity-ribbon"><span><i className="pulse"/> {tr(lang,"Sistem menerima","System received")} <b>{tr(lang,"12 aduan baharu","12 new complaints")}</b> {tr(lang,"dalam 15 minit","in 15 minutes")}</span><span>✦ AI {tr(lang,"mengklasifikasi","classified")} <b>98.7%</b> {tr(lang,"tanpa semakan manual","without manual review")}</span><span>⌖ {tr(lang,"Hotspot aktif","Active hotspot")}: <b>{hotspotData[hotspot].name}</b></span></div><section className="stats-row">
          <StatCard icon="✓" label={tr(lang,"JUMLAH ADUAN DITERIMA","TOTAL COMPLAINTS RECEIVED")} value={periodData.received} trend={tr(lang,"▲ 18.6% dari tempoh lalu","▲ 18.6% from previous period")}/>
          <StatCard icon="◉" label={tr(lang,"ADUAN DALAM PROSES","COMPLAINTS IN PROGRESS")} value={periodData.process} trend={tr(lang,"▲ 12.3% dari tempoh lalu","▲ 12.3% from previous period")}/>
          <StatCard icon="◈" label={tr(lang,"ADUAN SELESAI","COMPLETED COMPLAINTS")} value={periodData.done} trend={tr(lang,"▲ 15.9% dari tempoh lalu","▲ 15.9% from previous period")}/>
          <StatCard icon="⌁" label={tr(lang,"PURATA MASA RESPONS","AVERAGE RESPONSE TIME")} value={periodData.response.replace("jam",tr(lang,"jam","hrs"))} trend={tr(lang,"▼ 8% lebih pantas","▼ 8% faster")}/>
          <StatCard icon="⚠" label={tr(lang,"ADUAN KRITIKAL (HIGH)","CRITICAL COMPLAINTS (HIGH)")} value={periodData.critical} trend={tr(lang,"▼ 5% dari tempoh lalu","▼ 5% from previous period")} danger/>
          <article className="stat-card score"><div className="mini-ring"><b>92%</b></div><div><small>{tr(lang,"PRESTASI OPERASI","OPERATION PERFORMANCE")}</small><span className="green">{tr(lang,"Sangat Baik","Excellent")}</span></div></article>
        </section>
        <section className="dash-grid">
          <article className="dash-panel source-panel"><PanelTitle n="1" title="SUMBER PENERIMAAN ADUAN"/><div className="source-body"><ul>{[["SISPAA","512","41%"],["E-MEL","298","24%"],["SURAT","126","10%"],["HADIR (WALK IN)","152","12%"],["TELEFON","98","8%"],["LOKASI GPS","61","5%"]].map(([name,count,share])=><li key={name}><button onClick={()=>notify(`${count} aduan diterima melalui ${name}`)}><b>{name}</b><span>{count}</span><em>{share}</em></button></li>)}</ul><button className="donut donut-button" onClick={()=>setActiveMenu("AI Pengkelasan")} aria-label="Buka pecahan 1,247 aduan"><span><b>1,247</b>JUMLAH<small>Lihat butiran →</small></span></button></div></article>
          <article className="dash-panel category-panel"><PanelTitle n="2" title="PENGKELASAN KATEGORI ADUAN"/><div className="category-body"><div className="category-donut"><span><b>1,247</b>JUMLAH</span></div><ul><li><i className="high"/>HIGH PROFILE <b>58</b></li><li><i className="medium"/>MEDIUM <b>512</b></li><li><i className="low"/>LOW <b>677</b></li></ul></div><div className="alert-strip">HIGH PROFILE ALERT <b>58</b></div></article>
          <article className="dash-panel map-panel"><PanelTitle n="3" title="ANALISIS HOTSPOT – ADUAN SPATIAL"/><div className="heat-map"><span className="heat h1"/><span className="heat h2"/><span className="heat h3"/><span className="heat h4"/><b>{hotspotData[hotspot].name}</b><div className="map-focus"><strong>{hotspotData[hotspot].cases} aduan</strong><span>{hotspotData[hotspot].detail}</span></div></div><ol>{hotspotData.map((x,i)=><li key={x.name} className={hotspot===i?"active":""}><button onClick={()=>setHotspot(i)}><span><b>{i+1}. {x.name}</b><small>{x.cases} aduan</small></span><em>{x.risk}</em></button></li>)}</ol></article>
          <article className="dash-panel ai-panel"><PanelTitle n="4" title="AI CADANGAN OPERASI"/><div className="recommend"><span>⌖</span><p><b>Peruntukan anggota tambahan di KL Sentral</b><small>Berdasarkan corak aduan tinggi antara 9:00 AM – 1:00 PM</small></p><em>TINGGI</em><button onClick={()=>notify("Cadangan KL Sentral dihantar kepada penyelia operasi")}>Aktifkan</button></div><div className="recommend"><span>◈</span><p><b>Ops Tapis di Chow Kit</b><small>Peningkatan aduan berkaitan PATI dan dokumen tamat tempoh</small></p><em>SEDERHANA</em><button onClick={()=>notify("Cadangan Ops Tapis ditambah ke pelan operasi")}>Aktifkan</button></div><div className="confidence"><span>KEYAKINAN AI</span><i/><b>92%</b></div></article>
          <article className="dash-panel approval-panel"><PanelTitle n="5" title="AI PENGESAHAN"/><div className="big-ring"><span><b>92%</b>DISAHKAN</span></div><ul><li>Relevan dengan trend aduan <b>✓ Disahkan</b></li><li>Sumber mencukupi <b>✓ Disahkan</b></li><li>Risiko operasi <b>✓ Rendah</b></li></ul></article>
          <article className="dash-panel results-panel"><PanelTitle n="6" title={`HASIL OPERASI · ${period.toUpperCase()}`}/><div className="result-kpis"><span><small>OPERASI DIJALANKAN</small><b>{periodData.ops}</b></span><span><small>TANGKAPAN</small><b>{periodData.arrests}</b></span><span><small>NOTIS DIBERIKAN</small><b>{period==="Hari Ini"?"312":period==="7 Hari"?"1,426":"5,908"}</b></span><span><small>KOMPAUN</small><b>{period==="Hari Ini"?"RM 45,600":period==="7 Hari"?"RM 284K":"RM 1.16J"}</b></span></div><div className="line-chart"><i/><i/><i/><i/><i/><i/></div><div className="legend">● Operasi　<span>● Tangkapan</span>　<em>● Notis</em>　<b>● Kompaun</b></div></article>
        </section></>}
        {adminNotice&&<div className="toast admin-toast" role="status">✓ {adminNotice}</div>}
      </section>
    </main>
  );
}

function PanelTitle({n,title}:{n:string;title:string}) { return <div className="panel-title"><b>{n}</b>{title}</div> }

type DemoCase = { id: string; title: string; area: string; time: string; score: number; category: "High Profile" | "Medium" | "Low" };

const demoCases: DemoCase[] = [
  {id:"IM-KL-2025-0618-093",title:"Sindiket dokumen perjalanan palsu disyaki beroperasi",area:"Chow Kit",time:"18 Jun · 3:42 PM",score:97,category:"High Profile"},
  {id:"IM-KL-2025-0618-088",title:"Aktiviti penyeludupan migran melalui premis transit",area:"Pudu",time:"18 Jun · 1:15 PM",score:94,category:"High Profile"},
  {id:"IM-KL-2025-0617-241",title:"Pemalsuan pas kerja melibatkan beberapa syarikat",area:"KL Sentral",time:"17 Jun · 8:30 PM",score:91,category:"High Profile"},
  {id:"IM-KL-2025-0618-104",title:"Pekerja asing tanpa permit di tapak pembinaan",area:"Bukit Bintang",time:"18 Jun · 4:20 PM",score:86,category:"Medium"},
  {id:"IM-KL-2025-0618-099",title:"Pekerja restoran dipercayai menggunakan pas tamat tempoh",area:"Brickfields",time:"18 Jun · 3:58 PM",score:82,category:"Medium"},
  {id:"IM-KL-2025-0618-076",title:"Aktiviti mencurigakan di rumah kongsi pekerja asing",area:"Sentul",time:"18 Jun · 11:05 AM",score:78,category:"Medium"},
  {id:"IM-KL-2025-0618-109",title:"Pertanyaan prosedur melaporkan majikan tidak patuh",area:"Kepong",time:"18 Jun · 5:10 PM",score:42,category:"Low"},
  {id:"IM-KL-2025-0618-097",title:"Maklumat tambahan berkaitan aduan terdahulu",area:"Ampang",time:"18 Jun · 3:31 PM",score:36,category:"Low"},
  {id:"IM-KL-2025-0618-071",title:"Cadangan penambahbaikan saluran aduan awam",area:"Bangsar",time:"18 Jun · 10:22 AM",score:25,category:"Low"},
];

function ClassificationDemo({lang}:{lang:Lang}){
  const [selected,setSelected]=useState<DemoCase["category"]|null>(null);
  const [exported,setExported]=useState(false);
  const trend=[
    {day:"12 Jun",high:39,medium:401,low:575},{day:"13 Jun",high:42,medium:416,low:592},
    {day:"14 Jun",high:47,medium:448,low:618},{day:"15 Jun",high:44,medium:431,low:610},
    {day:"16 Jun",high:51,medium:486,low:648},{day:"17 Jun",high:56,medium:501,low:671},
    {day:"18 Jun",high:58,medium:512,low:677},
  ];
  const exportReport=()=>{
    const rows=["ID,Kategori,Tajuk,Lokasi,Masa,Skor AI",...demoCases.map(x=>`"${x.id}","${x.category}","${x.title}","${x.area}","${x.time}",${x.score}`)];
    const url=URL.createObjectURL(new Blob([rows.join("\n")],{type:"text/csv;charset=utf-8"}));
    const a=document.createElement("a");a.href=url;a.download="laporan-pengkelasan-ai-demo.csv";a.click();URL.revokeObjectURL(url);
    setExported(true);window.setTimeout(()=>setExported(false),2500);
  };
  const columns:[DemoCase["category"],string,string,string[]][]=[
    ["High Profile","HIGH PROFILE","58 Aduan (4.7%)",["Melibatkan sindiket / penyeludupan","Ancaman keselamatan negara","Kesalahan berulang / riwayat jenayah","Dokumen palsu / penipuan"]],
    ["Medium","MEDIUM (SEDERHANA)","512 Aduan (41.1%)",["PATI bekerja tanpa dokumen sah","Bekerja tanpa permit / melanggar pas","Tinggal melebihi tempoh dibenarkan","Aktiviti mencurigakan di premis"]],
    ["Low","LOW (RENDAH)","677 Aduan (54.3%)",["Pertanyaan prosedur atau pentadbiran","Maklumat am tentang imigresen","Cadangan / maklum balas awam","Isu bukan kesalahan imigresen"]],
  ];
  return <section className="classification-view">
    <div className="class-heading"><div><h2>☑ {tr(lang,"AI PENGKELASAN KATEGORI ADUAN","AI COMPLAINT CLASSIFICATION")}</h2><p>{tr(lang,"Klasifikasi pintar aduan berdasarkan analisis risiko, impak keselamatan dan parameter sindiket.","Smart complaint classification based on risk analysis, security impact and syndicate indicators.")}</p></div><button onClick={exportReport}>⇩ {tr(lang,"Eksport Laporan","Export Report")}</button></div>
    <div className="class-kpis">
      <ClassKpi label="JUMLAH ADUAN DIPROSES" value="1,247 Kes" sub="100% daripada jumlah aduan"/>
      <ClassKpi tone="high" label="HIGH PROFILE" value="58 Kes" sub="▲ 4.7% dari semalam"/>
      <ClassKpi tone="medium" label="MEDIUM (SEDERHANA)" value="512 Kes" sub="▲ 41.1% dari semalam"/>
      <ClassKpi tone="low" label="LOW (RENDAH)" value="677 Kes" sub="▲ 54.3% dari semalam"/>
      <ClassKpi tone="accuracy" label="TAHAP KETEPATAN AI" value="92.4%" sub="▲ 5% dari minggu lepas"/>
    </div>
    <div className="source-strip"><b>SUMBER DATA ADUAN (MULTI-SOURCE):</b>{[["SISPAA",512,"41%"],["E-mel",298,"24%"],["Surat",126,"10%"],["Walk-in",152,"12%"],["Telefon",98,"8%"],["Lokasi GPS",61,"5%"]].map(([n,c,p],i)=><span key={String(n)}><i className={`src-dot s${i}`}/>{n} <em>{c} · {p}</em></span>)}</div>
    <div className="class-content">
      <div className="category-columns">{columns.map(([key,label,total,features])=><article key={key} className={`category-column ${key.toLowerCase().replace(" ","-")}`}><div><span className="category-tag">{label}</span><h3>{total}</h3><p>{key==="High Profile"?"Isu berimpak tinggi yang memerlukan tindak balas segera dan koordinasi operasi.":key==="Medium"?"Isu berimpak sederhana yang memerlukan semakan dokumen dan tindakan penguatkuasaan.":"Isu berimpak rendah yang lebih kepada maklumat, khidmat nasihat atau pertanyaan sokongan."}</p></div><div className="feature-list"><b>CIRI-CIRI UTAMA</b><ul>{features.map(f=><li key={f}>{f}</li>)}</ul></div><div className="recent-cases"><b>CONTOH ADUAN TERKINI</b>{demoCases.filter(x=>x.category===key).slice(0,3).map(x=><div key={x.id}><span><strong>{x.title}</strong><small>{x.id} · {x.area} · {x.time}</small></span><em>{x.score}%</em></div>)}</div><button onClick={()=>setSelected(key)}>Lihat Senarai Penuh ({key==="High Profile"?58:key==="Medium"?512:677})</button></article>)}</div>
      <aside className="class-charts"><article><h3>TABURAN KATEGORI ADUAN</h3><div className="distribution"><div className="class-donut"><span><small>JUMLAH</small><b>1,247</b></span></div><div className="distribution-legend"><span><b>58</b>HIGH PROFILE · 4.7%</span><span><b>512</b>MEDIUM · 41.1%</span><span><b>677</b>LOW · 54.3%</span></div></div></article><article><h3>⌁ TREND PENGKELASAN (7 HARI)</h3><div className="trend-bars">{trend.map(x=><div key={x.day} className="trend-day" title={`${x.day}: High ${x.high}, Medium ${x.medium}, Low ${x.low}`}><div><i className="bar high" style={{height:`${Math.max(8,x.high/7)}%`}}/><i className="bar medium" style={{height:`${x.medium/7}%`}}/><i className="bar low" style={{height:`${x.low/7}%`}}/></div><small>{x.day.replace(" Jun","")}</small></div>)}</div><div className="trend-legend"><span>● High</span><em>● Medium</em><b>● Low</b></div></article><article className="ai-insight"><h3>✦ RUMUSAN AI HARI INI</h3><p><b>Chow Kit dan Pudu</b> merekodkan peningkatan aduan berisiko tinggi. Model mencadangkan semakan silang 23 aduan sebelum penugasan operasi malam.</p><span>Keyakinan cadangan: 92.4%</span></article></aside>
    </div>
    {selected&&<div className="case-modal" role="dialog" aria-modal="true" aria-label={`Senarai ${selected}`}><div><button className="modal-close" onClick={()=>setSelected(null)} aria-label="Tutup senarai">×</button><span className={`category-tag ${selected.toLowerCase().replace(" ","-")}`}>{selected}</span><h2>Senarai Aduan {selected}</h2><p>Rekod demo terkini untuk menunjukkan pengalaman semakan pegawai.</p><div className="modal-table"><div className="table-head"><span>ID Aduan</span><span>Ringkasan</span><span>Lokasi / Masa</span><span>Skor AI</span></div>{demoCases.filter(x=>x.category===selected).map(x=><div key={x.id}><b>{x.id}</b><span>{x.title}</span><span>{x.area}<small>{x.time}</small></span><em>{x.score}%</em></div>)}</div><button className="modal-done" onClick={()=>setSelected(null)}>Selesai Semakan</button></div></div>}
    {exported&&<div className="toast admin-toast" role="status">✓ Laporan CSV demo telah dieksport</div>}
  </section>
}

function ClassKpi({label,value,sub,tone=""}:{label:string;value:string;sub:string;tone?:string}){return <article className={`class-kpi ${tone}`}><small>{label}</small><b>{value}</b><span>{sub}</span></article>}

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

function Tracking(){const [ref,setRef]=useState("IM.W01/W-ES/5/VI/26/493"); const [submittedRef,setSubmittedRef]=useState(ref); const checkStatus=()=>{if(ref.trim())setSubmittedRef(ref.trim())}; return <div className="content-page"><div className="intro"><span>SEMAKAN ADUAN</span><h1>Jejaki status aduan anda</h1><p>Masukkan nombor rujukan yang diterima selepas aduan dihantar.</p></div><div className="track-search"><input value={ref} onChange={e=>setRef(e.target.value)} onKeyDown={e=>e.key==="Enter"&&checkStatus()} aria-label="Nombor rujukan"/><button onClick={checkStatus} disabled={!ref.trim()}>Semak Status</button></div><div key={submittedRef} className="status-card status-refresh"><div className="status-head"><div><small>NO. RUJUKAN</small><b>{submittedRef}</b></div><span>DALAM TINDAKAN</span></div><div className="timeline"><div className="done"><i>✓</i><b>Aduan diterima</b><small>18 Jun 2025 · 10:24 AM</small></div><div className="done"><i>✓</i><b>Semakan awal selesai</b><small>18 Jun 2025 · 11:10 AM</small></div><div className="current"><i>3</i><b>Dalam tindakan unit operasi</b><small>Dikemas kini 19 Jun 2025 · 9:30 AM</small></div><div><i>4</i><b>Keputusan</b><small>Menunggu tindakan</small></div></div><div className="officer-note"><b>Kemas kini terkini</b><p>Maklumat telah disahkan dan disalurkan kepada Unit Penguatkuasaan WPKL untuk tindakan lanjut.</p></div></div></div>}

function InfoPage({help=false}:{help?:boolean}){const items=help?["Bagaimana membuat aduan?","Maklumat apa yang diperlukan?","Bagaimana identiti saya dilindungi?","Bilakah aduan akan diproses?"]:["Aduan berkaitan pendatang asing tanpa izin","Penyalahgunaan pas atau permit","Aktiviti pemalsuan dokumen imigresen","Majikan yang menggaji pekerja tanpa permit sah"]; return <div className="content-page"><div className="intro"><span>{help?"PUSAT BANTUAN":"MAKLUMAT"}</span><h1>{help?"Kami sedia membantu":"Salurkan maklumat, bantu penguatkuasaan"}</h1><p>{help?"Jawapan ringkas untuk membantu anda menggunakan sistem e-Aduan.":"Aduan yang tepat membantu Jabatan Imigresen Malaysia merancang tindakan yang lebih berkesan."}</p></div><div className="info-grid">{items.map((x,i)=><article key={x}><span>{help?"?":i+1}</span><h3>{x}</h3><p>{help?"Klik untuk melihat penerangan dan panduan langkah demi langkah.":"Sertakan lokasi, masa kejadian dan bukti sokongan jika tersedia."}</p></article>)}</div></div>}

function Success({setView}:{setView:(v:View)=>void}){const [copied,setCopied]=useState(false); const copyRef=async()=>{const value="IM.W01/W-ES/5/VI/26/493";try{await navigator.clipboard.writeText(value)}catch{const area=document.createElement("textarea");area.value=value;document.body.appendChild(area);area.select();document.execCommand("copy");area.remove()}setCopied(true);window.setTimeout(()=>setCopied(false),2200)};return <div className="success-page"><div className="success-mark">✓</div><span>ADUAN BERJAYA DIHANTAR</span><h1>Terima kasih atas kerjasama anda</h1><p>Aduan telah direkodkan dan akan disalurkan kepada unit penguatkuasaan berkaitan.</p><div className="reference"><small>NOMBOR RUJUKAN</small><b>IM.W01/W-ES/5/VI/26/493</b><button onClick={copyRef}>{copied?"✓ Sudah disalin":"Salin nombor"}</button></div><div className="success-actions"><button className="btn primary" onClick={()=>setView("semakan")}>Semak Status Aduan</button><button className="btn ghost" onClick={()=>setView("dashboard")}>Kembali ke Utama</button></div></div>}

function AccessibilityToolbar({lang,setLang,theme,setTheme,fontSize,setFontSize}:{lang:Lang;setLang:(v:Lang)=>void;theme:Theme;setTheme:(v:Theme)=>void;fontSize:FontSize;setFontSize:(v:FontSize)=>void}){
  return <div className="accessibility-toolbar" role="region" aria-label={tr(lang,"Tetapan paparan","Display settings")}>
    <strong>{tr(lang,"Paparan","Display")}</strong>
    <div className="access-group" aria-label={tr(lang,"Saiz tulisan","Text size")}><span>{tr(lang,"Tulisan","Text")}</span>{(["normal","large","xlarge"] as FontSize[]).map((x,i)=><button key={x} className={fontSize===x?"active":""} onClick={()=>setFontSize(x)} aria-label={`${tr(lang,"Saiz tulisan","Text size")} ${i+1}`}>{i===0?"A−":i===1?"A":"A+"}</button>)}</div>
    <div className="access-group theme-switch" aria-label={tr(lang,"Tema warna","Colour theme")}><button className={theme==="light"?"active":""} onClick={()=>setTheme("light")}>☀ {tr(lang,"Cerah","Light")}</button><button className={theme==="dark"?"active":""} onClick={()=>setTheme("dark")}>● {tr(lang,"Gelap","Dark")}</button></div>
    <div className="access-group language-switch" aria-label={tr(lang,"Pilihan bahasa","Language selection")}><button className={lang==="BM"?"active":""} onClick={()=>setLang("BM")}>BM</button><button className={lang==="EN"?"active":""} onClick={()=>setLang("EN")}>ENGLISH</button></div>
  </div>
}

export default function Home(){
  const [view,setView]=useState<View>("dashboard"); const [lang,setLang]=useState<Lang>("BM"); const [theme,setTheme]=useState<Theme>("dark"); const [fontSize,setFontSize]=useState<FontSize>("large");
  useEffect(()=>{const saved=window.localStorage.getItem("jim-display-preferences");if(saved){try{const p=JSON.parse(saved);if(p.lang)setLang(p.lang);if(p.theme)setTheme(p.theme);if(p.fontSize)setFontSize(p.fontSize)}catch{}}},[]);
  useEffect(()=>{window.localStorage.setItem("jim-display-preferences",JSON.stringify({lang,theme,fontSize}))},[lang,theme,fontSize]);
  const portal=view!=="dashboard"; const content=useMemo(()=>{if(view==="aduan")return <ComplaintForm setView={setView}/>;if(view==="semakan")return <Tracking/>;if(view==="maklumat")return <InfoPage/>;if(view==="bantuan")return <InfoPage help/>;if(view==="berjaya")return <Success setView={setView}/>;return <Dashboard setView={setView} lang={lang}/>},[view,lang]);
  return <div className={`experience-root theme-${theme} font-${fontSize}`} lang={lang==="BM"?"ms":"en"}><AccessibilityToolbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} fontSize={fontSize} setFontSize={setFontSize}/><div className="app-surface">{portal&&<PortalHeader view={view} setView={setView} lang={lang}/>} {content}{portal&&<footer><span>{tr(lang,"© 2025 Jabatan Imigresen Malaysia. Hak Cipta Terpelihara.","© 2025 Immigration Department of Malaysia. All Rights Reserved.")}</span><span>{tr(lang,"Dasar Privasi　|　Terma Penggunaan　|　Panduan Pengguna","Privacy Policy　|　Terms of Use　|　User Guide")}</span><span>{tr(lang,"Demo pengalaman pelanggan","Customer experience demo")}</span></footer>}</div></div>
}
