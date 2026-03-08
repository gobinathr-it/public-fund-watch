import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SchemeCard from "@/components/SchemeCard";
import { useSchemes } from "@/hooks/useSchemes";

const categories = ["All", "Education", "Healthcare", "Agriculture", "Welfare", "Infrastructure", "Housing", "Employment"];

const SchemesPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { data: schemes = [], isLoading } = useSchemes();

  const filtered = schemes.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.department.toLowerCase().includes(search.toLowerCase()) ||
      (s.name_ta && s.name_ta.includes(search));
    const matchCat = category === "All" || s.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="py-6 md:py-8">
      <div className="container space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold md:text-3xl">Tamil Nadu Government Schemes</h1>
          <p className="mt-1 text-sm text-muted-foreground">தமிழ்நாடு அரசுத் திட்டங்கள் • Browse and track all public welfare programmes</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search schemes (English / தமிழ்)..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Badge
                key={c}
                variant={category === c ? "default" : "outline"}
                className={`cursor-pointer ${category === c ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                onClick={() => setCategory(c)}
              >
                {c}
              </Badge>
            ))}
          </div>
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
