import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import StateSelector from "@/components/StateSelector";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.dashboard"), path: "/dashboard" },
    { label: t("nav.schemes"), path: "/schemes" },
    { label: "Scholarships", path: "/scholarships" },
    { label: t("nav.analytics"), path: "/analytics" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/90 backdrop-blur-xl">
      {/* Tricolor accent */}
      <div className="tricolor-bar" />
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm transition-transform duration-200 group-hover:scale-105">
            <Shield className="h-4.5 w-4.5 text-primary-foreground" />
            <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-saffron" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold leading-tight text-foreground tracking-tight">
              India Fund Tracker
            </span>
            <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground">Public Transparency</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "text-foreground bg-muted/70"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {item.label}
              {location.pathname === item.path && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-secondary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSelector />
          <StateSelector />
          <Button variant="outline" size="sm" className="text-xs font-medium border-border/60 hover:border-border">{t("nav.reportIssue")}</Button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/40 bg-card p-4 md:hidden animate-fade-in">
          <div className="mb-3 flex gap-2">
            <LanguageSelector className="flex-1" />
            <StateSelector className="flex-1" />
          </div>
          <nav className="flex flex-col gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  location.pathname === item.path ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3">
            <Button variant="outline" size="sm" className="w-full text-xs">{t("nav.reportIssue")}</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
