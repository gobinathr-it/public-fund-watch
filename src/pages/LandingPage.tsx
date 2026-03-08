import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Eye, FileCheck, Shield, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import SchemeCard from "@/components/SchemeCard";
import { schemes } from "@/lib/mockData";

const features = [
  { icon: Eye, title: "Real-Time Tracking", desc: "Monitor every rupee from allocation to expenditure with live updates." },
  { icon: FileCheck, title: "Proof Verification", desc: "Every expense backed by invoices, photos, and geo-location data." },
  { icon: BarChart3, title: "Data Analytics", desc: "Interactive charts showing spending patterns across departments." },
  { icon: Shield, title: "AI Fraud Detection", desc: "Machine learning flags unusual spending patterns automatically." },
  { icon: Users, title: "Citizen Reporting", desc: "Report fake projects, corruption, or quality issues directly." },
  { icon: TrendingUp, title: "Transparency Score", desc: "Every project gets a public accountability score." },
];

const LandingPage = () => {
  const totalBudget = schemes.reduce((s, sc) => s + sc.totalBudget, 0);
  const totalSpent = schemes.reduce((s, sc) => s + sc.spent, 0);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-hero relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzAtMy4zMTQgMi42ODYtNiA2LTZzNiAyLjY4NiA2IDYtMi42ODYgNi02IDYtNi0yLjY4Ni02LTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mx-auto max-w-3xl text-center"
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm text-secondary-foreground">
              <Shield className="h-4 w-4 text-primary-foreground" />
              <span className="text-primary-foreground/80">Government Transparency Initiative</span>
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-tight text-primary-foreground md:text-5xl lg:text-6xl">
              Track Every Rupee of{" "}
              <span className="text-secondary">Public Funds</span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-primary-foreground/70 md:text-lg">
              Real-time visibility into how ₹41,000+ Crore in government welfare schemes is allocated, spent, and verified across India.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 gap-2">
                <Link to="/dashboard">
                  Explore Dashboard <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/schemes">View All Schemes</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="-mt-8 relative z-10">
        <div className="container">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={BarChart3} title="Total Budget" value="₹41,000 Cr" subtitle="FY 2024-26" variant="info" />
            <StatCard icon={TrendingUp} title="Total Spent" value={`₹${Math.round(totalSpent / 1_00_00_00_000).toLocaleString()}K Cr`} subtitle={`${Math.round((totalSpent / totalBudget) * 100)}% utilized`} variant="success" />
            <StatCard icon={FileCheck} title="Active Schemes" value={String(schemes.filter(s => s.status === "Active").length)} subtitle="Across 5 states" variant="default" />
            <StatCard icon={Users} title="Citizens Tracking" value="2.4M" trend={{ value: "12% this month", positive: true }} variant="warning" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold">How Transparency Works</h2>
            <p className="mt-3 text-muted-foreground">Every feature designed to ensure public accountability.</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg border bg-card p-6 shadow-card"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-secondary/10">
                  <f.icon className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Schemes */}
      <section className="border-t bg-muted/30 py-16">
        <div className="container">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold">Active Schemes</h2>
              <p className="mt-1 text-sm text-muted-foreground">Latest government welfare programmes</p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:inline-flex gap-1 text-secondary">
              <Link to="/schemes">View all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {schemes.slice(0, 3).map((s, i) => (
              <SchemeCard key={s.id} scheme={s} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
