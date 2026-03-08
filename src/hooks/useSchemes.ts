import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Scheme = Tables<"schemes">;
export type DistrictAllocation = Tables<"district_allocations">;
export type Expense = Tables<"expenses">;

export function useSchemes(category?: string) {
  return useQuery({
    queryKey: ["schemes", category],
    queryFn: async () => {
      let q = supabase.from("schemes").select("*").order("total_budget", { ascending: false });
      if (category && category !== "All") {
        q = q.eq("category", category as any);
      }
      const { data, error } = await q;
      if (error) throw error;
      return data as Scheme[];
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
      return data as Scheme;
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
      return data as DistrictAllocation[];
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
      return data as Expense[];
    },
  });
}

export function useAllDistrictAllocations() {
  return useQuery({
    queryKey: ["all_district_allocations"],
    queryFn: async () => {
      const { data, error } = await supabase.from("district_allocations").select("*");
      if (error) throw error;
      return data as DistrictAllocation[];
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
