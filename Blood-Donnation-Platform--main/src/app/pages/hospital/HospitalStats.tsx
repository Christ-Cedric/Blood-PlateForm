import React, { useState } from "react";
import { HospitalLayout } from "../../components/layouts";
import { TrendingUp, Users, Droplet, Calendar, Activity, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

const STATS = [
  { label: "Demandes totales", value: "48", change: "+12%", icon: Activity, bg: "bg-[#FFF0F0]", iconColor: "text-[#CC0000]", accent: "#CC0000" },
  { label: "Donneurs actifs", value: "156", change: "+8%", icon: Users, bg: "bg-[#F0FFF4]", iconColor: "text-[#1A7A3F]", accent: "#1A7A3F" },
  { label: "Poches collectées", value: "342", change: "+15%", icon: Droplet, bg: "bg-[#F5F5FF]", iconColor: "text-[#5B5BD6]", accent: "#5B5BD6" },
  { label: "Taux de réponse", value: "87%", change: "+3%", icon: TrendingUp, bg: "bg-[#FFF8F0]", iconColor: "text-[#D4720B]", accent: "#D4720B" },
];

const MONTHLY_DATA = [
  { month: "Jan", donations: 28, max: 50 },
  { month: "Fév", donations: 35, max: 50 },
  { month: "Mar", donations: 42, max: 50 },
  { month: "Avr", donations: 38, max: 50 },
  { month: "Mai", donations: 45, max: 50 },
  { month: "Jun", donations: 52, max: 60 },
];

const BLOOD_GROUPS = [
  { group: "O+", count: 89, percentage: 26, color: "#CC0000" },
  { group: "A+", count: 72, percentage: 21, color: "#D4720B" },
  { group: "B+", count: 58, percentage: 17, color: "#5B5BD6" },
  { group: "AB+", count: 34, percentage: 10, color: "#1A7A3F" },
  { group: "O-", count: 31, percentage: 9, color: "#CC0000" },
  { group: "A-", count: 28, percentage: 8, color: "#D4720B" },
];

const ACTIVITY_LOG = [
  { action: "Nouvelle demande publiée", detail: "O+ · 3 poches", time: "Il y a 5 min", dot: "bg-[#CC0000]" },
  { action: "Donneur confirmé", detail: "Jean Dupont · A+", time: "Il y a 15 min", dot: "bg-[#1A7A3F]" },
  { action: "Demande satisfaite", detail: "B+ · 2 poches", time: "Il y a 1h", dot: "bg-[#1A7A3F]" },
  { action: "Nouveau donneur inscrit", detail: "Marie Kaboré", time: "Il y a 2h", dot: "bg-[#5B5BD6]" },
];

export function HospitalStats() {
  const [period, setPeriod] = useState<"week" | "month" | "year">("month");
  const maxVal = Math.max(...MONTHLY_DATA.map((d) => d.donations));

  return (
    <HospitalLayout>
      <div className="max-w-6xl mx-auto">

        {/* ── Header ──────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[11px] font-semibold text-[#AAAAAA] uppercase tracking-widest mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Analytiques
            </p>
            <h1 className="text-[26px] font-bold text-[#0A0A0A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Statistiques
            </h1>
          </div>
          {/* Period selector */}
          <div className="flex bg-[#F0F0F0] rounded-xl p-1 gap-1">
            {(["week", "month", "year"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${
                  period === p ? "bg-white text-[#0A0A0A] shadow-sm" : "text-[#888888] hover:text-[#555555]"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {p === "week" ? "Semaine" : p === "month" ? "Mois" : "Année"}
              </button>
            ))}
          </div>
        </div>

        {/* ── KPI Cards ───────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-[#EBEBEB] p-5 shadow-[0_1px_8px_rgba(0,0,0,0.05)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.09)] transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
                <span className="flex items-center gap-0.5 text-[11px] font-bold text-[#1A7A3F] bg-[#F0FFF4] px-2 py-0.5 rounded-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  <ArrowUpRight className="w-3 h-3" />
                  {stat.change}
                </span>
              </div>
              <p className="text-[28px] font-bold text-[#0A0A0A] leading-none mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {stat.value}
              </p>
              <p className="text-[12px] text-[#AAAAAA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Charts row ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Bar chart — monthly */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EBEBEB] p-6 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-[15px] font-bold text-[#0A0A0A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Évolution mensuelle
                </h2>
                <p className="text-[12px] text-[#AAAAAA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Nombre de dons collectés
                </p>
              </div>
              <Calendar className="w-4 h-4 text-[#CCCCCC]" />
            </div>

            {/* Chart */}
            <div className="flex items-end justify-between gap-2 h-40">
              {MONTHLY_DATA.map((data, i) => {
                const pct = (data.donations / maxVal) * 100;
                return (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[11px] font-bold text-[#333333]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {data.donations}
                    </span>
                    <div className="w-full relative flex items-end bg-[#F5F5F5] rounded-lg" style={{ height: "100px" }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                        className="w-full rounded-lg"
                        style={{ background: `linear-gradient(180deg, #CC0000, #990000)` }}
                      />
                    </div>
                    <span className="text-[11px] text-[#AAAAAA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {data.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blood group distribution */}
          <div className="bg-white rounded-2xl border border-[#EBEBEB] p-6 shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
            <h2 className="text-[15px] font-bold text-[#0A0A0A] mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Groupes sanguins
            </h2>
            <p className="text-[12px] text-[#AAAAAA] mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Répartition des dons
            </p>
            <div className="space-y-3">
              {BLOOD_GROUPS.map((bg, i) => (
                <div key={bg.group}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[13px] font-bold text-[#333333]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {bg.group}
                    </span>
                    <span className="text-[12px] text-[#AAAAAA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                      {bg.count} · <strong style={{ color: bg.color }}>{bg.percentage}%</strong>
                    </span>
                  </div>
                  <div className="w-full bg-[#F5F5F5] rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${bg.percentage}%` }}
                      transition={{ delay: 0.4 + i * 0.06, duration: 0.6, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: bg.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Activity log ────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#EBEBEB] shadow-[0_1px_8px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="px-6 py-5 border-b border-[#F0F0F0] flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-[#0A0A0A]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Activité récente
            </h2>
            <button className="text-[12px] font-semibold text-[#CC0000] hover:underline" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              Voir tout →
            </button>
          </div>
          <div className="divide-y divide-[#F8F8F8]">
            {ACTIVITY_LOG.map((act, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.06 }}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${act.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#111111]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {act.action}
                  </p>
                  <p className="text-[11px] text-[#AAAAAA]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    {act.detail}
                  </p>
                </div>
                <span className="text-[11px] text-[#CCCCCC] flex-shrink-0" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {act.time}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </HospitalLayout>
  );
}
