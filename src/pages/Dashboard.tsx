import { BarChart3, TrendingUp, FileCheck, AlertTriangle, IndianRupee, Building2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";
import StatCard from "@/components/StatCard";
import SchemeCard from "@/components/SchemeCard";
import { schemes, departmentSpending, monthlySpending, categoryDistribution, formatCurrencyShort } from "@/lib/mockData";
import { motion } from "framer-motion";

const Dashboard = () => {
  const totalBudget = schemes.reduce((s, sc) => s + sc.totalBudget, 0);
  const totalSpent = schemes.reduce((s, sc) => s + sc.spent, 0);
  const utilization = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="py-6 md:py-8">
      <div className="container space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Citizen Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Real-time overview of public fund utilization across India</p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={IndianRupee} title="Total Budget" value="₹41,000 Cr" subtitle="5 active schemes" variant="info" />
          <StatCard icon={TrendingUp} title="Total Spent" value={`₹${Math.round(totalSpent / 1_00_00_00_000).toLocaleString()}K Cr`} subtitle={`${utilization}% utilized`} variant="success" />
          <StatCard icon={FileCheck} title="Verified Expenses" value="847" trend={{ value: "+23 this week", positive: true }} variant="default" />
          <StatCard icon={AlertTriangle} title="Flagged Items" value="12" subtitle="Needs review" variant="warning" />
        </div>

        {/* Charts row */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Monthly trend */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border bg-card p-5 shadow-card lg:col-span-2">
            <h3 className="font-display text-base font-semibold">Monthly Spending Trend</h3>
            <p className="text-xs text-muted-foreground">Budget vs Actual Spending (₹ Crore)</p>
            <div className="mt-4 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => formatCurrencyShort(v)} />
                  <Area type="monotone" dataKey="budget" stroke="hsl(215,50%,15%)" fill="hsl(215,50%,15%)" fillOpacity={0.08} strokeWidth={2} name="Budget" />
                  <Area type="monotone" dataKey="spent" stroke="hsl(160,84%,30%)" fill="hsl(160,84%,30%)" fillOpacity={0.15} strokeWidth={2} name="Spent" />
                </AreaChart>
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
                  <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {categoryDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 space-y-1.5">
              {categoryDistribution.map((c) => (
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
              <BarChart data={departmentSpending} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={140} />
                <Tooltip formatter={(v: number) => formatCurrencyShort(v)} />
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
            {schemes.map((s, i) => (
              <SchemeCard key={s.id} scheme={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
