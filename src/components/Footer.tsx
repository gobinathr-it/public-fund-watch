import { Shield } from "lucide-react";

const Footer = () => (
  <footer className="border-t bg-card py-10">
    <div className="container">
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-secondary" />
          <span className="font-display text-sm font-bold text-foreground">
            Tamil Nadu Fund Tracker
          </span>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          தமிழ்நாடு அரசு நிதி வெளிப்படைத்தன்மை தளம் • An initiative for public fund transparency. © 2026
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
