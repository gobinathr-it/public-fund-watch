import { BarChart3, TrendingUp, Building2, PieChart as PieIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import StatCard from "@/components/StatCard";
import { departmentSpending, monthlySpending, categoryDistribution, formatCurrencyShort, schemes } from "@/lib/mockData";
import { motion } from "framer-motion";

const stateData = [
  { state: "Maharashtra", budget: 10000, spent: 6500 },
  { state: "Karnataka", budget: 8000, spent: 4200 },
  { state: "Tamil Nadu", budget: 5000, spent: 1800 },
  { state: "Uttar Pradesh", budget: 12000, spent: 9800 },
  { state: "Gujarat", budget: 6000, spent: 3100 },
];

const AnalyticsPage = () => {
  const totalBudget = schemes.reduce((s, sc) => s + sc.totalBudget, 0);
  const totalSpent = schemes.reduce((s, sc) => s + sc.spent, 0);

  return (
    <div className="py-6 md:py-8">
      <div className="container space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">In-depth analysis of public fund utilization</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={BarChart3} title="Avg. Utilization" value={`${Math.round((totalSpent / totalBudget) * 100)}%`} variant="success" />
          <StatCard icon={TrendingUp} title="Monthly Avg. Spend" value="₹3,475 Cr" variant="info" />
          <StatCard icon={Building2} title="Departments" value="6" variant="default" />
          <StatCard icon={PieIcon} title="Transparency Score" value="78/100" variant="warning" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Spending trend line */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg border bg-card p-5 shadow-card">
            <h3 className="font-display text-base font-semibold">Spending Trend</h3>
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySpending}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v: number) => formatCurrencyShort(v)} />
                  <Line type="monotone" dataKey="budget" stroke="hsl(215,50%,15%)" strokeWidth={2} dot={false} name="Budget" />
                  <Line type="monotone" dataKey="spent" stroke="hsl(160,84%,30%)" strokeWidth={2} dot={false} name="Spent" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Category pie */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-lg border bg-card p-5 shadow-card">
            <h3 className="font-display text-base font-semibold">Category Distribution</h3>
            <div className="mt-4 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}%`}>
                    {categoryDistribution.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => `${v}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* State comparison */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="rounded-lg border bg-card p-5 shadow-card">
          <h3 className="font-display text-base font-semibold">State-wise Comparison</h3>
          <div className="mt-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
                <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => formatCurrencyShort(v)} />
                <Bar dataKey="budget" fill="hsl(215,50%,15%)" radius={[4, 4, 0, 0]} name="Budget" barSize={24} />
                <Bar dataKey="spent" fill="hsl(160,84%,30%)" radius={[4, 4, 0, 0]} name="Spent" barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Department table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-lg border bg-card p-5 shadow-card">
          <h3 className="font-display text-base font-semibold">Department Performance</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">Department</th>
                  <th className="pb-3 font-medium">Allocated (₹ Cr)</th>
                  <th className="pb-3 font-medium">Spent (₹ Cr)</th>
                  <th className="pb-3 font-medium">Utilization</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {departmentSpending.map((d) => {
                  const pct = Math.round((d.spent / d.allocated) * 100);
                  return (
                    <tr key={d.name} className="border-b last:border-0">
                      <td className="py-3 font-medium">{d.name}</td>
                      <td className="py-3">{d.allocated.toLocaleString()}</td>
                      <td className="py-3">{d.spent.toLocaleString()}</td>
                      <td className="py-3">{pct}%</td>
                      <td className="py-3">
                        <span className={`text-xs font-medium ${pct > 70 ? "text-success" : pct > 50 ? "text-warning" : "text-destructive"}`}>
                          {pct > 70 ? "On Track" : pct > 50 ? "Moderate" : "Behind"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
