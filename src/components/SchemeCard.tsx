import { Link } from "react-router-dom";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, type Scheme } from "@/hooks/useSchemes";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Completed: "bg-info/10 text-info border-info/20",
  Upcoming: "bg-saffron/10 text-saffron border-saffron/20",
  Suspended: "bg-destructive/10 text-destructive border-destructive/20",
};

const SchemeCard = ({ scheme, index }: { scheme: Scheme; index: number }) => {
  const { t } = useLanguage();
  const progress = scheme.total_budget > 0 ? Math.round((scheme.spent / scheme.total_budget) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        to={`/schemes/${scheme.id}`}
        className="group relative block overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1"
      >
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/[0.02] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`text-[10px] font-semibold ${statusColors[scheme.status]}`}>
                {scheme.status}
              </Badge>
              <Badge variant="outline" className="text-[10px] text-muted-foreground border-border">
                {scheme.category}
              </Badge>
              {scheme.government_type === "Central" && (
                <Badge variant="outline" className="bg-saffron/8 text-saffron border-saffron/20 text-[10px] font-semibold">
                  {t("card.centralGovt")}
                </Badge>
              )}
            </div>
            <h3 className="font-display text-base font-semibold leading-snug text-foreground transition-colors duration-200 group-hover:text-secondary">
              {scheme.name}
            </h3>
            {scheme.name_ta && (
              <p className="text-xs text-muted-foreground leading-relaxed">{scheme.name_ta}</p>
            )}
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {scheme.department}
              </span>
              {scheme.state && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {scheme.state}
                </span>
              )}
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-all duration-300 group-hover:text-secondary group-hover:translate-x-1" />
        </div>

        <div className="relative mt-4 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {t("card.spent")}: <span className="font-semibold text-foreground">{formatCurrency(scheme.spent)}</span>
            </span>
            <span className="text-muted-foreground">{formatCurrency(scheme.total_budget)}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
          <p className="text-right text-[10px] font-medium text-muted-foreground">{progress}% {t("stat.utilized")}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default SchemeCard;
