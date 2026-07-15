import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import ComplaintWizard from "./components/ComplaintWizard";
import ComplaintListView from "./components/ComplaintListView";
import HotspotMapView from "./components/HotspotMapView";
import AIPengkelasanView from "./components/AIPengkelasanView";
import { Complaint, OperationRecommendation } from "./types";
import { Loader2 } from "lucide-react";

export default function App() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [recommendations, setRecommendations] = useState<OperationRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Cross-view filters
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>("");
  const [selectedKategoriFilter, setSelectedKategoriFilter] = useState<string>("Semua");

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [complaintsRes, recsRes] = await Promise.all([
        fetch("/api/aduan"),
        fetch("/api/cadangan")
      ]);

      if (complaintsRes.ok && recsRes.ok) {
        const complaintsData = await complaintsRes.json();
        const recsData = await recsRes.json();
        setComplaints(complaintsData);
        setRecommendations(recsData);
      } else {
        console.error("Failed to fetch initial prototype data");
      }
    } catch (err) {
      console.error("Network error fetching prototype data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Post new complaint to server and trigger AI classification
  const handleAddComplaint = async (formData: any): Promise<Complaint> => {
    const res = await fetch("/api/aduan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    if (!res.ok) {
      throw new Error("Failed to submit new complaint");
    }

    const newComplaint: Complaint = await res.json();
    
    // Add to state
    setComplaints(prev => [newComplaint, ...prev]);

    // Refresh recommendations since a new complaint triggers updated suggestions
    try {
      const recsRes = await fetch("/api/cadangan");
      if (recsRes.ok) {
        const recsData = await recsRes.json();
        setRecommendations(recsData);
      }
    } catch (err) {
      console.error("Failed to refresh recommendations automatically:", err);
    }

    return newComplaint;
  };

  // Regenerate recommendations with fresh Gemini prompt
  const handleRegenerateRecs = async () => {
    try {
      const res = await fetch("/api/cadangan/regenerate", { method: "POST" });
      if (res.ok) {
        const freshRecs = await res.json();
        setRecommendations(freshRecs);
      }
    } catch (err) {
      console.error("Regeneration error:", err);
    }
  };

  // Approve a recommendation
  const handleApproveRec = (id: string) => {
    setRecommendations(prev => 
      prev.map(r => r.id === id ? { ...r, status: "Disahkan" } : r)
    );
  };

  // Reject a recommendation
  const handleRejectRec = (id: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  // Callback when a hotspot is clicked on the map or dashboard lists
  const handleSelectMapLocation = (loc: string) => {
    setSelectedLocationFilter(loc);
    setCurrentView("aduan-senarai");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-slate-800 font-sans space-y-4">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold font-display uppercase tracking-wider text-slate-900">e-Aduan Penguatkuasaan v2.0</h3>
          <p className="text-xs text-slate-500">Memuat naik Pangkalan Data &amp; Menghubungkan Enjin Pintar AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-900 font-sans">
      
      {/* Navigation Sidebar */}
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden h-full">
        {currentView === "dashboard" && (
          <DashboardView 
            complaints={complaints} 
            recommendations={recommendations} 
            setCurrentView={setCurrentView}
            onSelectMapLocation={handleSelectMapLocation}
            onRegenerateRecs={handleRegenerateRecs}
            onApproveRec={handleApproveRec}
          />
        )}

        {currentView === "aduan-baru" && (
          <ComplaintWizard 
            onSubmit={handleAddComplaint}
            onSuccess={() => {
              setCurrentView("aduan-senarai");
            }}
          />
        )}

        {currentView === "aduan-senarai" && (
          <ComplaintListView 
            complaints={complaints} 
            setCurrentView={setCurrentView}
            selectedLocationFilter={selectedLocationFilter}
            onClearLocationFilter={() => setSelectedLocationFilter("")}
          />
        )}

        {currentView === "peta-hotspot" && (
          <HotspotMapView 
            recommendations={recommendations}
            onRegenerateRecs={handleRegenerateRecs}
            onApproveRec={handleApproveRec}
            onRejectRec={handleRejectRec}
            onSelectMapLocation={handleSelectMapLocation}
          />
        )}

        {currentView === "ai-pengkelasan" && (
          <AIPengkelasanView 
            complaints={complaints}
            setCurrentView={setCurrentView}
            onSelectKategoriFilter={(kat) => {
              setSelectedKategoriFilter(kat);
            }}
          />
        )}
      </div>

    </div>
  );
}
