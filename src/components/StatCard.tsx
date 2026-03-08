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
  default: "bg-card shadow-card",
  success: "bg-card shadow-card border-l-4 border-l-success",
  warning: "bg-card shadow-card border-l-4 border-l-warning",
  info: "bg-card shadow-card border-l-4 border-l-info",
};

const iconVariantStyles = {
  default: "bg-muted text-foreground",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  info: "bg-info/10 text-info",
};

const StatCard = ({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className={`rounded-lg border p-5 ${variantStyles[variant]}`}
  >
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="font-display text-2xl font-bold text-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {trend && (
          <p className={`text-xs font-medium ${trend.positive ? "text-success" : "text-destructive"}`}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconVariantStyles[variant]}`}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
