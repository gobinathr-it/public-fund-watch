import { BarChart3, TrendingUp, FileCheck, AlertTriangle, IndianRupee, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import StatCard from "@/components/StatCard";
import SchemeCard from "@/components/SchemeCard";
import { useSchemes, useAllDistrictAllocations, useExpenses, formatCurrency } from "@/hooks/useSchemes";
import { motion } from "framer-motion";
import { useMemo } from "react";

const COLORS = [
  "hsl(215, 50%, 15%)",
  "hsl(160, 84%, 30%)",
  "hsl(38, 92%, 50%)",
  "hsl(210, 100%, 50%)",
  "hsl(280, 60%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(180, 60%, 40%)",
  "hsl(330, 70%, 50%)",
];

const Dashboard = () => {
  const { data: schemes = [] } = useSchemes();
  const { data: allocations = [] } = useAllDistrictAllocations();
  const { data: expenses = [] } = useExpenses();

  const totalBudget = schemes.reduce((s, sc) => s + sc.total_budget, 0);
  const totalSpent = schemes.reduce((s, sc) => s + sc.spent, 0);
  const utilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const verifiedCount = expenses.filter(e => e.status === "Verified").length;
  const flaggedCount = expenses.filter(e => e.status === "Flagged").length;

  // Category distribution
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    schemes.forEach(s => { map[s.category] = (map[s.category] || 0) + s.total_budget; });
    return Object.entries(map).map(([name, value], i) => ({
      name,
      value: Math.round(value / totalBudget * 100),
      fill: COLORS[i % COLORS.length],
    }));
  }, [schemes, totalBudget]);

  // Department spending
  const deptData = useMemo(() => {
    const map: Record<string, { allocated: number; spent: number }> = {};
    schemes.forEach(s => {
      if (!map[s.department]) map[s.department] = { allocated: 0, spent: 0 };
      map[s.department].allocated += s.total_budget;
      map[s.department].spent += s.spent;
    });
    return Object.entries(map).map(([name, v]) => ({
      name: name.length > 25 ? name.slice(0, 22) + "..." : name,
      allocated: Math.round(v.allocated / 10000000),
      spent: Math.round(v.spent / 10000000),
    })).sort((a, b) => b.allocated - a.allocated);
  }, [schemes]);

  // District spending
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

  return (
    <div className="py-6 md:py-8">
      <div className="container space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Citizen Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time overview of Tamil Nadu public fund utilization</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={IndianRupee} title="Total Budget" value={formatCurrency(totalBudget)} subtitle={`${schemes.length} schemes`} variant="info" />
          <StatCard icon={TrendingUp} title="Total Spent" value={formatCurrency(totalSpent)} subtitle={`${utilization}% utilized`} variant="success" />
          <StatCard icon={FileCheck} title="Verified Expenses" value={String(verifiedCount)} trend={{ value: "from database", positive: true }} variant="default" />
          <StatCard icon={AlertTriangle} title="Flagged Items" value={String(flaggedCount)} subtitle="Needs review" variant="warning" />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* District spending */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border bg-card p-5 shadow-card lg:col-span-2">
            <h3 className="font-display text-base font-semibold">Top Districts by Allocation</h3>
            <p className="text-xs text-muted-foreground">Budget vs Spent (₹ Crore)</p>
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => `₹${v} Cr`} />
                  <Bar dataKey="allocated" fill="hsl(215,50%,15%)" radius={[4, 4, 0, 0]} name="Allocated" barSize={16} />
                  <Bar dataKey="spent" fill="hsl(160,84%,30%)" radius={[4, 4, 0, 0]} name="Spent" barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category pie */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-lg border bg-card p-5 shadow-card">
            <h3 className="font-display text-base font-semibold">By Category</h3>
            <p className="text-xs text-muted-foreground">Fund distribution</p>
            <div className="mt-4 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {categoryData.map(c => (
                <div key={c.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: c.fill }} />
                  <span className="text-muted-foreground">{c.name}</span>
                  <span className="ml-auto font-medium">{c.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Department bar chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-lg border bg-card p-5 shadow-card">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <h3 className="font-display text-base font-semibold">Department-wise Spending</h3>
          </div>
          <div className="mt-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={160} />
                <Tooltip formatter={(v: number) => `₹${v} Cr`} />
                <Bar dataKey="allocated" fill="hsl(215,50%,15%)" radius={[0, 4, 4, 0]} name="Allocated" barSize={14} />
                <Bar dataKey="spent" fill="hsl(160,84%,30%)" radius={[0, 4, 4, 0]} name="Spent" barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Schemes */}
        <div>
          <h2 className="font-display text-xl font-bold">All Active Schemes</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {schemes.map((s, i) => <SchemeCard key={s.id} scheme={s} index={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
