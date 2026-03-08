import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Heart, Shield, Users, Accessibility, Clock, Baby, Tractor, ArrowRight, MapPin, IndianRupee, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGovernmentSchemes, GovernmentScheme } from "@/hooks/useGovernmentSchemes";
import { useStateContext } from "@/contexts/StateContext";
import { motion } from "framer-motion";

const schemeCategories = [
  "All",
  "Medical & Health",
  "Insurance",
  "Welfare Board",
  "Disability",
  "Senior Citizen",
  "Women Welfare",
  "Agriculture",
  "Housing",
  "Employment",
  "Social Justice",
];

const categoryIcons: Record<string, React.ReactNode> = {
  "Medical & Health": <Heart className="h-3.5 w-3.5" />,
  Insurance: <Shield className="h-3.5 w-3.5" />,
  "Welfare Board": <Users className="h-3.5 w-3.5" />,
  Disability: <Accessibility className="h-3.5 w-3.5" />,
  "Senior Citizen": <Clock className="h-3.5 w-3.5" />,
  "Women Welfare": <Baby className="h-3.5 w-3.5" />,
  Agriculture: <Tractor className="h-3.5 w-3.5" />,
};

const categoryColors: Record<string, string> = {
  "Medical & Health": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  Insurance: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  "Welfare Board": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Disability: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  "Senior Citizen": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Women Welfare": "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  Agriculture: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Housing: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  Employment: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  "Social Justice": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
};

const genderOptions = ["All", "Boys", "Girls"];

const SchemeCard = ({ s, index }: { s: GovernmentScheme; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.03, duration: 0.3 }}
  >
      <Card className="group hover-lift border-border/60 bg-card transition-all duration-300 hover:border-secondary/40 hover:shadow-md h-full">
        <CardContent className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-sm font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-secondary transition-colors">
                {s.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{s.department}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2">{s.description}</p>

          <div className="flex flex-wrap gap-1.5">
            <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${categoryColors[s.category] || ""}`}>
              {s.category}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0.5">
              {s.government_type}
            </Badge>
            {s.gender_eligibility !== "Both" && (
              <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300">
                {s.gender_eligibility}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/40">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {s.state}
            </span>
            <span className="flex items-center gap-1 truncate">
              <IndianRupee className="h-3 w-3" /> {s.benefit_amount}
            </span>
          </div>

          <div className="flex gap-2 pt-1">
            <Link to={`/govt-schemes/${s.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs h-8 rounded-lg gap-1">
                View Details <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
            {s.application_link && (
              <a href={s.application_link} target="_blank" rel="noopener noreferrer" className="flex-1" onClick={(e) => e.stopPropagation()}>
                <Button size="sm" className="w-full text-xs h-8 rounded-lg gap-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                  <ExternalLink className="h-3 w-3" /> Apply Now
                </Button>
              </a>
            )}
          </div>
        </CardContent>
      </Card>
  </motion.div>
);

const GovtSchemesPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [gender, setGender] = useState("All");
  const { selectedState } = useStateContext();

  const { data: schemes = [], isLoading } = useGovernmentSchemes({
    state: selectedState,
    category,
    gender,
    search,
  });

  return (
    <div className="py-8 md:py-10">
      <div className="container space-y-6">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-5 w-5 text-secondary" />
            <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary">Explorer</p>
          </div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            {selectedState === "All India" ? "All India Government Schemes" : `${selectedState} Government Schemes`}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover medical, insurance, welfare, disability, senior citizen, and women welfare schemes across India.
          </p>
        </motion.div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search schemes by name, department, state..."
              className="pl-11 h-11 rounded-xl border-border/60 focus-visible:ring-secondary/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={gender} onValueChange={setGender}>
            <SelectTrigger className="w-[130px] h-10 text-xs rounded-lg">
              <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((g) => (
                <SelectItem key={g} value={g}>{g === "All" ? "All Genders" : g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-2">
          {schemeCategories.map((c) => (
            <Badge
              key={c}
              variant={category === c ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 rounded-lg px-3.5 py-1.5 text-xs gap-1.5 ${
                category === c
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "hover:bg-muted border-border/60"
              }`}
              onClick={() => setCategory(c)}
            >
              {categoryIcons[c]}
              {c === "All" ? "All Categories" : c}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted/40 rounded-lg px-4 py-2.5">
          <span className="font-medium text-foreground">{schemes.length}</span> schemes found
          {selectedState !== "All India" && <span>• Showing {selectedState} + Central schemes</span>}
        </div>

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
              <span className="text-sm">Loading schemes...</span>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {schemes.map((s, i) => (
              <SchemeCard key={s.id} s={s} index={i} />
            ))}
          </div>
        )}

        {!isLoading && schemes.length === 0 && (
          <div className="py-20 text-center text-muted-foreground text-sm">
            No schemes found matching your criteria. Try adjusting filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default GovtSchemesPage;
