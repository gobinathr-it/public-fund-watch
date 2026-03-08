import { Link } from "react-router-dom";
import { ArrowRight, Building2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Scheme, formatCurrency } from "@/lib/mockData";
import { motion } from "framer-motion";

const statusColors: Record<string, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Completed: "bg-info/10 text-info border-info/20",
  Upcoming: "bg-warning/10 text-warning border-warning/20",
};

const SchemeCard = ({ scheme, index }: { scheme: Scheme; index: number }) => {
  const progress = Math.round((scheme.spent / scheme.totalBudget) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link
        to={`/schemes/${scheme.id}`}
        className="group block rounded-lg border bg-card p-5 shadow-card transition-all hover:shadow-elevated"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={statusColors[scheme.status]}>
                {scheme.status}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                {scheme.category}
              </Badge>
            </div>
            <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-secondary transition-colors">
              {scheme.name}
            </h3>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              {scheme.department}
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Spent: <span className="font-semibold text-foreground">{formatCurrency(scheme.spent)}</span>
            </span>
            <span className="text-muted-foreground">
              of {formatCurrency(scheme.totalBudget)}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-right text-xs font-medium text-muted-foreground">{progress}% utilized</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default SchemeCard;
