import { useParams, Link } from "react-router-dom";
import { ArrowLeft, GraduationCap, MapPin, Calendar, Users, IndianRupee, FileText, ExternalLink, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useScholarship } from "@/hooks/useScholarships";
import { motion } from "framer-motion";

const ScholarshipDetailPage = () => {
  const { id } = useParams();
  const { data: s, isLoading } = useScholarship(id);

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
        <p className="text-muted-foreground">Scholarship not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/scholarships">Back to Scholarships</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-10">
      <div className="container max-w-4xl space-y-6">
        {/* Back */}
        <Link to="/scholarships" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Scholarships
        </Link>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-secondary" />
            <Badge variant="outline" className="text-[10px]">{s.government_type} Government</Badge>
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
          {/* Benefit */}
          <Card className="border-secondary/30 bg-secondary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-secondary" /> Benefit Amount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold text-secondary">{s.benefit_amount}</p>
            </CardContent>
          </Card>

          {/* Eligibility Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Eligibility Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Education Level</span>
                <span className="font-medium">{s.education_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gender</span>
                <span className="font-medium">{s.gender_eligibility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium">{s.category}</span>
              </div>
              {s.age_min && s.age_max && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age</span>
                  <span className="font-medium">{s.age_min} - {s.age_max} years</span>
                </div>
              )}
              {s.income_limit && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Income Limit</span>
                  <span className="font-medium">₹{(s.income_limit / 100000).toFixed(1)} Lakh</span>
                </div>
              )}
              {s.course_type && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Course Type</span>
                  <span className="font-medium">{s.course_type}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Full Eligibility */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald" /> Eligibility Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{s.eligibility_criteria}</p>
          </CardContent>
        </Card>

        {/* Required Documents */}
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

        {/* Application Process */}
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

        {/* Apply Button */}
        {s.application_link && (
          <div className="pt-2 space-y-2">
            <Button asChild size="lg" className="w-full sm:w-auto gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white">
              <a href={s.application_link} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" /> Apply Now - Official Portal
              </a>
            </Button>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
              <GraduationCap className="h-3 w-3" /> This platform redirects users to official government websites for submitting applications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipDetailPage;
