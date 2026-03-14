import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AdminLayout } from "../../components/layouts";
import { Card, Badge, Button, Typography } from "../../components/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import { Users, Droplet, Building2, Clock, CheckCircle2, XCircle, TrendingUp, Activity, Loader2, Phone, Mail, MapPin, FileText, ExternalLink, Info } from "lucide-react";
import { motion } from "motion/react";
import { getAdminStatsApi, getPendingHospitalsApi, verifyHospitalApi, deleteAccountApi } from "../../api";

function ClockIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

const ACTIVITIES = [
  { time: "10:42", text: "Nouvelle demande critique publiée", entity: "CMA Pissy", type: "alert" },
  { time: "09:15", text: "Don de sang confirmé", entity: "John Doe · O+", type: "success" },
  { time: "Hier", text: "Compte hôpital validé", entity: "Clinique Sandof", type: "success" },
  { time: "Hier", text: "Rapport mensuel généré", entity: "Super Admin", type: "info" },
  { time: "Il y a 3j", text: "Nouveau donneur inscrit", entity: "+226 70 12 34 56", type: "info" },
];

const ACTIVITY_STYLES = {
  alert: { dot: "bg-[#CC0000]", bg: "bg-[#FFF0F0]", text: "text-[#CC0000]" },
  success: { dot: "bg-[#1A7A3F]", bg: "bg-[#F0FFF4]", text: "text-[#1A7A3F]" },
  info: { dot: "bg-[#5B5BD6]", bg: "bg-[#F5F5FF]", text: "text-[#5B5BD6]" },
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [pendingHospitals, setPendingHospitals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [statsData, hospitalsData] = await Promise.all([
        getAdminStatsApi(),
        getPendingHospitalsApi(),
      ]);
      setStats(statsData);
      setPendingHospitals(hospitalsData);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async (id: string) => {
    setProcessingId(id);
    try {
      await verifyHospitalApi(id);
      setPendingHospitals(pendingHospitals.filter(h => h._id !== id));
      // Refresh stats
      const newStats = await getAdminStatsApi();
      setStats(newStats);
    } catch (error) {
      alert("Erreur lors de la validation.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment rejeter et supprimer cette demande d'inscription ?")) return;
    setProcessingId(id);
    try {
      await deleteAccountApi(id, "Hospital");
      setPendingHospitals(pendingHospitals.filter(h => h._id !== id));
    } catch (error) {
      alert("Erreur lors de la suppression.");
    } finally {
      setProcessingId(null);
    }
  };

  const statCards = [
    { label: "Hôpitaux inscrits", value: stats?.hopitaux || "0", sub: "Total base de données", icon: Building2, bg: "bg-[#F5F5FF]", iconColor: "text-[#5B5BD6]", accent: "#5B5BD6" },
    { label: "En attente validation", value: stats?.hopitauxEnAttente || "0", sub: "Action requise", icon: ClockIcon, bg: "bg-[#FFF8F0]", iconColor: "text-[#D4720B]", accent: "#D4720B" },
    { label: "Donneurs inscrits", value: stats?.utilisateurs || "0", sub: "Réseau national", icon: Users, bg: "bg-[#F0FFF4]", iconColor: "text-[#1A7A3F]", accent: "#1A7A3F" },
    { label: "Dons réalisés", value: stats?.dons || "0", sub: "Toutes périodes", icon: Droplet, bg: "bg-[#FFF0F0]", iconColor: "text-[#CC0000]", accent: "#CC0000" },
  ];

  return (
    <AdminLayout>
      {/* ── Header ──────────────────────────────────── */}
      <div className="mb-8">
        <p className="text-[11px] font-semibold text-[#AAAAAA] uppercase tracking-widest mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Vue nationale
        </p>
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] md:text-[34px] font-bold text-[#0A0A0A] leading-tight" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Tableau de bord Admin 🛡️
          </h1>
          <Button variant="ghost" size="sm" onClick={fetchData} disabled={isLoading} className="text-[#CC0000]">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualiser"}
          </Button>
        </div>
        <p className="text-[14px] text-[#888888] mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          Gérez le réseau SangVie au niveau national · {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* ── Stats Grid ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
          >
            <Card className="flex flex-col gap-3 hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] transition-all duration-200 hover:-translate-y-0.5 min-h-[140px]">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-[#DDDDDD]" />
              </div>
              <div>
                <p className="text-[12px] text-[#AAAAAA] font-medium mb-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {stat.label}
                </p>
                <p className="text-[28px] font-bold text-[#0A0A0A] leading-none" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {stat.value}
                </p>
                <p className="text-[11px] font-semibold mt-1" style={{ fontFamily: "'DM Sans', sans-serif", color: stat.accent }}>
                  {stat.sub}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ── Main Grid ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pending hospitals */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EBEBEB] overflow-hidden shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
          <div className="px-6 py-5 border-b border-[#F0F0F0] flex items-center justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[#0A0A0A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Hôpitaux en attente
              </h2>
              <p className="text-[12px] text-[#AAAAAA] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Vérifiez les agréments avant validation
              </p>
            </div>
            <Badge variant="pending" className="text-[11px]">
              {pendingHospitals.length} en attente
            </Badge>
          </div>

          <div className="divide-y divide-[#F5F5F5]">
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-8 h-8 text-[#CC0000] animate-spin" />
                <p className="text-sm text-[#AAAAAA]">Chargement des demandes...</p>
              </div>
            ) : pendingHospitals.length === 0 ? (
              <div className="p-12 text-center text-[#AAAAAA] text-sm italic">
                Aucune demande en attente de validation.
              </div>
            ) : (
              pendingHospitals.map((hosp) => (
                <motion.div
                  key={hosp._id}
                  layout
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#FAFAFA] transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-[#F0F0F0] flex items-center justify-center flex-shrink-0 text-[#888888] font-bold text-[12px]">
                    {hosp.nom.substring(0, 2).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-[#111111] truncate" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {hosp.nom}
                    </p>
                    <p className="text-[12px] text-[#AAAAAA] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {hosp.region} · Agrément: {hosp.numeroAgrement}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      disabled={processingId === hosp._id}
                      onClick={() => handleDelete(hosp._id)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-[#CC0000] bg-[#FFF0F0] hover:bg-[#CC0000] hover:text-white transition-all disabled:opacity-50"
                      title="Rejeter"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                     <button
                      disabled={processingId === hosp._id}
                      onClick={() => handleVerify(hosp._id)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-[#1A7A3F] bg-[#F0FFF4] hover:bg-[#1A7A3F] hover:text-white transition-all disabled:opacity-50"
                      title="Valider"
                    >
                      {processingId === hosp._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => setSelectedHospital(hosp)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-[#555555] bg-[#F5F5F7] hover:bg-[#111111] hover:text-white transition-all"
                      title="Détails"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <div className="px-6 py-4 border-t border-[#F5F5F5]">
            <Button variant="secondary" size="sm" className="w-full text-[13px]" onClick={() => navigate("/admin/hospitals")}>
              Voir tous les hôpitaux →
            </Button>
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] shadow-[0_1px_8px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden">
          <div className="px-5 py-5 border-b border-[#F0F0F0] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#CC0000]" />
            <h2 className="text-[16px] font-bold text-[#0A0A0A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Activité système
            </h2>
          </div>

          <div className="flex-1 p-5">
            <div className="relative flex flex-col gap-5 before:absolute before:left-[13px] before:top-2 before:bottom-2 before:w-px before:bg-[#F0F0F0]">
              {ACTIVITIES.map((act, i) => {
                const style = ACTIVITY_STYLES[act.type as keyof typeof ACTIVITY_STYLES];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.06 }}
                    className="flex gap-4 relative z-10"
                  >
                    {/* Dot */}
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${style.bg}`}>
                      <div className={`w-2 h-2 rounded-full ${style.dot}`} />
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-[#111111] leading-snug" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {act.text}
                      </p>
                      <p className="text-[11px] text-[#AAAAAA] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                        {act.entity} · {act.time}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          <div className="px-5 pb-5">
            <Button variant="secondary" size="sm" className="w-full text-[13px]">
              Voir tous les logs
            </Button>
          </div>
        </div>
      </div>

      {/* Hospital Details Modal (Shared with AdminHospitals but here for simplicity) */}
      <Dialog open={!!selectedHospital} onOpenChange={(open) => !open && setSelectedHospital(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
          {selectedHospital && (
            <div className="flex flex-col">
              <div className="bg-gradient-to-br from-[#CC0000] to-[#990000] p-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-2xl">
                    {selectedHospital.nom.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold font-sans">{selectedHospital.nom}</h2>
                    <div className="flex items-center gap-2 mt-1 opacity-90">
                      <Badge variant="pending" className="bg-white/20 border-white/30 text-white">En attente de validation</Badge>
                      <span className="text-xs font-medium">Demande reçue le {new Date(selectedHospital.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-widest block mb-2">Contact</label>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-[#333333]">
                        <Phone className="w-4 h-4 text-[#CC0000]" />
                        <span className="font-semibold">{selectedHospital.contact}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-[#333333]">
                        <Mail className="w-4 h-4 text-[#CC0000]" />
                        <span className="font-semibold">{selectedHospital.email}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-widest block mb-2">Localisation</label>
                    <div className="flex items-start gap-3 text-sm text-[#333333]">
                      <MapPin className="w-4 h-4 text-[#CC0000] mt-0.5" />
                      <div>
                        <p className="font-semibold">{selectedHospital.region}</p>
                        <p className="text-[#888888]">{selectedHospital.localisation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-bold text-[#AAAAAA] uppercase tracking-widest block mb-2">Agrément</label>
                    <div className="p-4 rounded-2xl bg-[#F9F9FB] border border-[#F0F0F2]">
                      <div className="flex items-center gap-3 mb-3">
                        <FileText className="w-8 h-8 text-[#CC0000]" />
                        <div>
                          <p className="text-xs font-bold text-[#111111]">N° {selectedHospital.numeroAgrement}</p>
                          <p className="text-[10px] text-[#888888]">Document officiel</p>
                        </div>
                      </div>
                      <Button variant="secondary" size="sm" className="w-full text-[11px] h-8 bg-white">
                        <ExternalLink className="w-3 h-3 mr-2" />
                        Voir le scan
                      </Button>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#FFE8CC]">
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 h-9 text-xs" 
                        onClick={() => {
                          handleVerify(selectedHospital._id);
                          setSelectedHospital(null);
                        }}
                      >
                        Valider
                      </Button>
                      <Button 
                        variant="secondary" 
                        className="flex-1 h-9 text-xs text-[#CC0000]"
                        onClick={() => {
                          handleDelete(selectedHospital._id);
                          setSelectedHospital(null);
                        }}
                      >
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-[#F0F0F0] bg-[#FAFAFA] flex justify-end">
                <Button variant="secondary" onClick={() => setSelectedHospital(null)} className="rounded-xl px-8"> Fermer </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
