import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Scholarship = {
  id: string;
  name: string;
  state: string;
  department: string;
  description: string;
  eligibility_criteria: string;
  age_min: number | null;
  age_max: number | null;
  income_limit: number | null;
  gender_eligibility: "Boys" | "Girls" | "Both";
  education_level: "School" | "College" | "Engineering" | "Medical" | "Postgraduate" | "All";
  category: "Merit" | "Financial" | "Minority" | "SC/ST" | "BC/OBC" | "Women" | "Disability" | "General";
  required_documents: string[];
  application_process: string | null;
  benefit_amount: string;
  application_link: string | null;
  government_type: "Central" | "State";
  course_type: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

export function useScholarships(filters?: {
  state?: string;
  education_level?: string;
  gender?: string;
  category?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["scholarships", filters],
    queryFn: async () => {
      let q = supabase.from("scholarships").select("*").order("name") as any;

      if (filters?.state && filters.state !== "All India") {
        q = q.or(`state.eq.${filters.state},state.eq.All India`);
      }
      if (filters?.education_level && filters.education_level !== "All") {
        q = q.or(`education_level.eq.${filters.education_level},education_level.eq.All`);
      }
      if (filters?.gender && filters.gender !== "All") {
        q = q.or(`gender_eligibility.eq.${filters.gender},gender_eligibility.eq.Both`);
      }
      if (filters?.category && filters.category !== "All") {
        q = q.eq("category", filters.category);
      }

      const { data, error } = await q;
      if (error) throw error;

      let results = (data || []) as unknown as Scholarship[];

      if (filters?.search) {
        const s = filters.search.toLowerCase();
        results = results.filter(
          (r) =>
            r.name.toLowerCase().includes(s) ||
            r.department.toLowerCase().includes(s) ||
            r.description.toLowerCase().includes(s) ||
            r.state.toLowerCase().includes(s)
        );
      }

      return results;
    },
  });
}

export function useScholarship(id: string | undefined) {
  return useQuery({
    queryKey: ["scholarship", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("scholarships")
        .select("*")
        .eq("id", id)
        .single() as any;
      if (error) throw error;
      return data as unknown as Scholarship;
    },
    enabled: !!id,
  });
}
