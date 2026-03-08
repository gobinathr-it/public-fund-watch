import { BarChart3, TrendingUp, Building2, PieChart as PieIcon, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import StatCard from "@/components/StatCard";
import { useSchemes, useAllDistrictAllocations, formatCurrency } from "@/hooks/useSchemes";
import { useStateContext } from "@/contexts/StateContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = [
  "hsl(215, 50%, 15%)", "hsl(160, 84%, 30%)", "hsl(38, 92%, 50%)",
  "hsl(210, 100%, 50%)", "hsl(280, 60%, 50%)", "hsl(0, 72%, 51%)",
  "hsl(180, 60%, 40%)", "hsl(330, 70%, 50%)", "hsl(60, 80%, 45%)",
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
      name: name.length > 30 ? name.slice(0, 27) + "..." : name,
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
      name: name.length > 18 ? name.slice(0, 15) + "..." : name,
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
    <div className="py-6 md:py-8">
      <div className="container space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">{t("analytics.title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("analytics.subtitle")} — {stateLabel}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={BarChart3} title={t("stat.avgUtilization")} value={`${utilization}%`} variant="success" />
          <StatCard icon={TrendingUp} title={t("stat.totalSchemes")} value={String(schemes.length)} variant="info" />
          <StatCard icon={Building2} title={t("stat.departments")} value={String(new Set(schemes.map(s => s.department)).size)} variant="default" />
          <StatCard icon={MapPin} title={selectedState === "All India" ? t("stat.statesCovered") : t("stat.districts")} value={selectedState === "All India" ? String(stateCount) : String(new Set(allocations.map(a => a.district)).size)} variant="warning" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border bg-card p-5 shadow-card">
            <h3 className="font-display text-base font-semibold">{t("analytics.categoryDist")}</h3>
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}%`}>
                    {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-lg border bg-card p-5 shadow-card">
            <h3 className="font-display text-base font-semibold">
              {selectedState === "All India" ? t("analytics.stateComparison") : t("analytics.districtComparison")}
            </h3>
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedState === "All India" ? stateSpending : districtData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-30} textAnchor="end" height={70} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => `₹${v} Cr`} />
                  <Bar dataKey="allocated" fill="hsl(215,50%,15%)" radius={[4, 4, 0, 0]} name="Budget" barSize={14} />
                  <Bar dataKey="spent" fill="hsl(160,84%,30%)" radius={[4, 4, 0, 0]} name="Spent" barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-lg border bg-card p-5 shadow-card">
          <h3 className="font-display text-base font-semibold">{t("analytics.deptPerformance")}</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">{t("analytics.department")}</th>
                  <th className="pb-3 font-medium">{t("analytics.allocatedCr")}</th>
                  <th className="pb-3 font-medium">{t("analytics.spentCr")}</th>
                  <th className="pb-3 font-medium">{t("detail.utilization")}</th>
                  <th className="pb-3 font-medium">{t("analytics.status")}</th>
                </tr>
              </thead>
              <tbody>
                {deptData.map(d => (
                  <tr key={d.fullName} className="border-b last:border-0">
                    <td className="py-3 font-medium">{d.fullName}</td>
                    <td className="py-3">{d.allocated.toLocaleString()}</td>
                    <td className="py-3">{d.spent.toLocaleString()}</td>
                    <td className="py-3">{d.utilization}%</td>
                    <td className="py-3">
                      <span className={`text-xs font-medium ${d.utilization > 70 ? "text-success" : d.utilization > 50 ? "text-warning" : "text-destructive"}`}>
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
