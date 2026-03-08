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
    { label: t("nav.analytics"), path: "/analytics" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base font-bold leading-tight text-foreground">
              India Fund Tracker
            </span>
            <span className="text-[10px] leading-tight text-muted-foreground">Public Transparency Platform</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <LanguageSelector />
          <StateSelector />
          <Button variant="outline" size="sm">{t("nav.reportIssue")}</Button>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t bg-card p-4 md:hidden">
          <div className="mb-3 flex gap-2">
            <LanguageSelector className="flex-1" />
            <StateSelector className="flex-1" />
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2 text-sm font-medium ${
                  location.pathname === item.path ? "bg-muted text-foreground" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3">
            <Button variant="outline" size="sm" className="w-full">{t("nav.reportIssue")}</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
