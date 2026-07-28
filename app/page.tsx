"use client";

import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";

type View = "dashboard" | "aduan" | "semakan" | "maklumat" | "bantuan" | "berjaya";
type Lang = "BM" | "EN";
type Theme = "dark" | "light";
type FontSize = "normal" | "large" | "xlarge";
type UserRole = "management" | "complaints" | "operations";
type AdminRole = Exclude<UserRole,"complaints">;
type AdminMenu = "Dashboard" | "Operasi" | "AI Pengkelasan" | "AI Cadangan" | "AI Pengesahan" | "Hasil Operasi" | "Peta Hotspot" | "Laporan" | "Notifikasi" | "Tetapan";

const demoAccounts:{role:UserRole;name:string;nameEn:string;email:string;password:string;scope:string;scopeEn:string}[] = [
  {role:"management",name:"Pengurusan Atasan",nameEn:"Senior Management",email:"atasan@imigresen.gov.my",password:"Atasan123!",scope:"Dashboard pemantauan sahaja",scopeEn:"Monitoring dashboard only"},
  {role:"complaints",name:"Unit Aduan",nameEn:"Complaints Unit",email:"aduan@imigresen.gov.my",password:"Aduan123!",scope:"Aduan, semakan dan maklumat",scopeEn:"Complaints, tracking and information"},
  {role:"operations",name:"Unit Operasi",nameEn:"Operations Unit",email:"operasi@imigresen.gov.my",password:"Operasi123!",scope:"Operasi, analisis dan hotspot",scopeEn:"Operations, analysis and hotspots"},
];

const roleName=(role:UserRole,lang:Lang)=>{const account=demoAccounts.find(x=>x.role===role)!;return tr(lang,account.name,account.nameEn)};

const complaintViews:View[]=["aduan","semakan","maklumat","bantuan"];
const adminMenus:Record<AdminRole,[string,AdminMenu][]>={
  management:[["▦","Dashboard"]],
  operations:[["⌘","Operasi"],["▥","AI Pengkelasan"],["✦","AI Cadangan"],["◎","AI Pengesahan"],["⚑","Hasil Operasi"],["⌖","Peta Hotspot"],["▤","Laporan"],["♢","Notifikasi"],["⚙","Tetapan"]],
};

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

function PortalHeader({ view, setView, lang, role, onLogout }: { view: View; setView: (v: View) => void; lang: Lang; role: "complaints"; onLogout: () => void }) {
  const navLabels: Record<View, string> = {
    dashboard: tr(lang,"Utama","Home"), aduan: tr(lang,"Aduan","Complaint"), semakan: tr(lang,"Semakan","Tracking"),
    maklumat: tr(lang,"Maklumat","Information"), bantuan: tr(lang,"Bantuan","Help"), berjaya: tr(lang,"Berjaya","Success"),
  };
  const homeView:View="aduan";
  return (
    <header className="portal-header">
      <button className="brand" onClick={() => setView(homeView)} aria-label={tr(lang,"Kembali ke halaman utama unit","Return to unit home")}>
        <img src="/logo-jim-official.svg" alt="Logo rasmi Jabatan Imigresen Malaysia" />
        <span><b>JABATAN IMIGRESEN MALAYSIA</b><small>{tr(lang,"e-Aduan Penguatkuasaan","e-Enforcement Complaint")}</small></span>
      </button>
      <nav aria-label="Navigasi utama">
        {complaintViews.map((item) => (
          <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}>
            {navLabels[item]}
          </button>
        ))}
      </nav>
      <div className="header-tools"><span className="role-chip">{roleName(role,lang)}</span><span className="avatar">UA</span><button className="logout-compact" onClick={onLogout}>{tr(lang,"Log Keluar","Sign Out")}</button></div>
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

function Dashboard({ setView, lang, role, onLogout }: { setView: (v: View) => void; lang: Lang; role: AdminRole; onLogout: () => void }) {
  const homeMenu=role==="operations"?"Operasi":"Dashboard";
  const [activeMenu, setActiveMenu] = useState(homeMenu);
  const [adminNotice, setAdminNotice] = useState("");
  const [period, setPeriod] = useState<"Hari Ini"|"7 Hari"|"30 Hari">("Hari Ini");
  const [liveMode, setLiveMode] = useState(true);
  const [hotspot, setHotspot] = useState(0);
  const [lastSync, setLastSync] = useState("3:52 PM");
  const [workspacePanel,setWorkspacePanel]=useState<"Laporan"|"Notifikasi"|"Tetapan"|null>(null);
  const [unreadNotifications,setUnreadNotifications]=useState(3);
  const periodData={
    "Hari Ini":{received:"1,050",process:"350",done:"700",critical:"50",response:"2.1 jam",ops:"24",arrests:"156",newCases:"12",score:"66.6%",sources:[["SISPAA","431","41%"],["E-MEL","252","24%"],["SURAT","105","10%"],["HADIR (WALK IN)","126","12%"],["TELEFON","84","8%"],["LOKASI GPS","52","5%"]],categories:{high:"50",medium:"430",low:"570"}},
    "7 Hari":{received:"7,842",process:"1,306",done:"6,478",critical:"214",response:"2.4 jam",ops:"137",arrests:"684",newCases:"68",score:"90%",sources:[["SISPAA","3,214","41%"],["E-MEL","1,882","24%"],["SURAT","784","10%"],["HADIR (WALK IN)","942","12%"],["TELEFON","628","8%"],["LOKASI GPS","392","5%"]],categories:{high:"214",medium:"3,156",low:"4,472"}},
    "30 Hari":{received:"31,608",process:"3,914",done:"27,122",critical:"906",response:"2.8 jam",ops:"528",arrests:"2,431",newCases:"286",score:"88%",sources:[["SISPAA","12,959","41%"],["E-MEL","7,586","24%"],["SURAT","3,161","10%"],["HADIR (WALK IN)","3,793","12%"],["TELEFON","2,529","8%"],["LOKASI GPS","1,580","5%"]],categories:{high:"906",medium:"12,844",low:"17,858"}},
  }[period];
  const hotspotData=[
    {name:"KL Sentral",cases:156,risk:"Tinggi",detail:"Puncak aduan 9:00 AM – 1:00 PM",lat:3.1343,lon:101.6861,x:"37%",y:"66%"},
    {name:"Pudu",cases:132,risk:"Tinggi",detail:"Peningkatan PATI dan dokumen tamat tempoh",lat:3.1347,lon:101.7136,x:"68%",y:"64%"},
    {name:"Chow Kit",cases:98,risk:"Tinggi",detail:"23 aduan memerlukan semakan silang",lat:3.1671,lon:101.6981,x:"50%",y:"25%"},
    {name:"Bukit Bintang",cases:76,risk:"Sederhana",detail:"Aktiviti tertumpu di premis perniagaan",lat:3.1468,lon:101.7113,x:"65%",y:"48%"},
    {name:"Brickfields",cases:65,risk:"Sederhana",detail:"Trend stabil dalam tempoh 24 jam",lat:3.1291,lon:101.6841,x:"34%",y:"74%"},
  ];
  const notify=(message:string)=>{setAdminNotice(message);window.setTimeout(()=>setAdminNotice(""),2800)};
  const changePeriod=(next:"Hari Ini"|"7 Hari"|"30 Hari")=>{setPeriod(next);setLastSync(new Date().toLocaleTimeString("en-MY",{hour:"numeric",minute:"2-digit"}));notify(tr(lang,`Paparan dikemas kini kepada tempoh ${next}`,`Dashboard updated to ${next}`))};
  const exportOperations=()=>{const rows=["Metrik,Nilai,Tempoh",`Aduan diterima,${periodData.received},${period}`,`Aduan dalam proses,${periodData.process},${period}`,`Aduan selesai,${periodData.done},${period}`,`Operasi dijalankan,${periodData.ops},${period}`,`Tangkapan,${periodData.arrests},${period}`];const url=URL.createObjectURL(new Blob([rows.join("\n")],{type:"text/csv;charset=utf-8"}));const a=document.createElement("a");a.href=url;a.download="laporan-operasi-jim-demo.csv";a.click();URL.revokeObjectURL(url);notify(tr(lang,"Laporan operasi berjaya dieksport","Operations report exported"))};
  const side=adminMenus[role];
  const allowedMenus=new Set(side.map(([,label])=>label));
  const sideEn: Record<string,string> = {Dashboard:"Dashboard",Aduan:"Complaints",Operasi:"Operations","AI Pengkelasan":"AI Classification","AI Cadangan":"AI Recommendations","AI Pengesahan":"AI Validation","Hasil Operasi":"Operation Results","Peta Hotspot":"Hotspot Map",Laporan:"Reports",Notifikasi:"Notifications",Tetapan:"Settings"};
  const sideLabel=(label:string)=>lang==="BM"?label:(sideEn[label]||label);
  const moduleMeta: Record<string,{title:string;titleEn:string;description:string;descriptionEn:string;code:string;kpis:[string,string][]}> = {
    Operasi:{title:"Pengurusan Operasi",titleEn:"Operations Management",description:"Pantau tugasan aktif, penggunaan sumber dan kemajuan tindakan penguatkuasaan.",descriptionEn:"Monitor active assignments, resource deployment and enforcement progress.",code:"OPS",kpis:[["Operasi aktif",periodData.ops],["Aduan diproses",periodData.process],["Masa respons",periodData.response]]},
    "AI Pengkelasan":{title:"Pengkelasan Kategori Aduan",titleEn:"Complaint Category Classification",description:"Analisis kategori, tahap risiko dan ketepatan pengkelasan bagi semua aduan diterima.",descriptionEn:"Analyse categories, risk levels and classification accuracy for all received complaints.",code:"KELAS",kpis:[["Diproses",periodData.received],["High Profile",periodData.categories.high],["Ketepatan","92.4%"]]},
    "AI Cadangan":{title:"Cadangan Operasi",titleEn:"Operation Recommendations",description:"Semak cadangan tindakan berasaskan pola aduan sebelum dihantar kepada penyelia.",descriptionEn:"Review recommendations based on complaint patterns before sending them to a supervisor.",code:"CAD",kpis:[["Cadangan baharu","12"],["Keutamaan tinggi","4"],["Keyakinan","92%"]]},
    "AI Pengesahan":{title:"Pengesahan Cadangan",titleEn:"Recommendation Validation",description:"Sahkan kesesuaian cadangan, sumber dan tahap risiko sebelum tindakan diluluskan.",descriptionEn:"Validate recommendation suitability, resources and risk before approval.",code:"SAH",kpis:[["Menunggu semakan","8"],["Disahkan","92%"],["Risiko rendah","86%"]]},
    "Hasil Operasi":{title:"Hasil dan Prestasi Operasi",titleEn:"Operation Results & Performance",description:"Nilai hasil operasi, tangkapan dan notis mengikut tempoh laporan.",descriptionEn:"Review operations, arrests and notices by reporting period.",code:"HAS",kpis:[["Operasi",periodData.ops],["Tangkapan",periodData.arrests],["Prestasi",periodData.score]]},
    "Peta Hotspot":{title:"Peta Hotspot Kuala Lumpur",titleEn:"Kuala Lumpur Hotspot Map",description:"Teroka taburan aduan dan lokasi berisiko untuk perancangan operasi lapangan.",descriptionEn:"Explore complaint distribution and risk locations for field planning.",code:"PETA",kpis:[["Hotspot aktif","5"],["Risiko tinggi","3"],["Lokasi dipilih",hotspotData[hotspot].name]]},
  };
  const focusedModule=moduleMeta[activeMenu];
  const moduleClass=activeMenu==="Operasi"?"module-operasi":activeMenu==="AI Cadangan"?"module-cadangan":activeMenu==="AI Pengesahan"?"module-pengesahan":activeMenu==="Hasil Operasi"?"module-hasil":activeMenu==="Peta Hotspot"?"module-peta":"module-dashboard";
  const handleMenu = (label: string) => {
    if(!allowedMenus.has(label)){notify(tr(lang,"Akses tidak dibenarkan untuk akaun ini","This account is not permitted to access that module"));return;}
    setActiveMenu(label);
    setWorkspacePanel(null);
    if (label === "Aduan") { setView("aduan"); return; }
    if (label === "Dashboard") { document.querySelector(".dashboard-main")?.scrollTo({ top: 0 }); return; }
    if (label === "AI Pengkelasan") { setAdminNotice(`${periodData.received} aduan demo telah dikelaskan`); window.setTimeout(() => setAdminNotice(""), 2800); return; }
    if (label === "Laporan" || label === "Notifikasi" || label === "Tetapan") { setWorkspacePanel(label); return; }
    document.querySelector(".dashboard-main")?.scrollTo({ top: 0 });
    setAdminNotice(tr(lang,`Halaman ${label} dibuka`,` ${sideLabel(label)} page opened`));
    window.setTimeout(() => setAdminNotice(""), 2800);
  };
  return (
    <main className="admin-shell">
      <aside className="sidebar">
        <div className="admin-brand"><img src="/logo-jim-official.svg" alt="Logo rasmi Jabatan Imigresen Malaysia"/><span><b>JABATAN IMIGRESEN MALAYSIA</b><small>WILAYAH PERSEKUTUAN KUALA LUMPUR</small></span></div>
        <div className="side-nav">{side.map(([ic,label])=><button key={label} className={activeMenu===label?"active":""} onClick={()=>handleMenu(label)} aria-label={`${tr(lang,"Buka","Open")} ${sideLabel(label)}`}><Icon>{ic}</Icon>{sideLabel(label)}{label==="Notifikasi"&&unreadNotifications>0&&<em>{unreadNotifications}</em>}</button>)}</div>
      </aside>
      <section className="dashboard-main">
        <div className="dash-topbar"><div><span className={`live-dot ${liveMode?"":"paused"}`}/> {liveMode?tr(lang,"DATA LANGSUNG AKTIF","LIVE DATA ACTIVE"):tr(lang,"KEMAS KINI DIJEDA","UPDATES PAUSED")}</div><div>18 JUN 2025 <i/> {tr(lang,"Sinkron terakhir","Last synced")} {lastSync} <span className="role-chip">{roleName(role,lang)}</span><span className="avatar">{role==="management"?"PA":"UO"}</span><button className="logout-compact" onClick={onLogout}>{tr(lang,"Log Keluar","Sign Out")}</button></div></div>
        <div className={`role-scope-banner scope-${role}`} role="status"><b>{tr(lang,"SKOP AKSES","ACCESS SCOPE")}</b><span>{role==="management"?tr(lang,"Dashboard Pengurusan Atasan sahaja · Tiada akses kepada borang aduan atau ruang kerja operasi","Senior Management Dashboard only · No access to complaint forms or the operations workspace"):tr(lang,"Ruang kerja Unit Operasi sahaja · Tiada akses kepada borang aduan atau dashboard Pengurusan Atasan","Operations Unit workspace only · No access to complaint forms or the Senior Management dashboard")}</span></div>
        <section className="command-hero"><div><span className="eyebrow">{tr(lang,"PUSAT KAWALAN · WPKL","COMMAND CENTRE · WPKL")} / {sideLabel(activeMenu)}</span><h1>{focusedModule?tr(lang,focusedModule.title,focusedModule.titleEn):tr(lang,"Dashboard Operasi Jabatan Imigresen","Immigration Operations Dashboard")}</h1><p className="hero-greeting">{focusedModule?tr(lang,focusedModule.description,focusedModule.descriptionEn):<>{tr(lang,"Selamat petang, Muhammad Faiz.","Good afternoon, Muhammad Faiz.")} <span>{tr(lang,"Pantau aduan, risiko dan keberkesanan operasi dalam satu paparan masa nyata.","Monitor complaints, risks and operational effectiveness in one real-time view.")}</span></>}</p><p className="period-summary" aria-live="polite">{tr(lang,"Paparan semasa","Current view")}: <b>{period}</b> · {periodData.received} {tr(lang,"aduan","complaints")}</p></div><div className="hero-controls"><div className="period-switch" aria-label={tr(lang,"Tempoh laporan","Report period")}>{(["Hari Ini","7 Hari","30 Hari"] as const).map(x=><button key={x} className={period===x?"active":""} aria-pressed={period===x} onClick={()=>changePeriod(x)}>{x==="Hari Ini"?tr(lang,x,"Today"):x==="7 Hari"?tr(lang,x,"7 Days"):tr(lang,x,"30 Days")}</button>)}</div><button className={`live-toggle ${liveMode?"active":""}`} onClick={()=>{setLiveMode(v=>!v);notify(liveMode?tr(lang,"Auto-kemas kini dijeda","Auto refresh paused"):tr(lang,"Auto-kemas kini diaktifkan","Auto refresh enabled"))}}><i/> {liveMode?"Live":tr(lang,"Dijeda","Paused")}</button><button className="refresh-btn" onClick={()=>{setLastSync(new Date().toLocaleTimeString("en-MY",{hour:"numeric",minute:"2-digit"}));notify(tr(lang,"Dashboard dikemas kini dengan data demo terbaru","Dashboard refreshed with the latest demo data"))}}>↻ {tr(lang,"Segar Semula","Refresh")}</button></div></section>
        <div className="demo-bar"><span><b>{tr(lang,"DEMO INTERAKTIF","INTERACTIVE DEMO")}</b> {tr(lang,"Data simulasi untuk pengalaman pelanggan","Simulated data for customer experience")}</span>{role==="operations"&&<div className="demo-actions"><button className="outline" onClick={()=>setActiveMenu(activeMenu==="AI Pengkelasan"?homeMenu:"AI Pengkelasan")}>{activeMenu==="AI Pengkelasan"?tr(lang,"Kembali Operasi","Back to Operations"):tr(lang,"AI Pengkelasan","AI Classification")}</button></div>}</div>
        {focusedModule&&<section className="module-summary" aria-label={tr(lang,"Ringkasan halaman","Page summary")}><div className="module-identity"><span>{focusedModule.code}</span><div><small>{tr(lang,"MODUL OPERASI","OPERATIONS MODULE")}</small><h2>{tr(lang,focusedModule.title,focusedModule.titleEn)}</h2></div></div><div className="module-kpis">{focusedModule.kpis.map(([label,value])=><article key={label}><small>{label}</small><b>{value}</b></article>)}</div>{activeMenu!==homeMenu&&<button onClick={()=>setActiveMenu(homeMenu)}>← {tr(lang,"Kembali ke Operasi","Back to Operations")}</button>}</section>}
        {activeMenu==="AI Pengkelasan"?<ClassificationDemo lang={lang}/>:<><div className="activity-ribbon"><span><i className="pulse"/> {tr(lang,"Sistem menerima","System received")} <b>{periodData.newCases} {tr(lang,"aduan baharu","new complaints")}</b> · {period}</span><span>✦ AI {tr(lang,"mengklasifikasi","classified")} <b>98.7%</b> {tr(lang,"tanpa semakan manual","without manual review")}</span><span>⌖ {tr(lang,"Hotspot aktif","Active hotspot")}: <b>{hotspotData[hotspot].name}</b></span></div><section className={`stats-row period-updated ${["Dashboard","Operasi","Hasil Operasi"].includes(activeMenu)?"":"module-hidden"}`} key={period}>
          <StatCard icon="✓" label={tr(lang,"JUMLAH ADUAN DITERIMA","TOTAL COMPLAINTS RECEIVED")} value={periodData.received} trend={tr(lang,"▲ 18.6% dari tempoh lalu","▲ 18.6% from previous period")}/>
          <StatCard icon="◉" label={tr(lang,"ADUAN DALAM PROSES","COMPLAINTS IN PROGRESS")} value={periodData.process} trend={tr(lang,"▲ 12.3% dari tempoh lalu","▲ 12.3% from previous period")}/>
          <StatCard icon="◈" label={tr(lang,"ADUAN SELESAI","COMPLETED COMPLAINTS")} value={periodData.done} trend={period==="Hari Ini"?tr(lang,"66.6% daripada jumlah aduan","66.6% of total complaints"):tr(lang,"▲ 15.9% dari tempoh lalu","▲ 15.9% from previous period")}/>
          <StatCard icon="⌁" label={tr(lang,"PURATA MASA RESPONS","AVERAGE RESPONSE TIME")} value={periodData.response.replace("jam",tr(lang,"jam","hrs"))} trend={tr(lang,"▼ 8% lebih pantas","▼ 8% faster")}/>
          <StatCard icon="⚠" label={tr(lang,"ADUAN KRITIKAL (HIGH)","CRITICAL COMPLAINTS (HIGH)")} value={periodData.critical} trend={tr(lang,"▼ 5% dari tempoh lalu","▼ 5% from previous period")} danger/>
          <article className="stat-card score"><div className="mini-ring"><b>{periodData.score}</b></div><div><small>{tr(lang,"PRESTASI OPERASI","OPERATION PERFORMANCE")}</small><span className="green">{tr(lang,"Sangat Baik","Excellent")}</span></div></article>
        </section>
        <section className={`dash-grid ${moduleClass}`}>
          <article className="dash-panel source-panel"><PanelTitle n="1" title="SUMBER PENERIMAAN ADUAN"/><div className="source-body"><ul>{periodData.sources.map(([name,count,share])=><li key={name}><button onClick={()=>notify(`${count} aduan diterima melalui ${name} · ${period}`)}><b>{name}</b><span>{count}</span><em>{share}</em></button></li>)}</ul><button className="donut donut-button" onClick={()=>role==="operations"?setActiveMenu("AI Pengkelasan"):notify(tr(lang,"Pecahan kategori dipaparkan pada dashboard","Category breakdown is shown on the dashboard"))} aria-label={`Buka pecahan ${periodData.received} aduan`}><span><b>{periodData.received}</b>JUMLAH<small>Lihat butiran →</small></span></button></div></article>
          <article className="dash-panel category-panel"><PanelTitle n="2" title="PENGKELASAN KATEGORI ADUAN"/><div className="category-body"><div className="category-donut"><span><b>{periodData.received}</b>JUMLAH</span></div><ul><li><i className="high"/>HIGH PROFILE <b>{periodData.categories.high}</b></li><li><i className="medium"/>MEDIUM <b>{periodData.categories.medium}</b></li><li><i className="low"/>LOW <b>{periodData.categories.low}</b></li></ul></div><div className="alert-strip">HIGH PROFILE ALERT <b>{periodData.categories.high}</b></div></article>
          <article className="dash-panel map-panel"><PanelTitle n="3" title="ANALISIS HOTSPOT – ADUAN SPATIAL"/><div className="heat-map real-kl-map"><iframe key={hotspotData[hotspot].name} className="real-map-frame" title={`Peta ${hotspotData[hotspot].name}, Kuala Lumpur`} loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=101.665%2C3.110%2C101.730%2C3.180&layer=mapnik&marker=${hotspotData[hotspot].lat}%2C${hotspotData[hotspot].lon}`}/><div className="map-dim"/>{hotspotData.map((x,i)=><div key={x.name} className={`map-marker ${hotspot===i?"active":""} ${x.risk==="Tinggi"?"high":"medium"}`} style={{left:x.x,top:x.y}}><button type="button" className="map-marker-target" onClick={()=>setHotspot(i)} aria-pressed={hotspot===i} aria-label={`${x.name}, ${x.cases} aduan, risiko ${x.risk}`}><i>{i+1}</i></button><span>{x.name}</span></div>)}<div className="map-focus"><small>LOKASI DIPILIH · {hotspotData[hotspot].lat.toFixed(4)}, {hotspotData[hotspot].lon.toFixed(4)}</small><strong>{hotspotData[hotspot].name} · {hotspotData[hotspot].cases} aduan</strong><span>{hotspotData[hotspot].detail}</span><a href={`https://www.openstreetmap.org/?mlat=${hotspotData[hotspot].lat}&mlon=${hotspotData[hotspot].lon}#map=16/${hotspotData[hotspot].lat}/${hotspotData[hotspot].lon}`} target="_blank" rel="noreferrer">Buka peta penuh ↗</a></div><a className="map-attribution" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a></div><ol>{hotspotData.map((x,i)=><li key={x.name} className={hotspot===i?"active":""}><button type="button" aria-pressed={hotspot===i} onClick={()=>setHotspot(i)}><span><b>{i+1}. {x.name}</b><small>{x.cases} aduan · {x.lat.toFixed(4)}, {x.lon.toFixed(4)}</small></span><em>{x.risk}</em></button></li>)}</ol></article>
          <article className="dash-panel ai-panel"><PanelTitle n="4" title="AI CADANGAN OPERASI"/><div className="recommend"><span>⌖</span><p><b>Peruntukan anggota tambahan di KL Sentral</b><small>Berdasarkan corak aduan tinggi antara 9:00 AM – 1:00 PM</small></p><em>TINGGI</em>{role==="operations"&&<button onClick={()=>notify("Cadangan KL Sentral dihantar kepada penyelia operasi")}>Aktifkan</button>}</div><div className="recommend"><span>◈</span><p><b>Ops Tapis di Chow Kit</b><small>Peningkatan aduan berkaitan PATI dan dokumen tamat tempoh</small></p><em>SEDERHANA</em>{role==="operations"&&<button onClick={()=>notify("Cadangan Ops Tapis ditambah ke pelan operasi")}>Aktifkan</button>}</div><div className="confidence"><span>KEYAKINAN AI</span><i/><b>92%</b></div></article>
          <article className="dash-panel approval-panel"><PanelTitle n="5" title="AI PENGESAHAN"/><div className="big-ring"><span><b>92%</b>DISAHKAN</span></div><ul><li>Relevan dengan trend aduan <b>✓ Disahkan</b></li><li>Sumber mencukupi <b>✓ Disahkan</b></li><li>Risiko operasi <b>✓ Rendah</b></li></ul></article>
          <article className="dash-panel results-panel"><PanelTitle n="6" title={`HASIL OPERASI · ${period.toUpperCase()}`}/><div className="result-kpis"><span><small>OPERASI DIJALANKAN</small><b>{periodData.ops}</b></span><span><small>TANGKAPAN</small><b>{periodData.arrests}</b></span><span><small>NOTIS DIBERIKAN</small><b>{period==="Hari Ini"?"312":period==="7 Hari"?"1,426":"5,908"}</b></span></div><div className="line-chart"><i/><i/><i/><i/><i/><i/></div><div className="legend">● Operasi　<span>● Tangkapan</span>　<em>● Notis</em></div></article>
        </section></>}
        {workspacePanel&&<div className="workspace-modal" role="dialog" aria-modal="true" aria-labelledby="workspace-title" onMouseDown={e=>{if(e.target===e.currentTarget)setWorkspacePanel(null)}}><section><div className="workspace-head"><div><span>{tr(lang,"MODUL OPERASI","OPERATIONS MODULE")}</span><h2 id="workspace-title">{sideLabel(workspacePanel)}</h2></div><button onClick={()=>setWorkspacePanel(null)} aria-label={tr(lang,"Tutup modul","Close module")}>×</button></div>
          {workspacePanel==="Laporan"&&<div className="workspace-content"><p>{tr(lang,`Ringkasan prestasi bagi tempoh ${period}.`,`Performance summary for ${period}.`)}</p><div className="workspace-kpis"><span><small>{tr(lang,"Aduan diterima","Complaints received")}</small><b>{periodData.received}</b></span><span><small>{tr(lang,"Operasi","Operations")}</small><b>{periodData.ops}</b></span><span><small>{tr(lang,"Tangkapan","Arrests")}</small><b>{periodData.arrests}</b></span><span><small>{tr(lang,"Prestasi","Performance")}</small><b>92%</b></span></div><button className="workspace-primary" onClick={exportOperations}>⇩ {tr(lang,"Eksport Laporan CSV","Export CSV Report")}</button></div>}
          {workspacePanel==="Notifikasi"&&<div className="workspace-content"><div className="notification-list"><article><i className="critical">!</i><div><b>{tr(lang,"Aduan berisiko tinggi diterima","High-risk complaint received")}</b><small>IM-KL-2025-0618-093 · Chow Kit · 3:42 PM</small></div><em>{tr(lang,"Kritikal","Critical")}</em></article><article><i>⌖</i><div><b>{tr(lang,"Hotspot Pudu meningkat 18%","Pudu hotspot increased by 18%")}</b><small>{tr(lang,"Dikemas kini 12 minit lalu","Updated 12 minutes ago")}</small></div><em>{tr(lang,"Amaran","Warning")}</em></article><article><i className="done">✓</i><div><b>{tr(lang,"Operasi IM-24-0618 selesai","Operation IM-24-0618 completed")}</b><small>{tr(lang,"156 tangkapan direkodkan","156 arrests recorded")}</small></div><em>{tr(lang,"Selesai","Completed")}</em></article></div><button className="workspace-primary" onClick={()=>{setUnreadNotifications(0);notify(tr(lang,"Semua notifikasi ditandakan telah dibaca","All notifications marked as read"))}}>✓ {tr(lang,"Tandakan Semua Dibaca","Mark All as Read")}</button></div>}
          {workspacePanel==="Tetapan"&&<div className="workspace-content"><p>{tr(lang,"Kawalan paparan rasmi tersedia pada bar di bahagian atas skrin.","Official display controls are available in the bar at the top of the screen.")}</p><div className="settings-list"><span><b>{tr(lang,"Bahasa semasa","Current language")}</b><em>{lang==="BM"?"Bahasa Melayu":"English"}</em></span><span><b>{tr(lang,"Saiz tulisan","Text size")}</b><em>{tr(lang,"Boleh dilaraskan A− / A / A+","Adjustable A− / A / A+")}</em></span><span><b>{tr(lang,"Tema paparan","Display theme")}</b><em>{tr(lang,"Mod cerah dan gelap tersedia","Light and dark modes available")}</em></span></div><button className="workspace-primary" onClick={()=>{setWorkspacePanel(null);(document.querySelector(".accessibility-toolbar button") as HTMLElement|null)?.focus()}}>{tr(lang,"Buka Kawalan Paparan","Open Display Controls")}</button></div>}
        </section></div>}
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
    {day:"18 Jun",high:50,medium:430,low:570},
  ];
  const exportReport=()=>{
    const rows=["ID,Kategori,Tajuk,Lokasi,Masa,Skor AI",...demoCases.map(x=>`"${x.id}","${x.category}","${x.title}","${x.area}","${x.time}",${x.score}`)];
    const url=URL.createObjectURL(new Blob([rows.join("\n")],{type:"text/csv;charset=utf-8"}));
    const a=document.createElement("a");a.href=url;a.download="laporan-pengkelasan-ai-demo.csv";a.click();URL.revokeObjectURL(url);
    setExported(true);window.setTimeout(()=>setExported(false),2500);
  };
  const columns:[DemoCase["category"],string,string,string[]][]=[
    ["High Profile","HIGH PROFILE","50 Aduan (4.8%)",["Melibatkan sindiket / penyeludupan","Ancaman keselamatan negara","Kesalahan berulang / riwayat jenayah","Dokumen palsu / penipuan"]],
    ["Medium","MEDIUM (SEDERHANA)","430 Aduan (41.0%)",["PATI bekerja tanpa dokumen sah","Bekerja tanpa permit / melanggar pas","Tinggal melebihi tempoh dibenarkan","Aktiviti mencurigakan di premis"]],
    ["Low","LOW (RENDAH)","570 Aduan (54.2%)",["Pertanyaan prosedur atau pentadbiran","Maklumat am tentang imigresen","Cadangan / maklum balas awam","Isu bukan kesalahan imigresen"]],
  ];
  return <section className="classification-view">
    <div className="class-heading"><div><h2>☑ {tr(lang,"AI PENGKELASAN KATEGORI ADUAN","AI COMPLAINT CLASSIFICATION")}</h2><p>{tr(lang,"Klasifikasi pintar aduan berdasarkan analisis risiko, impak keselamatan dan parameter sindiket.","Smart complaint classification based on risk analysis, security impact and syndicate indicators.")}</p></div><button onClick={exportReport}>⇩ {tr(lang,"Eksport Laporan","Export Report")}</button></div>
    <div className="class-kpis">
      <ClassKpi label="JUMLAH ADUAN DIPROSES" value="1,050 Kes" sub="100% daripada jumlah aduan"/>
      <ClassKpi tone="high" label="HIGH PROFILE" value="50 Kes" sub="4.8% daripada jumlah aduan"/>
      <ClassKpi tone="medium" label="MEDIUM (SEDERHANA)" value="430 Kes" sub="41.0% daripada jumlah aduan"/>
      <ClassKpi tone="low" label="LOW (RENDAH)" value="570 Kes" sub="54.2% daripada jumlah aduan"/>
      <ClassKpi tone="accuracy" label="TAHAP KETEPATAN AI" value="92.4%" sub="▲ 5% dari minggu lepas"/>
    </div>
    <div className="source-strip"><b>SUMBER DATA ADUAN (MULTI-SOURCE):</b>{[["SISPAA",431,"41%"],["E-mel",252,"24%"],["Surat",105,"10%"],["Walk-in",126,"12%"],["Telefon",84,"8%"],["Lokasi GPS",52,"5%"]].map(([n,c,p],i)=><span key={String(n)}><i className={`src-dot s${i}`}/>{n} <em>{c} · {p}</em></span>)}</div>
    <div className="class-content">
      <div className="category-columns">{columns.map(([key,label,total,features])=><article key={key} className={`category-column ${key.toLowerCase().replace(" ","-")}`}><div><span className="category-tag">{label}</span><h3>{total}</h3><p>{key==="High Profile"?"Isu berimpak tinggi yang memerlukan tindak balas segera dan koordinasi operasi.":key==="Medium"?"Isu berimpak sederhana yang memerlukan semakan dokumen dan tindakan penguatkuasaan.":"Isu berimpak rendah yang lebih kepada maklumat, khidmat nasihat atau pertanyaan sokongan."}</p></div><div className="feature-list"><b>CIRI-CIRI UTAMA</b><ul>{features.map(f=><li key={f}>{f}</li>)}</ul></div><div className="recent-cases"><b>CONTOH ADUAN TERKINI</b>{demoCases.filter(x=>x.category===key).slice(0,3).map(x=><div key={x.id}><span><strong>{x.title}</strong><small>{x.id} · {x.area} · {x.time}</small></span><em>{x.score}%</em></div>)}</div><button onClick={()=>setSelected(key)}>Lihat Senarai Penuh ({key==="High Profile"?50:key==="Medium"?430:570})</button></article>)}</div>
      <aside className="class-charts"><article><h3>TABURAN KATEGORI ADUAN</h3><div className="distribution"><div className="class-donut"><span><small>JUMLAH</small><b>1,050</b></span></div><div className="distribution-legend"><span><b>50</b>HIGH PROFILE · 4.8%</span><span><b>430</b>MEDIUM · 41.0%</span><span><b>570</b>LOW · 54.2%</span></div></div></article><article><h3>⌁ TREND PENGKELASAN (7 HARI)</h3><div className="trend-bars">{trend.map(x=><div key={x.day} className="trend-day" title={`${x.day}: High ${x.high}, Medium ${x.medium}, Low ${x.low}`}><div><i className="bar high" style={{height:`${Math.max(8,x.high/7)}%`}}/><i className="bar medium" style={{height:`${x.medium/7}%`}}/><i className="bar low" style={{height:`${x.low/7}%`}}/></div><small>{x.day.replace(" Jun","")}</small></div>)}</div><div className="trend-legend"><span>● High</span><em>● Medium</em><b>● Low</b></div></article><article className="ai-insight"><h3>✦ RUMUSAN AI HARI INI</h3><p><b>Chow Kit dan Pudu</b> merekodkan peningkatan aduan berisiko tinggi. Model mencadangkan semakan silang 23 aduan sebelum penugasan operasi malam.</p><span>Keyakinan cadangan: 92.4%</span></article></aside>
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

function DemoLogin({lang,onLogin}:{lang:Lang;onLogin:(role:UserRole)=>void}){
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [showPassword,setShowPassword]=useState(false); const [error,setError]=useState("");
  const selectedAccount=demoAccounts.find(x=>x.email===email.trim().toLowerCase());
  const submit=(e:FormEvent)=>{e.preventDefault();const account=demoAccounts.find(x=>x.email===email.trim().toLowerCase()&&x.password===password);if(account){setError("");onLogin(account.role)}else setError(tr(lang,"ID atau kata laluan demo tidak tepat. Pilih salah satu akaun di bawah.","Incorrect demo ID or password. Select one of the accounts below."))};
  const fillDemo=(account:(typeof demoAccounts)[number])=>{setEmail(account.email);setPassword(account.password);setError("")};
  return <main className="login-page"><section className="login-brand-panel"><div className="login-official"><img src="/logo-jim-official.svg" alt="Logo rasmi Jabatan Imigresen Malaysia"/><div><b>JABATAN IMIGRESEN MALAYSIA</b><span>WILAYAH PERSEKUTUAN KUALA LUMPUR</span></div></div><div className="login-intro"><span>{tr(lang,"SISTEM ADUAN PINTAR","SMART COMPLAINT SYSTEM")}</span><h1>{tr(lang,"Pusat Kawalan Operasi Bersepadu","Integrated Operations Control Centre")}</h1><p>{tr(lang,"Tiga peranan demo dengan akses khusus untuk pengurusan, aduan dan operasi.","Three demo roles with dedicated access for management, complaints and operations.")}</p><div className="login-features">{demoAccounts.map(x=><span key={x.role}><i>✓</i>{tr(lang,x.name,x.nameEn)} — {tr(lang,x.scope,x.scopeEn)}</span>)}</div></div><small className="login-classification">DEMO PELANGGAN · BUKAN SISTEM PRODUKSI</small></section><section className="login-form-panel"><div className="login-card role-login-card"><div className="login-card-head"><span>{tr(lang,"AKSES BERASASKAN PERANAN","ROLE-BASED ACCESS")}</span><h2>{tr(lang,"Log masuk ke Sistem Aduan Pintar","Sign in to Smart Complaint System")}</h2><p>{tr(lang,"Pilih akaun demo mengikut unit untuk mengisi ID dan kata laluan secara automatik.","Select a unit account to fill the ID and password automatically.")}</p></div><div className="role-account-list" aria-label={tr(lang,"Pilihan akaun demo","Demo account choices")}>{demoAccounts.map(account=><button type="button" key={account.role} className={selectedAccount?.role===account.role?"selected":""} aria-pressed={selectedAccount?.role===account.role} onClick={()=>fillDemo(account)}><span><b>{tr(lang,account.name,account.nameEn)}</b><small>{tr(lang,account.scope,account.scopeEn)}</small></span><em>{account.email}</em><code>{account.password}</code></button>)}</div><form onSubmit={submit}><label><span>{tr(lang,"ID / Alamat e-mel","ID / Email address")}</span><div className="login-input"><i>✉</i><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="unit@imigresen.gov.my" autoComplete="username" required/></div></label><label><span>{tr(lang,"Kata laluan","Password")}</span><div className="login-input"><i>●</i><input type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder="Masukkan kata laluan" autoComplete="current-password" required/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label={tr(lang,"Tunjuk atau sembunyikan kata laluan","Show or hide password")}>{showPassword?tr(lang,"Sembunyi","Hide"):tr(lang,"Lihat","Show")}</button></div></label>{error&&<div className="login-error" role="alert">⚠ {error}</div>}<button className="login-submit" type="submit">{tr(lang,"Log Masuk Demo","Demo Sign In")} →</button></form><p className="login-disclaimer">ⓘ {tr(lang,"Tiada akses pelawat. Kawalan peranan ini ialah simulasi demonstrasi dan bukan pengesahan identiti sebenar.","Guest access is disabled. These role controls are a demonstration and not real identity verification.")}</p></div></section></main>
}

function AccessibilityToolbar({lang,setLang,theme,setTheme,fontSize,setFontSize}:{lang:Lang;setLang:(v:Lang)=>void;theme:Theme;setTheme:(v:Theme)=>void;fontSize:FontSize;setFontSize:(v:FontSize)=>void}){
  return <div className="accessibility-toolbar" role="region" aria-label={tr(lang,"Tetapan paparan","Display settings")}>
    <strong>{tr(lang,"Paparan","Display")}</strong>
    <div className="access-group" aria-label={tr(lang,"Saiz tulisan","Text size")}><span>{tr(lang,"Tulisan","Text")}</span>{(["normal","large","xlarge"] as FontSize[]).map((x,i)=><button key={x} className={fontSize===x?"active":""} onClick={()=>setFontSize(x)} aria-label={`${tr(lang,"Saiz tulisan","Text size")} ${i+1}`}>{i===0?"A−":i===1?"A":"A+"}</button>)}</div>
    <div className="access-group theme-switch" aria-label={tr(lang,"Tema warna","Colour theme")}><button className={theme==="light"?"active":""} onClick={()=>setTheme("light")}>☀ {tr(lang,"Cerah","Light")}</button><button className={theme==="dark"?"active":""} onClick={()=>setTheme("dark")}>● {tr(lang,"Gelap","Dark")}</button></div>
    <div className="access-group language-switch" aria-label={tr(lang,"Pilihan bahasa","Language selection")}><button className={lang==="BM"?"active":""} onClick={()=>setLang("BM")}>BM</button><button className={lang==="EN"?"active":""} onClick={()=>setLang("EN")}>ENGLISH</button></div>
  </div>
}

export default function Home(){
  const [view,setView]=useState<View>("dashboard"); const [lang,setLang]=useState<Lang>("BM"); const [theme,setTheme]=useState<Theme>("dark"); const [fontSize,setFontSize]=useState<FontSize>("large"); const [role,setRole]=useState<UserRole|null>(null);
  useEffect(()=>{const saved=window.localStorage.getItem("jim-display-preferences");if(saved){try{const p=JSON.parse(saved);if(p.lang)setLang(p.lang);if(p.theme)setTheme(p.theme);if(p.fontSize)setFontSize(p.fontSize)}catch{}}},[]);
  useEffect(()=>{window.localStorage.setItem("jim-display-preferences",JSON.stringify({lang,theme,fontSize}))},[lang,theme,fontSize]);
  const login=(nextRole:UserRole)=>{setRole(nextRole);setView(nextRole==="complaints"?"aduan":"dashboard")}; const logout=()=>{setView("dashboard");setRole(null)};
  const setAuthorizedView=(next:View)=>{if(role==="complaints"){setView(([...complaintViews,"berjaya"] as View[]).includes(next)?next:"aduan")}else setView("dashboard")};
  const content=useMemo(()=>{if(role==="complaints"){if(view==="semakan")return <Tracking/>;if(view==="maklumat")return <InfoPage/>;if(view==="bantuan")return <InfoPage help/>;if(view==="berjaya")return <Success setView={setAuthorizedView}/>;return <ComplaintForm setView={setAuthorizedView}/>}if(role==="management"||role==="operations")return <Dashboard setView={setAuthorizedView} lang={lang} role={role} onLogout={logout}/>;return null},[view,lang,role]);
  return <div className={`experience-root theme-${theme} font-${fontSize}`} lang={lang==="BM"?"ms":"en"}><AccessibilityToolbar lang={lang} setLang={setLang} theme={theme} setTheme={setTheme} fontSize={fontSize} setFontSize={setFontSize}/><div className="app-surface">{!role?<DemoLogin lang={lang} onLogin={login}/>:<>{role==="complaints"&&<><PortalHeader view={view} setView={setAuthorizedView} lang={lang} role={role} onLogout={logout}/><div className="role-scope-banner scope-complaints portal-scope" role="status"><b>{tr(lang,"SKOP AKSES","ACCESS SCOPE")}</b><span>{tr(lang,"Unit Aduan sahaja · Aduan, semakan status, maklumat dan bantuan","Complaints Unit only · Complaints, status tracking, information and help")}</span></div></>} {content}{role==="complaints"&&<footer><span>{tr(lang,"© 2025 Jabatan Imigresen Malaysia. Hak Cipta Terpelihara.","© 2025 Immigration Department of Malaysia. All Rights Reserved.")}</span><span>{tr(lang,"Dasar Privasi　|　Terma Penggunaan　|　Panduan Pengguna","Privacy Policy　|　Terms of Use　|　User Guide")}</span><span>{roleName(role,lang)} · {tr(lang,"Demo pengalaman pelanggan","Customer experience demo")}</span></footer>}</>}</div></div>
}
