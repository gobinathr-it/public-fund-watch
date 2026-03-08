import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo.png";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border/40 bg-background">
      {/* Tricolor accent */}
      <div className="flex h-[3px]">
        <div className="flex-1 bg-saffron" />
        <div className="flex-1 bg-background" />
        <div className="flex-1 bg-primary" />
      </div>
      <div className="container py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <span className="font-display text-sm font-bold text-foreground tracking-tight">
              India Fund & Scheme Tracker
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            {t("footer.tagline")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;