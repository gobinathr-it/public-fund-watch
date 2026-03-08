import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Eye, FileCheck, Shield, TrendingUp, Users, MapPin, Landmark, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import SchemeCard from "@/components/SchemeCard";
import { useSchemes, formatCurrency } from "@/hooks/useSchemes";
import { useStateContext } from "@/contexts/StateContext";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingPage = () => {
  const { selectedState } = useStateContext();
  const { t } = useLanguage();
  const { data: schemes = [] } = useSchemes(undefined, selectedState);
  const totalBudget = schemes.reduce((s, sc) => s + sc.total_budget, 0);
  const totalSpent = schemes.reduce((s, sc) => s + sc.spent, 0);
  const utilization = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const stateCount = new Set(schemes.map(s => s.state).filter(Boolean)).size;
  const stateLabel = selectedState === "All India" ? "All India" : selectedState;

  const features = [
    { icon: Eye, title: t("feature.realTimeTracking"), desc: t("feature.realTimeTrackingDesc") },
    { icon: FileCheck, title: t("feature.proofVerification"), desc: t("feature.proofVerificationDesc") },
    { icon: BarChart3, title: t("feature.dataAnalytics"), desc: t("feature.dataAnalyticsDesc") },
    { icon: Shield, title: t("feature.aiFraudDetection"), desc: t("feature.aiFraudDetectionDesc") },
    { icon: MapPin, title: t("feature.panIndiaCoverage"), desc: t("feature.panIndiaCoverageDesc") },
    { icon: TrendingUp, title: t("feature.transparencyScore"), desc: t("feature.transparencyScoreDesc") },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32" style={{ background: "linear-gradient(135deg, hsl(145 65% 30%) 0%, hsl(145 55% 22%) 30%, hsl(0 0% 10%) 60%, hsl(0 0% 7%) 100%)" }}>
        {/* Decorative colored orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -bottom-20 -right-20 h-[350px] w-[350px] rounded-full bg-saffron/15 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full bg-primary/10 blur-[80px]" />
        </div>
        <div className="absolute inset-0 pattern-dots opacity-20" />
        <div className="container relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-accent px-5 py-2 text-sm"
            >
              <Landmark className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground font-medium">{t("landing.badge")}</span>
            </motion.div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] text-foreground md:text-5xl lg:text-6xl">
              {t("landing.title1")}{" "}
              <span className="text-primary">{t("landing.title2")}</span>{" "}
              {t("landing.title3")}
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg leading-relaxed">
              {t("landing.subtitle")}
            </p>
            <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gap-2 rounded-xl px-8 font-semibold shadow-glow ripple-effect">
                <Link to="/dashboard">{t("landing.exploreDashboard")} <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl px-8 font-semibold ripple-effect">
                <Link to="/schemes">{t("landing.viewAllSchemes")}</Link>
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 flex items-center justify-center gap-6 text-[11px] text-muted-foreground"
            >
              <span className="flex items-center gap-1.5"><Scale className="h-3.5 w-3.5" /> Transparent</span>
              <span className="h-3 w-px bg-border" />
              <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /> Verified Data</span>
              <span className="h-3 w-px bg-border" />
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /> For Citizens</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-10 relative z-10">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={BarChart3} title={t("stat.totalBudget")} value={formatCurrency(totalBudget)} subtitle={stateLabel} variant="info" />
            <StatCard icon={TrendingUp} title={t("stat.totalSpent")} value={formatCurrency(totalSpent)} subtitle={`${utilization}% ${t("stat.utilized")}`} variant="success" />
            <StatCard icon={FileCheck} title={t("stat.activeSchemes")} value={String(schemes.filter(s => s.status === "Active").length)} subtitle={stateLabel} variant="default" />
            <StatCard icon={Users} title={t("stat.statesCovered")} value={String(stateCount)} subtitle={t("stat.statesUTs")} variant="warning" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 md:py-24">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-3">Platform Features</p>
            <h2 className="font-display text-3xl font-bold">{t("landing.howItWorks")}</h2>
            <p className="mt-3 text-muted-foreground">{t("landing.howItWorksDesc")}</p>
          </motion.div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }} className="group rounded-2xl border border-border bg-card p-6 shadow-card hover-lift">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent transition-all duration-300 group-hover:bg-primary/10 group-hover:scale-110 group-hover:shadow-glow">
                  <f.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mt-5 font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Schemes */}
      <section className="border-t border-border/40 bg-muted/30 py-20 pattern-grid">
        <div className="container">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-primary mb-2">Browse Programmes</p>
              <h2 className="font-display text-2xl font-bold">{t("landing.activeSchemes")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {selectedState === "All India" ? t("landing.govProgrammes") : `${t("landing.schemesIn")} ${selectedState}`}
              </p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex gap-1.5 text-primary font-medium">
              <Link to="/schemes">{t("landing.viewAll")} <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {schemes.slice(0, 6).map((s, i) => (
              <SchemeCard key={s.id} scheme={s} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
