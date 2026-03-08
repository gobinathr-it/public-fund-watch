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
  Upcoming: "bg-warning/10 text-warning border-warning/20",
  Suspended: "bg-destructive/10 text-destructive border-destructive/20",
};

const SchemeCard = ({ scheme, index }: { scheme: Scheme; index: number }) => {
  const { t } = useLanguage();
  const progress = scheme.total_budget > 0 ? Math.round((scheme.spent / scheme.total_budget) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        to={`/schemes/${scheme.id}`}
        className="group block rounded-lg border bg-card p-5 shadow-card transition-all hover:shadow-elevated"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={statusColors[scheme.status]}>
                {scheme.status}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {scheme.category}
              </Badge>
              {scheme.government_type === "Central" && (
                <Badge variant="outline" className="bg-info/10 text-info border-info/20 text-[10px]">
                  {t("card.centralGovt")}
                </Badge>
              )}
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-secondary transition-colors">
              {scheme.name}
            </h3>
            {scheme.name_ta && (
              <p className="text-sm text-muted-foreground">{scheme.name_ta}</p>
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {scheme.department}
              </span>
              {scheme.state && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {scheme.state}
                </span>
              )}
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              {t("card.spent")}: <span className="font-semibold text-foreground">{formatCurrency(scheme.spent)}</span>
            </span>
            <span className="text-muted-foreground">{t("card.budget")}: {formatCurrency(scheme.total_budget)}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-right text-xs font-medium text-muted-foreground">{progress}% {t("stat.utilized")}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default SchemeCard;
