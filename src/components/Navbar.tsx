import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import StateSelector from "@/components/StateSelector";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  const navItems = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.schemes"), path: "/schemes" },
    { label: "Scholarships", path: "/scholarships" },
    { label: "Govt Schemes", path: "/govt-schemes" },
    { label: t("nav.dashboard"), path: "/dashboard" },
    { label: t("nav.analytics"), path: "/analytics" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged out successfully" });
    navigate("/signup");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-md">
      {/* Tricolor accent line */}
      <div className="flex h-[3px]">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-background" />
        <div className="flex-1 bg-primary" />
      </div>
      <div className="container flex h-[68px] items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group min-w-[220px] lg:min-w-[260px] shrink-0">
          <img src={logo} alt="India Fund & Scheme Tracker" className="h-10 w-10 shrink-0 transition-transform duration-200 group-hover:scale-105" />
          <div className="flex flex-col justify-center">
            <span className="font-display text-sm font-bold leading-tight text-foreground tracking-tight whitespace-nowrap">
              India Fund & Scheme Tracker
            </span>
            <span className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground leading-tight">Public Transparency</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "text-primary bg-accent"
                  : "text-muted-foreground hover:text-primary hover:bg-muted/50"
              }`}
            >
              {item.label}
              {location.pathname === item.path && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <LanguageSelector />
          <StateSelector />
          {user && (
            <Button variant="outline" size="sm" className="text-xs font-medium gap-1.5" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </Button>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-muted/50 transition-colors">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/40 bg-background p-4 lg:hidden animate-fade-in">
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
                    location.pathname === item.path ? "bg-accent text-primary" : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {user && (
            <div className="mt-3">
              <Button variant="outline" size="sm" className="w-full text-xs gap-1.5" onClick={handleLogout}>
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;