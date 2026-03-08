import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  variant?: "default" | "success" | "warning" | "info";
  index?: number;
}

const variantStyles = {
  default: "bg-card border border-border",
  success: "bg-card border border-success/20",
  warning: "bg-card border border-warning/20",
  info: "bg-card border border-info/20",
};

const iconVariantStyles = {
  default: "bg-primary/8 text-primary",
  success: "bg-success/8 text-success",
  warning: "bg-warning/8 text-warning",
  info: "bg-info/8 text-info",
};

const accentBar = {
  default: "from-primary/80 to-primary/30",
  success: "from-success/80 to-success/30",
  warning: "from-warning/80 to-warning/30",
  info: "from-info/80 to-info/30",
};

const StatCard = ({ title, value, subtitle, icon: Icon, trend, variant = "default", index = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    className={`group relative overflow-hidden rounded-xl p-5 shadow-premium hover-lift ${variantStyles[variant]}`}
  >
    {/* Top accent gradient bar */}
    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accentBar[variant]}`} />

    {/* Subtle background pattern */}
    <div className="pointer-events-none absolute -right-4 -bottom-4 h-20 w-20 rounded-full bg-gradient-to-br from-transparent to-muted/30" />

    <div className="flex items-start justify-between">
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">{title}</p>
        <p className="font-display text-2xl font-bold tracking-tight text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {trend && (
          <p className={`text-xs font-semibold ${trend.positive ? "text-success" : "text-destructive"}`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-sm ${iconVariantStyles[variant]}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
