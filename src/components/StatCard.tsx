import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  variant?: "default" | "success" | "warning" | "info";
}

const variantStyles = {
  default: "bg-card border border-border",
  success: "bg-card border border-success/20",
  warning: "bg-card border border-warning/20",
  info: "bg-card border border-info/20",
};

const iconVariantStyles = {
  default: "bg-primary/5 text-primary",
  success: "bg-success/8 text-success",
  warning: "bg-warning/8 text-warning",
  info: "bg-info/8 text-info",
};

const accentBar = {
  default: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
};

const StatCard = ({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    className={`group relative overflow-hidden rounded-xl p-5 shadow-card hover-lift ${variantStyles[variant]}`}
  >
    {/* Top accent bar */}
    <div className={`absolute top-0 left-0 right-0 h-[2px] ${accentBar[variant]}`} />

    <div className="flex items-start justify-between">
      <div className="space-y-1.5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
        <p className="font-display text-2xl font-bold tracking-tight text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {trend && (
          <p className={`text-xs font-semibold ${trend.positive ? "text-success" : "text-destructive"}`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${iconVariantStyles[variant]}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
