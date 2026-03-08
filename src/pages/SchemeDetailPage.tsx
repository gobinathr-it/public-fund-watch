import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, Calendar, MapPin, FileCheck, AlertTriangle, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { schemes, formatCurrency } from "@/lib/mockData";
import { motion } from "framer-motion";

const statusIcon: Record<string, typeof FileCheck> = {
  Verified: FileCheck,
  Pending: Clock,
  Flagged: AlertTriangle,
};
const statusColor: Record<string, string> = {
  Verified: "text-success",
  Pending: "text-warning",
  Flagged: "text-destructive",
};

const SchemeDetailPage = () => {
  const { id } = useParams();
  const scheme = schemes.find((s) => s.id === id);

  if (!scheme) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-xl font-bold">Scheme not found</h2>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/schemes">Back to Schemes</Link>
        </Button>
      </div>
    );
  }

  const progress = Math.round((scheme.spent / scheme.totalBudget) * 100);
  const districtData = scheme.districts.map((d) => ({
    name: d.district,
    allocated: Math.round(d.allocated / 1_00_00_000),
    spent: Math.round(d.spent / 1_00_00_000),
  }));

  return (
    <div className="py-6 md:py-8">
      <div className="container space-y-8">
        {/* Back */}
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
          <Link to="/schemes"><ArrowLeft className="h-4 w-4" /> All Schemes</Link>
        </Button>

        {/* Header card */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">{scheme.status}</Badge>
                <Badge variant="outline">{scheme.category}</Badge>
              </div>
              <h1 className="font-display text-2xl font-bold md:text-3xl">{scheme.name}</h1>
              <p className="max-w-2xl text-sm text-muted-foreground">{scheme.description}</p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Building2 className="h-3.5 w-3.5" />{scheme.department}</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{scheme.state}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{scheme.startDate} → {scheme.endDate}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Spent: <strong>{formatCurrency(scheme.spent)}</strong></span>
              <span>Budget: <strong>{formatCurrency(scheme.totalBudget)}</strong></span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progress}% utilized</span>
              <span>Remaining: {formatCurrency(scheme.totalBudget - scheme.spent)}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* District chart */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-lg border bg-card p-5 shadow-card">
            <h3 className="font-display text-base font-semibold">District-wise Allocation</h3>
            <div className="mt-4 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={districtData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,20%,90%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v: number) => `₹${v} Cr`} />
                  <Bar dataKey="allocated" fill="hsl(215,50%,15%)" radius={[4, 4, 0, 0]} name="Allocated" barSize={20} />
                  <Bar dataKey="spent" fill="hsl(160,84%,30%)" radius={[4, 4, 0, 0]} name="Spent" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Expenses */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="rounded-lg border bg-card p-5 shadow-card">
            <h3 className="font-display text-base font-semibold">Recent Expenses</h3>
            <div className="mt-4 space-y-3">
              {scheme.expenses.map((exp) => {
                const StatusIcon = statusIcon[exp.status];
                return (
                  <div key={exp.id} className="flex items-start gap-3 rounded-md border p-3">
                    <StatusIcon className={`mt-0.5 h-4 w-4 ${statusColor[exp.status]}`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{exp.title}</p>
                        <span className="whitespace-nowrap text-sm font-semibold">{formatCurrency(exp.amount)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>{exp.department}</span>
                        <span>•</span>
                        <span>{exp.location}</span>
                        <span>•</span>
                        <span>{exp.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-xs ${statusColor[exp.status]}`}>{exp.status}</Badge>
                        {exp.hasProof && <Badge variant="outline" className="text-xs text-success">Proof ✓</Badge>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* District table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-lg border bg-card p-5 shadow-card">
          <h3 className="font-display text-base font-semibold">District Breakdown</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="pb-3 font-medium">District</th>
                  <th className="pb-3 font-medium">Allocated</th>
                  <th className="pb-3 font-medium">Spent</th>
                  <th className="pb-3 font-medium">Utilization</th>
                  <th className="pb-3 font-medium w-40">Progress</th>
                </tr>
              </thead>
              <tbody>
                {scheme.districts.map((d) => {
                  const pct = Math.round((d.spent / d.allocated) * 100);
                  return (
                    <tr key={d.district} className="border-b last:border-0">
                      <td className="py-3 font-medium">{d.district}</td>
                      <td className="py-3">{formatCurrency(d.allocated)}</td>
                      <td className="py-3">{formatCurrency(d.spent)}</td>
                      <td className="py-3">{pct}%</td>
                      <td className="py-3"><Progress value={pct} className="h-2" /></td>
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

export default SchemeDetailPage;
