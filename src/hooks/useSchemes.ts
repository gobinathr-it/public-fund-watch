import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Scheme = {
  id: string;
  name: string;
  name_ta: string | null;
  department: string;
  description: string;
  description_ta: string | null;
  total_budget: number;
  spent: number;
  category: string;
  status: string;
  state: string | null;
  government_type: string;
  target_beneficiaries: string | null;
  announcement_date: string | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
};

export type DistrictAllocation = {
  id: string;
  scheme_id: string;
  district: string;
  allocated: number;
  spent: number;
  state: string | null;
  created_at: string;
};

export type Expense = {
  id: string;
  scheme_id: string;
  title: string;
  amount: number;
  expense_date: string;
  district: string;
  department: string;
  description: string | null;
  category: string;
  status: string;
  has_proof: boolean;
  proof_url: string | null;
  geo_lat: number | null;
  geo_lng: number | null;
  state: string | null;
  created_at: string;
};

export function useSchemes(category?: string, state?: string) {
  return useQuery({
    queryKey: ["schemes", category, state],
    queryFn: async () => {
      let q = supabase.from("schemes").select("*").order("total_budget", { ascending: false });
      if (category && category !== "All") {
        q = q.eq("category", category as any);
      }
      if (state && state !== "All India") {
        // Show state-specific + central schemes for that state
        q = q.or(`state.eq.${state},state.eq.All India`);
      }
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as unknown as Scheme[];
    },
  });
}

export function useScheme(id: string | undefined) {
  return useQuery({
    queryKey: ["scheme", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("schemes").select("*").eq("id", id).single();
      if (error) throw error;
      return data as unknown as Scheme;
    },
    enabled: !!id,
  });
}

export function useDistrictAllocations(schemeId: string | undefined) {
  return useQuery({
    queryKey: ["district_allocations", schemeId],
    queryFn: async () => {
      if (!schemeId) return [];
      const { data, error } = await supabase
        .from("district_allocations")
        .select("*")
        .eq("scheme_id", schemeId)
        .order("allocated", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as DistrictAllocation[];
    },
    enabled: !!schemeId,
  });
}

export function useExpenses(schemeId?: string) {
  return useQuery({
    queryKey: ["expenses", schemeId],
    queryFn: async () => {
      let q = supabase.from("expenses").select("*").order("expense_date", { ascending: false });
      if (schemeId) {
        q = q.eq("scheme_id", schemeId);
      }
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as unknown as Expense[];
    },
  });
}

export function useAllDistrictAllocations(state?: string) {
  return useQuery({
    queryKey: ["all_district_allocations", state],
    queryFn: async () => {
      let q = supabase.from("district_allocations").select("*");
      if (state && state !== "All India") {
        q = q.eq("state", state);
      }
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as unknown as DistrictAllocation[];
    },
  });
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000000000) return `₹${(amount / 10000000000).toFixed(1)}K Cr`;
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(0)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatCurrencyShort(crores: number): string {
  return `₹${crores.toLocaleString("en-IN")} Cr`;
}
