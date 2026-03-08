import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, GraduationCap, Filter, ArrowRight, MapPin, Users, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useScholarships, Scholarship } from "@/hooks/useScholarships";
import { useStateContext } from "@/contexts/StateContext";
import { motion } from "framer-motion";

const educationLevels = ["All", "School", "College", "Engineering", "Medical", "Postgraduate"];
const genderOptions = ["All", "Boys", "Girls"];
const categories = ["All", "Merit", "Financial", "Minority", "SC/ST", "BC/OBC", "Women", "General"];

const ScholarshipCard = ({ s, index }: { s: Scholarship; index: number }) => {
  const levelColors: Record<string, string> = {
    School: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    College: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    Engineering: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    Medical: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    Postgraduate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    All: "bg-muted text-muted-foreground",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <Link to={`/scholarships/${s.id}`}>
        <Card className="group hover-lift cursor-pointer border-border/60 bg-card transition-all duration-300 hover:border-secondary/40 hover:shadow-md">
          <CardContent className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-sm font-semibold leading-snug text-foreground line-clamp-2 group-hover:text-secondary transition-colors">
                  {s.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{s.department}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex flex-wrap gap-1.5">
              <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${levelColors[s.education_level]}`}>
                {s.education_level}
              </Badge>
              <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                {s.government_type}
              </Badge>
              {s.gender_eligibility !== "Both" && (
                <Badge variant="outline" className="text-[10px] px-2 py-0.5 bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300">
                  {s.gender_eligibility}
                </Badge>
              )}
              <Badge variant="outline" className="text-[10px] px-2 py-0.5">{s.category}</Badge>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1 border-t border-border/40">
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {s.state}
              </span>
              <span className="flex items-center gap-1">
                <IndianRupee className="h-3 w-3" /> {s.benefit_amount}
              </span>
            </div>

            {s.income_limit && (
              <p className="text-[10px] text-muted-foreground">
                Income Limit: ₹{(s.income_limit / 100000).toFixed(1)} Lakh
              </p>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
};

const ScholarshipsPage = () => {
  const [search, setSearch] = useState("");
  const [educationLevel, setEducationLevel] = useState("All");
  const [gender, setGender] = useState("All");
  const [category, setCategory] = useState("All");
  const { selectedState } = useStateContext();

  const { data: scholarships = [], isLoading } = useScholarships({
    state: selectedState,
    education_level: educationLevel,
    gender,
    category,
    search,
  });

  return (
    <div className="py-8 md:py-10">
      <div className="container space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="h-5 w-5 text-secondary" />
            <p className="text-[11px] font-semibold uppercase tracking-widest text-secondary">Explore</p>
          </div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            {selectedState === "All India" ? "All India Scholarships" : `${selectedState} Scholarships`}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover scholarships and financial assistance schemes across India. Filter by education level, category, and more.
          </p>
        </motion.div>

        {/* Search + Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search scholarships by name, state, department..."
              className="pl-11 h-11 rounded-xl border-border/60 focus-visible:ring-secondary/30"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Select value={educationLevel} onValueChange={setEducationLevel}>
              <SelectTrigger className="w-[140px] h-10 text-xs rounded-lg">
                <GraduationCap className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                <SelectValue placeholder="Education" />
              </SelectTrigger>
              <SelectContent>
                {educationLevels.map((l) => (
                  <SelectItem key={l} value={l}>{l === "All" ? "All Levels" : l}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-[120px] h-10 text-xs rounded-lg">
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
        </div>

        {/* Category badges */}
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Badge
              key={c}
              variant={category === c ? "default" : "outline"}
              className={`cursor-pointer transition-all duration-200 rounded-lg px-3.5 py-1.5 text-xs ${
                category === c
                  ? "bg-secondary text-secondary-foreground shadow-sm"
                  : "hover:bg-muted border-border/60"
              }`}
              onClick={() => setCategory(c)}
            >
              {c === "All" ? "All Categories" : c}
            </Badge>
          ))}
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground bg-muted/40 rounded-lg px-4 py-2.5">
          <span className="font-medium text-foreground">{scholarships.length}</span> scholarships found
          {selectedState !== "All India" && <span>• Showing {selectedState} + Central schemes</span>}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <div className="h-4 w-4 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
              <span className="text-sm">Loading scholarships...</span>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scholarships.map((s, i) => (
              <ScholarshipCard key={s.id} s={s} index={i} />
            ))}
          </div>
        )}

        {!isLoading && scholarships.length === 0 && (
          <div className="py-20 text-center text-muted-foreground text-sm">
            No scholarships found matching your criteria. Try adjusting filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default ScholarshipsPage;
