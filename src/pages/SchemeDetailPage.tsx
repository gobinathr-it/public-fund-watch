import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, Calendar, MapPin, FileCheck, AlertTriangle, Clock, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useScheme, useDistrictAllocations, useExpenses, formatCurrency } from "@/hooks/useSchemes";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

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
  const { t } = useLanguage();
  const { data: scheme, isLoading: schemeLoading } = useScheme(id);
  const { data: allocations = [] } = useDistrictAllocations(id);
  const { data: expenses = [] } = useExpenses(id);

  if (schemeLoading) {
    return (
      <div className="container py-10 space-y-6">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-48 w-full rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!scheme) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-xl font-bold">{t("detail.notFound")}</h2>
        <Button asChild variant="outline" className="mt-4 rounded-xl">
          <Link to="/schemes">{t("detail.backToSchemes")}</Link>
        </Button>
      </div>
    );
  }

  const progress = scheme.total_budget > 0 ? Math.round((scheme.spent / scheme.total_budget) * 100) : 0;
  const districtData = allocations.map(d => ({
    name: d.district,
    allocated: Math.round(d.allocated / 10000000),
    spent: Math.round(d.spent / 10000000),
  }));

  return (
    <div className="py-8 md:py-10">
      <div className="container space-y-8">
        <Button asChild variant="ghost" size="sm" className="gap-1.5 text-muted-foreground rounded-lg">
          <Link to="/schemes"><ArrowLeft className="h-4 w-4" /> {t("detail.allSchemes")}</Link>
        </Button>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border/60 bg-card p-7 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="bg-success/10 text-success border-success/20 rounded-lg">{scheme.status}</Badge>
                <Badge variant="outline" className="rounded-lg">{scheme.category}</Badge>
                {scheme.government_type === "Central" && (
                  <Badge variant="outline" className="bg-saffron/8 text-saffron border-saffron/20 rounded-lg">{t("card.centralGovt")}</Badge>
                )}
              </div>
              <h1 className="font-display text-2xl font-bold md:text-3xl">{scheme.name}</h1>
              {scheme.name_ta && <p className="text-lg text-muted-foreground">{scheme.name_ta}</p>}
              <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">{scheme.description}</p>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" />{scheme.department}</span>
                {scheme.state && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{scheme.state}</span>}
                {scheme.target_beneficiaries && <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" />{scheme.target_beneficiaries}</span>}
                {scheme.start_date && scheme.end_date && <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />{scheme.start_date} → {scheme.end_date}</span>}
              </div>
            </div>
          </div>

          {/* Fund progress */}
          <div className="mt-8 rounded-xl bg-muted/30 p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span>{t("detail.spent")}: <strong className="text-foreground">{formatCurrency(scheme.spent)}</strong></span>
              <span>{t("detail.budget")}: <strong className="text-foreground">{formatCurrency(scheme.total_budget)}</strong></span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-secondary">{progress}% {t("stat.utilized")}</span>
              <span>{t("detail.remaining")}: {formatCurrency(scheme.total_budget - scheme.spent)}</span>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-2">
          {districtData.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
              <h3 className="font-display text-sm font-semibold mb-4">{t("detail.districtAllocation")}</h3>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" strokeOpacity={0.7} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(220,9%,46%)" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(220,9%,46%)" }} />
                    <Tooltip formatter={(v: number) => `₹${v} Cr`} contentStyle={{ borderRadius: 12, border: "1px solid hsl(220,13%,91%)" }} />
                    <Bar dataKey="allocated" fill="hsl(222,47%,20%)" radius={[6, 6, 0, 0]} name="Allocated" barSize={18} />
                    <Bar dataKey="spent" fill="hsl(152,69%,31%)" radius={[6, 6, 0, 0]} name="Spent" barSize={18} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h3 className="font-display text-sm font-semibold mb-4">{t("detail.recentExpenses")} ({expenses.length})</h3>
            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
              {expenses.length === 0 && <p className="text-sm text-muted-foreground">{t("detail.noExpenses")}</p>}
              {expenses.map((exp) => {
                const StatusIcon = statusIcon[exp.status] || Clock;
                return (
                  <div key={exp.id} className="flex items-start gap-3 rounded-xl border border-border/50 p-3.5 hover:bg-muted/20 transition-colors">
                    <StatusIcon className={`mt-0.5 h-4 w-4 ${statusColor[exp.status] || "text-muted-foreground"}`} />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium">{exp.title}</p>
                        <span className="whitespace-nowrap text-sm font-bold">{formatCurrency(exp.amount)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                        <span>{exp.department}</span><span>•</span><span>{exp.district}</span><span>•</span><span>{exp.expense_date}</span>
                      </div>
                      {exp.description && <p className="text-[11px] text-muted-foreground">{exp.description}</p>}
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={`text-[10px] rounded-md ${statusColor[exp.status] || ""}`}>{exp.status}</Badge>
                        {exp.has_proof && <Badge variant="outline" className="text-[10px] text-success rounded-md">Proof ✓</Badge>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {allocations.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-border/60 bg-card p-6 shadow-card">
            <h3 className="font-display text-sm font-semibold mb-4">{t("detail.districtBreakdown")}</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 font-semibold">{t("detail.district")}</th>
                    <th className="pb-3 font-semibold">{t("detail.allocated")}</th>
                    <th className="pb-3 font-semibold">{t("detail.spent")}</th>
                    <th className="pb-3 font-semibold">{t("detail.utilization")}</th>
                    <th className="pb-3 font-semibold w-40">{t("detail.progress")}</th>
                  </tr>
                </thead>
                <tbody>
                  {allocations.map(d => {
                    const pct = d.allocated > 0 ? Math.round((d.spent / d.allocated) * 100) : 0;
                    return (
                      <tr key={d.id} className="border-b border-border/20 last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 font-medium">{d.district}</td>
                        <td className="py-3.5">{formatCurrency(d.allocated)}</td>
                        <td className="py-3.5">{formatCurrency(d.spent)}</td>
                        <td className="py-3.5 font-semibold">{pct}%</td>
                        <td className="py-3.5"><Progress value={pct} className="h-2" /></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SchemeDetailPage;
