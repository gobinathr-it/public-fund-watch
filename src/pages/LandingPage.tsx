import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Eye, FileCheck, Shield, TrendingUp, Users, MapPin, Landmark, Scale, Globe, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import SchemeCard from "@/components/SchemeCard";
import { useSchemes, formatCurrency } from "@/hooks/useSchemes";
import { useStateContext } from "@/contexts/StateContext";
import { useLanguage } from "@/contexts/LanguageContext";

const AshokaChakra = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 200 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <circle cx="100" cy="100" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
    {Array.from({ length: 24 }).map((_, i) => {
      const angle = (i * 15 * Math.PI) / 180;
      const x1 = 100 + 22 * Math.cos(angle);
      const y1 = 100 + 22 * Math.sin(angle);
      const x2 = 100 + 88 * Math.cos(angle);
      const y2 = 100 + 88 * Math.sin(angle);
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8" opacity="0.2" />;
    })}
  </svg>
);

const IndiaMapOutline = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 300 400" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M150 20 C160 25, 180 30, 190 40 C200 50, 210 55, 215 70 C220 85, 225 95, 230 110 C235 125, 240 135, 245 150 C250 165, 255 175, 258 190 C260 205, 262 215, 260 230 C258 245, 255 255, 250 270 C245 285, 240 295, 230 310 C220 325, 210 335, 195 345 C180 355, 170 360, 155 365 C140 370, 130 372, 120 368 C110 364, 100 358, 92 348 C84 338, 78 328, 72 315 C66 302, 62 292, 58 278 C54 264, 52 254, 50 240 C48 226, 47 216, 48 200 C49 184, 52 174, 55 160 C58 146, 62 136, 68 122 C74 108, 80 98, 88 85 C96 72, 104 62, 115 50 C126 38, 138 28, 150 20Z"
      stroke="currentColor"
      strokeWidth="1"
      opacity="0.08"
      fill="currentColor"
      fillOpacity="0.02"
    />
  </svg>
);

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
      {/* Tricolor top bar */}
      <div className="flex h-1">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-background" />
        <div className="flex-1 bg-primary" />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-28 md:py-36 bg-hero">
        {/* Ashoka Chakra watermark - spinning with glow */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* Radial glow behind chakra */}
          <div className="absolute h-[550px] w-[550px] md:h-[700px] md:w-[700px] rounded-full bg-ashoka-blue/[0.06] blur-[80px]" />
          <AshokaChakra className="h-[550px] w-[550px] md:h-[700px] md:w-[700px] text-white/[0.10] animate-[slow-spin_28s_linear_infinite]" />
        </div>

        {/* Decorative orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-primary/15 blur-[140px]" />
          <div className="absolute -bottom-24 -right-24 h-[400px] w-[400px] rounded-full bg-saffron/10 blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 h-[250px] w-[250px] rounded-full bg-ashoka-blue/8 blur-[100px]" />
        </div>

        <div className="absolute inset-0 pattern-dots opacity-10" />

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.07] px-5 py-2.5 text-sm backdrop-blur-md"
            >
              <Landmark className="h-4 w-4 text-saffron" />
              <span className="font-medium text-white/80">{t("landing.badge")}</span>
              <span className="h-1 w-1 rounded-full bg-primary" />
              <span className="text-primary/80 text-xs font-medium">Live Data</span>
            </motion.div>

            {/* Title */}
            <h1 className="font-display text-4xl font-extrabold leading-[1.08] md:text-5xl lg:text-[3.5rem] xl:text-6xl">
              <span className="text-white">India</span>{" "}
              <span className="text-saffron">Fund</span>{" "}
              <span className="text-white/60">&</span>{" "}
              <span className="text-saffron">Scheme</span>{" "}
              <span className="text-white">Tracker</span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mx-auto mt-5 max-w-2xl text-lg font-medium text-white/70 md:text-xl leading-relaxed"
            >
              Track Government Funds, Schemes and Scholarships Across India
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mx-auto mt-3 max-w-xl text-sm text-white/40 md:text-base leading-relaxed"
            >
              A transparent digital platform that provides real-time visibility into government welfare schemes, budgets and public spending.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
            >
              <Button asChild size="lg" className="gap-2 rounded-xl px-8 font-semibold shadow-glow ripple-effect bg-primary text-primary-foreground hover:bg-primary/90">
                <Link to="/dashboard">
                  {t("landing.exploreDashboard")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl px-8 font-semibold border-white/15 text-white/90 bg-white/[0.06] hover:bg-white/[0.12] hover:border-white/25 backdrop-blur-sm ripple-effect transition-all duration-300">
                <Link to="/schemes">{t("landing.viewAllSchemes")}</Link>
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-white/35"
            >
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                  <Scale className="h-3 w-3 text-primary" />
                </span>
                Transparent
              </span>
              <span className="hidden sm:block h-3 w-px bg-white/10" />
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ashoka-blue/20">
                  <Shield className="h-3 w-3 text-ashoka-blue" />
                </span>
                Verified Data
              </span>
              <span className="hidden sm:block h-3 w-px bg-white/10" />
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-saffron/20">
                  <Users className="h-3 w-3 text-saffron" />
                </span>
                For Citizens
              </span>
              <span className="hidden sm:block h-3 w-px bg-white/10" />
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                  <Globe className="h-3 w-3 text-primary" />
                </span>
                Pan-India
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Stats */}
      <section className="-mt-14 relative z-10 pb-4">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={IndianRupee} title={t("stat.totalBudget")} value={formatCurrency(totalBudget)} subtitle={stateLabel} variant="info" index={0} />
            <StatCard icon={TrendingUp} title={t("stat.totalSpent")} value={formatCurrency(totalSpent)} subtitle={`${utilization}% ${t("stat.utilized")}`} variant="success" index={1} />
            <StatCard icon={FileCheck} title={t("stat.activeSchemes")} value={String(schemes.filter(s => s.status === "Active").length)} subtitle={stateLabel} variant="default" index={2} />
            <StatCard icon={Users} title={t("stat.statesCovered")} value={String(stateCount)} subtitle={t("stat.statesUTs")} variant="warning" index={3} />
          </div>
        </div>
      </section>

      {/* Tricolor separator */}
      <div className="container py-8">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-saffron/20" />
          <div className="h-px w-8 bg-saffron/40" />
          <div className="flex h-6 w-6 items-center justify-center">
            <AshokaChakra className="h-5 w-5 text-ashoka-blue/30" />
          </div>
          <div className="h-px w-8 bg-primary/40" />
          <div className="h-px flex-1 bg-primary/20" />
        </div>
      </div>

      {/* Features */}
      <section className="py-16 md:py-20">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-3">Platform Features</p>
            <h2 className="font-display text-3xl font-bold text-foreground">{t("landing.howItWorks")}</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">{t("landing.howItWorksDesc")}</p>
          </motion.div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-2xl border border-border bg-card p-6 shadow-card hover-lift overflow-hidden"
              >
                {/* Subtle top accent */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-saffron/40 via-primary/60 to-ashoka-blue/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent transition-all duration-300 group-hover:bg-primary/10 group-hover:scale-110 group-hover:shadow-glow">
                  <f.icon className="h-5 w-5 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h3 className="mt-5 font-display text-base font-semibold text-foreground">{f.title}</h3>
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
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary mb-2">Browse Programmes</p>
              <h2 className="font-display text-2xl font-bold text-foreground">{t("landing.activeSchemes")}</h2>
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

      {/* Bottom tricolor bar */}
      <div className="flex h-1">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-background" />
        <div className="flex-1 bg-primary" />
      </div>
    </div>
  );
};

export default LandingPage;
