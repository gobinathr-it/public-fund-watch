import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Shield, MapPin, Users, IndianRupee, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGovernmentScheme } from "@/hooks/useGovernmentSchemes";
import SchemeApplyButton from "@/components/SchemeApplyButton";
import { motion } from "framer-motion";

const GovtSchemeDetailPage = () => {
  const { id } = useParams();
  const { data: s, isLoading } = useGovernmentScheme(id);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!s) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Scheme not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/govt-schemes">Back to Schemes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-10">
      <div className="container max-w-4xl space-y-6">
        <Link to="/govt-schemes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Government Schemes
        </Link>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Shield className="h-5 w-5 text-secondary" />
            <Badge variant="outline" className="text-[10px]">{s.government_type} Government</Badge>
            <Badge variant="outline" className="text-[10px]">{s.category}</Badge>
            <Badge variant="outline" className="text-[10px]">{s.status}</Badge>
          </div>
          <h1 className="font-display text-xl font-bold md:text-2xl leading-tight">{s.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {s.state}</span>
            <span>{s.department}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-secondary/30 bg-secondary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-secondary" /> Benefit Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-secondary">{s.benefit_amount}</p>
              {s.coverage_amount && (
                <p className="text-xs text-muted-foreground mt-1">Coverage: {s.coverage_amount}</p>
              )}
              {s.premium && (
                <p className="text-xs text-muted-foreground">Premium: {s.premium}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Eligibility Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              {s.target_beneficiaries && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target</span>
                  <span className="font-medium text-right max-w-[60%]">{s.target_beneficiaries}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gender</span>
                <span className="font-medium">{s.gender_eligibility}</span>
              </div>
              {(s.age_min || s.age_max) && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age</span>
                  <span className="font-medium">
                    {s.age_min || "N/A"} - {s.age_max || "No limit"} years
                  </span>
                </div>
              )}
              {s.income_limit && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Income Limit</span>
                  <span className="font-medium">₹{(s.income_limit / 100000).toFixed(1)} Lakh</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Eligibility Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.eligibility_criteria}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-1.5 sm:grid-cols-2">
              {s.required_documents.map((doc, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                  <span className="text-muted-foreground">{doc}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {s.application_process && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-saffron" /> How to Apply
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.application_process}</p>
            </CardContent>
          </Card>
        )}

        <div className="pt-2">
          <SchemeApplyButton
            applicationLink={s.application_link}
            state={s.state}
            category={s.category}
            governmentType={s.government_type}
            schemeName={s.name}
            icon={<Shield className="h-3 w-3" />}
          />
        </div>
      </div>
    </div>
  );
};

export default GovtSchemeDetailPage;
