import { BarChart3, TrendingUp, FileCheck, AlertTriangle, IndianRupee, Building2, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import StatCard from "@/components/StatCard";
import SchemeCard from "@/components/SchemeCard";
import { useSchemes, useAllDistrictAllocations, useExpenses, formatCurrency } from "@/hooks/useSchemes";
import { useStateContext } from "@/contexts/StateContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = [
  "hsl(222, 47%, 20%)", "hsl(152, 69%, 31%)", "hsl(25, 95%, 53%)",
  "hsl(217, 91%, 60%)", "hsl(280, 60%, 50%)", "hsl(0, 72%, 51%)",
  "hsl(180, 60%, 40%)", "hsl(330, 70%, 50%)",
];

const Dashboard = () => {
  const { selectedState } = useStateContext();
  const { t } = useLanguage();
  const { data: schemes = [] } = useSchemes(undefined, selectedState);
  const { data: allocations = [] } = useAllDistrictAllocations(selectedState);
  const { data: expenses = [] } = useExpenses();

  const totalBudget = schemes.reduce((s, sc) => s + sc.total_budget, 0);
  const totalSpent = schemes.reduce((s, sc) => s + sc.spent, 0);
  const utilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const verifiedCount = expenses.filter(e => e.status === "Verified").length;
  const flaggedCount = expenses.filter(e => e.status === "Flagged").length;

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    schemes.forEach(s => { map[s.category] = (map[s.category] || 0) + s.total_budget; });
    return Object.entries(map).map(([name, value], i) => ({
      name, value: totalBudget > 0 ? Math.round(value / totalBudget * 100) : 0, fill: COLORS[i % COLORS.length],
    }));
  }, [schemes, totalBudget]);

  const stateData = useMemo(() => {
    if (selectedState !== "All India") return [];
    const map: Record<string, { allocated: number; spent: number }> = {};
    schemes.forEach(s => {
      const st = s.state || "Unknown";
      if (st === "All India") return;
      if (!map[st]) map[st] = { allocated: 0, spent: 0 };
      map[st].allocated += s.total_budget;
      map[st].spent += s.spent;
    });
    return Object.entries(map).map(([name, v]) => ({
      name: name.length > 15 ? name.slice(0, 12) + "…" : name,
      allocated: Math.round(v.allocated / 10000000),
      spent: Math.round(v.spent / 10000000),
    })).sort((a, b) => b.allocated - a.allocated).slice(0, 12);
  }, [schemes, selectedState]);

  const deptData = useMemo(() => {
    const map: Record<string, { allocated: number; spent: number }> = {};
    schemes.forEach(s => {
      if (!map[s.department]) map[s.department] = { allocated: 0, spent: 0 };
      map[s.department].allocated += s.total_budget;
      map[s.department].spent += s.spent;
    });
    return Object.entries(map).map(([name, v]) => ({
      name: name.length > 25 ? name.slice(0, 22) + "…" : name,
      allocated: Math.round(v.allocated / 10000000),
      spent: Math.round(v.spent / 10000000),
    })).sort((a, b) => b.allocated - a.allocated);
  }, [schemes]);

  const districtData = useMemo(() => {
    const map: Record<string, { allocated: number; spent: number }> = {};
    allocations.forEach(a => {
      if (!map[a.district]) map[a.district] = { allocated: 0, spent: 0 };
      map[a.district].allocated += a.allocated;
      map[a.district].spent += a.spent;
    });
    return Object.entries(map)
      .map(([name, v]) => ({ name, allocated: Math.round(v.allocated / 10000000), spent: Math.round(v.spent / 10000000) }))
      .sort((a, b) => b.allocated - a.allocated)
      .slice(0, 10);
  }, [allocations]);

  const stateLabel = selectedState === "All India" ? "All India" : selectedState;

  return (
    <div className="py-8 md:py-10">
      <div className="container space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary mb-1">Overview</p>
          <h1 className="font-display text-2xl font-bold md:text-3xl">{t("dashboard.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dashboard.subtitle")} — {stateLabel}
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={IndianRupee} title={t("stat.totalBudget")} value={formatCurrency(totalBudget)} subtitle={`${schemes.length} ${t("nav.schemes").toLowerCase()}`} variant="info" />
          <StatCard icon={TrendingUp} title={t("stat.totalSpent")} value={formatCurrency(totalSpent)} subtitle={`${utilization}% ${t("stat.utilized")}`} variant="success" />
          <StatCard icon={FileCheck} title={t("stat.verifiedExpenses")} value={String(verifiedCount)} trend={{ value: t("stat.fromDatabase"), positive: true }} variant="default" />
          <StatCard icon={AlertTriangle} title={t("stat.flaggedItems")} value={String(flaggedCount)} subtitle={t("stat.needsReview")} variant="warning" />
        </div>

        {/* Charts row */}
        <div className="grid gap-5 lg:grid-cols-3">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card lg:col-span-2">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-secondary" />
              <h3 className="font-display text-sm font-semibold">
                {selectedState === "All India" ? t("dashboard.stateAllocation") : t("dashboard.topDistricts")}
              </h3>
            </div>
            <p className="text-[11px] text-muted-foreground mb-4">{t("dashboard.budgetVsSpent")}</p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedState === "All India" ? stateData : districtData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" strokeOpacity={0.7} />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220,9%,46%)" }} angle={-25} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(220,9%,46%)" }} />
                  <Tooltip
                    formatter={(v: number) => `₹${v} Cr`}
                    contentStyle={{ borderRadius: 12, border: "1px solid hsl(220,13%,91%)", boxShadow: "0 4px 16px rgba(0,0,0,0.06)" }}
                  />
                  <Bar dataKey="allocated" fill="hsl(222,47%,20%)" radius={[6, 6, 0, 0]} name="Allocated" barSize={14} />
                  <Bar dataKey="spent" fill="hsl(152,69%,31%)" radius={[6, 6, 0, 0]} name="Spent" barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h3 className="font-display text-sm font-semibold">{t("dashboard.byCategory")}</h3>
            <p className="text-[11px] text-muted-foreground mb-2">{t("dashboard.fundDistribution")}</p>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={76} paddingAngle={3} strokeWidth={0}>
                    {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 12, border: "1px solid hsl(220,13%,91%)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 space-y-1.5">
              {categoryData.map(c => (
                <div key={c.name} className="flex items-center gap-2 text-[11px]">
                  <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: c.fill }} />
                  <span className="text-muted-foreground truncate">{c.name}</span>
                  <span className="ml-auto font-semibold text-foreground">{c.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Department chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="h-4 w-4 text-secondary" />
            <h3 className="font-display text-sm font-semibold">{t("dashboard.deptSpending")}</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" strokeOpacity={0.7} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(220,9%,46%)" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "hsl(220,9%,46%)" }} width={180} />
                <Tooltip formatter={(v: number) => `₹${v} Cr`} contentStyle={{ borderRadius: 12, border: "1px solid hsl(220,13%,91%)" }} />
                <Bar dataKey="allocated" fill="hsl(222,47%,20%)" radius={[0, 6, 6, 0]} name="Allocated" barSize={12} />
                <Bar dataKey="spent" fill="hsl(152,69%,31%)" radius={[0, 6, 6, 0]} name="Spent" barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Schemes */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary mb-2">All Programmes</p>
          <h2 className="font-display text-xl font-bold">{t("dashboard.allActiveSchemes")}</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {schemes.map((s, i) => <SchemeCard key={s.id} scheme={s} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
