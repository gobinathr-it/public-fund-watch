import { BarChart3, TrendingUp, Building2, PieChart as PieIcon, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import StatCard from "@/components/StatCard";
import { useSchemes, useAllDistrictAllocations, formatCurrency } from "@/hooks/useSchemes";
import { useStateContext } from "@/contexts/StateContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
];

const AnalyticsPage = () => {
  const { selectedState } = useStateContext();
  const { t } = useLanguage();
  const { data: schemes = [] } = useSchemes(undefined, selectedState);
  const { data: allocations = [] } = useAllDistrictAllocations(selectedState);

  const totalBudget = schemes.reduce((s, sc) => s + sc.total_budget, 0);
  const totalSpent = schemes.reduce((s, sc) => s + sc.spent, 0);
  const utilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const stateCount = new Set(schemes.map(s => s.state).filter(Boolean)).size;

  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    schemes.forEach(s => { map[s.category] = (map[s.category] || 0) + s.total_budget; });
    return Object.entries(map).map(([name, value], i) => ({
      name, value: totalBudget > 0 ? Math.round(value / totalBudget * 100) : 0, fill: COLORS[i % COLORS.length],
    }));
  }, [schemes, totalBudget]);

  const deptData = useMemo(() => {
    const map: Record<string, { allocated: number; spent: number }> = {};
    schemes.forEach(s => {
      if (!map[s.department]) map[s.department] = { allocated: 0, spent: 0 };
      map[s.department].allocated += s.total_budget;
      map[s.department].spent += s.spent;
    });
    return Object.entries(map).map(([name, v]) => ({
      name: name.length > 30 ? name.slice(0, 27) + "…" : name,
      fullName: name,
      allocated: Math.round(v.allocated / 10000000),
      spent: Math.round(v.spent / 10000000),
      utilization: v.allocated > 0 ? Math.round(v.spent / v.allocated * 100) : 0,
    })).sort((a, b) => b.allocated - a.allocated);
  }, [schemes]);

  const stateSpending = useMemo(() => {
    if (selectedState !== "All India") return [];
    const map: Record<string, { allocated: number; spent: number }> = {};
    schemes.forEach(s => {
      const st = s.state || "Unknown";
      if (!map[st]) map[st] = { allocated: 0, spent: 0 };
      map[st].allocated += s.total_budget;
      map[st].spent += s.spent;
    });
    return Object.entries(map).map(([name, v]) => ({
      name: name.length > 18 ? name.slice(0, 15) + "…" : name,
      fullName: name,
      allocated: Math.round(v.allocated / 10000000),
      spent: Math.round(v.spent / 10000000),
    })).sort((a, b) => b.allocated - a.allocated);
  }, [schemes, selectedState]);

  const districtData = useMemo(() => {
    const map: Record<string, { allocated: number; spent: number }> = {};
    allocations.forEach(a => {
      if (!map[a.district]) map[a.district] = { allocated: 0, spent: 0 };
      map[a.district].allocated += a.allocated;
      map[a.district].spent += a.spent;
    });
    return Object.entries(map)
      .map(([name, v]) => ({ name, allocated: Math.round(v.allocated / 10000000), spent: Math.round(v.spent / 10000000) }))
      .sort((a, b) => b.allocated - a.allocated);
  }, [allocations]);

  const stateLabel = selectedState === "All India" ? "All India" : selectedState;

  return (
    <div className="py-8 md:py-10">
      <div className="container space-y-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary mb-1">Insights</p>
          <h1 className="font-display text-2xl font-bold md:text-3xl">{t("analytics.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("analytics.subtitle")} — {stateLabel}</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={BarChart3} title={t("stat.avgUtilization")} value={`${utilization}%`} variant="success" />
          <StatCard icon={TrendingUp} title={t("stat.totalSchemes")} value={String(schemes.length)} variant="info" />
          <StatCard icon={Building2} title={t("stat.departments")} value={String(new Set(schemes.map(s => s.department)).size)} variant="default" />
          <StatCard icon={MapPin} title={selectedState === "All India" ? t("stat.statesCovered") : t("stat.districts")} value={selectedState === "All India" ? String(stateCount) : String(new Set(allocations.map(a => a.district)).size)} variant="warning" />
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h3 className="font-display text-sm font-semibold mb-4">{t("analytics.categoryDist")}</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}%`} strokeWidth={0}>
                    {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} contentStyle={{ borderRadius: 12, border: "1px solid hsl(220,13%,91%)" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h3 className="font-display text-sm font-semibold mb-4">
              {selectedState === "All India" ? t("analytics.stateComparison") : t("analytics.districtComparison")}
            </h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedState === "All India" ? stateSpending : districtData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" strokeOpacity={0.7} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(220,9%,46%)" }} angle={-30} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(220,9%,46%)" }} />
                  <Tooltip formatter={(v: number) => `₹${v} Cr`} contentStyle={{ borderRadius: 12, border: "1px solid hsl(220,13%,91%)" }} />
                  <Bar dataKey="allocated" fill="hsl(222,47%,20%)" radius={[6, 6, 0, 0]} name="Budget" barSize={12} />
                  <Bar dataKey="spent" fill="hsl(152,69%,31%)" radius={[6, 6, 0, 0]} name="Spent" barSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
          <h3 className="font-display text-sm font-semibold mb-4">{t("analytics.deptPerformance")}</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                  <th className="pb-3 font-semibold">{t("analytics.department")}</th>
                  <th className="pb-3 font-semibold">{t("analytics.allocatedCr")}</th>
                  <th className="pb-3 font-semibold">{t("analytics.spentCr")}</th>
                  <th className="pb-3 font-semibold">{t("detail.utilization")}</th>
                  <th className="pb-3 font-semibold">{t("analytics.status")}</th>
                </tr>
              </thead>
              <tbody>
                {deptData.map(d => (
                  <tr key={d.fullName} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                    <td className="py-3.5 font-medium">{d.fullName}</td>
                    <td className="py-3.5 tabular-nums">{d.allocated.toLocaleString()}</td>
                    <td className="py-3.5 tabular-nums">{d.spent.toLocaleString()}</td>
                    <td className="py-3.5 font-semibold tabular-nums">{d.utilization}%</td>
                    <td className="py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold ${
                        d.utilization > 70 ? "bg-success/10 text-success" : d.utilization > 50 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                      }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${d.utilization > 70 ? "bg-success" : d.utilization > 50 ? "bg-warning" : "bg-destructive"}`} />
                        {d.utilization > 70 ? t("analytics.onTrack") : d.utilization > 50 ? t("analytics.moderate") : t("analytics.behind")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
