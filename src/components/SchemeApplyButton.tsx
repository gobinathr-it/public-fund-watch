import { ExternalLink, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFallbackPortal, ensureHttps } from "@/lib/officialPortals";

interface SchemeApplyButtonProps {
  applicationLink: string | null;
  state: string;
  category: string;
  governmentType: string;
  schemeName: string;
  icon?: React.ReactNode;
}

const SchemeApplyButton = ({
  applicationLink,
  state,
  category,
  governmentType,
  schemeName,
  icon,
}: SchemeApplyButtonProps) => {
  const fallback = getFallbackPortal(state, category, governmentType);
  const primaryLink = applicationLink ? ensureHttps(applicationLink) : null;

  return (
    <div className="space-y-3">
      {/* Primary Apply Button */}
      {primaryLink && (
        <Button
          asChild
          size="lg"
          className="w-full sm:w-auto gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <a href={primaryLink} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" /> Apply Now - Official Portal
          </a>
        </Button>
      )}

      {/* Fallback Portal Button - always shown as alternative */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        {!primaryLink && (
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <a href={fallback.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" /> Apply via {fallback.name}
            </a>
          </Button>
        )}
        {primaryLink && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs"
          >
            <a href={fallback.url} target="_blank" rel="noopener noreferrer">
              <AlertTriangle className="h-3 w-3" /> Link not working? Visit {fallback.name}
            </a>
          </Button>
        )}
      </div>

      {/* Safety notice */}
      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
        {icon || <Shield className="h-3 w-3" />}
        This platform redirects users to official government websites for submitting applications. Always verify the URL before entering personal information.
      </p>
    </div>
  );
};

export default SchemeApplyButton;
