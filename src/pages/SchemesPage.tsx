import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SchemeCard from "@/components/SchemeCard";
import { useSchemes } from "@/hooks/useSchemes";
import { useStateContext } from "@/contexts/StateContext";

const categories = ["All", "Education", "Healthcare", "Agriculture", "Welfare", "Infrastructure", "Housing", "Employment"];
const govTypes = ["All", "Central", "State"];

const SchemesPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [govType, setGovType] = useState("All");
  const { selectedState } = useStateContext();
  const { data: schemes = [], isLoading } = useSchemes(undefined, selectedState);

  const filtered = schemes.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      (s.name_ta && s.name_ta.includes(search)) ||
      (s.state && s.state.toLowerCase().includes(search.toLowerCase()));
    const matchCat = category === "All" || s.category === category;
    const matchGov = govType === "All" || s.government_type === govType;
    return matchSearch && matchCat && matchGov;
  });

  return (
    <div className="py-6 md:py-8">
      <div className="container space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">
            {selectedState === "All India" ? "All India Government Schemes" : `${selectedState} Schemes`}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse and track public welfare programmes • Use the state selector in the navbar to filter by state
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search schemes, states, departments..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {/* Gov type filter */}
        <div className="flex flex-wrap gap-2">
          {govTypes.map((g) => (
            <Badge
              key={g}
              variant={govType === g ? "default" : "outline"}
              className={`cursor-pointer ${govType === g ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
              onClick={() => setGovType(g)}
            >
              {g === "All" ? "All Types" : `${g} Govt`}
            </Badge>
          ))}
          <span className="mx-2 border-l" />
          {categories.map((c) => (
            <Badge
              key={c}
              variant={category === c ? "default" : "outline"}
              className={`cursor-pointer ${category === c ? "bg-secondary text-secondary-foreground" : "hover:bg-muted"}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </Badge>
          ))}
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-muted-foreground">Loading schemes...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s, i) => <SchemeCard key={s.id} scheme={s} index={i} />)}
          </div>
        )}

        {!isLoading && filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">No schemes found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default SchemesPage;
