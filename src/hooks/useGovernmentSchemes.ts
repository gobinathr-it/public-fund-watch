import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type GovernmentScheme = {
  id: string;
  name: string;
  state: string;
  government_type: string;
  category: string;
  department: string;
  description: string;
  eligibility_criteria: string;
  target_beneficiaries: string | null;
  benefit_amount: string;
  age_min: number | null;
  age_max: number | null;
  income_limit: number | null;
  gender_eligibility: string;
  required_documents: string[];
  application_process: string | null;
  application_link: string | null;
  coverage_amount: string | null;
  premium: string | null;
  status: string;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

export function useGovernmentSchemes(filters: {
  state?: string;
  category?: string;
  gender?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ["government_schemes", filters],
    queryFn: async () => {
      let q = supabase
        .from("government_schemes")
        .select("*")
        .order("name");

      if (filters.state && filters.state !== "All India") {
        q = q.or(`state.eq.${filters.state},state.eq.All India`);
      }
      if (filters.category && filters.category !== "All") {
        q = q.eq("category", filters.category as any);
      }
      if (filters.gender && filters.gender !== "All") {
        q = q.or(`gender_eligibility.eq.${filters.gender},gender_eligibility.eq.Both`);
      }

      const { data, error } = await q;
      if (error) throw error;

      let results = (data || []) as unknown as GovernmentScheme[];

      if (filters.search) {
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

export function useGovernmentScheme(id: string | undefined) {
  return useQuery({
    queryKey: ["government_scheme", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("government_schemes")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as unknown as GovernmentScheme;
    },
    enabled: !!id,
  });
}
