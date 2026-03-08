export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      district_allocations: {
        Row: {
          allocated: number
          created_at: string
          district: string
          id: string
          scheme_id: string
          spent: number
        }
        Insert: {
          allocated: number
          created_at?: string
          district: string
          id?: string
          scheme_id: string
          spent?: number
        }
        Update: {
          allocated?: number
          created_at?: string
          district?: string
          id?: string
          scheme_id?: string
          spent?: number
        }
        Relationships: [
          {
            foreignKeyName: "district_allocations_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "schemes"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          department: string
          description: string | null
          district: string
          expense_date: string
          geo_lat: number | null
          geo_lng: number | null
          has_proof: boolean
          id: string
          proof_url: string | null
          scheme_id: string
          status: Database["public"]["Enums"]["expense_status"]
          title: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          department: string
          description?: string | null
          district: string
          expense_date: string
          geo_lat?: number | null
          geo_lng?: number | null
          has_proof?: boolean
          id?: string
          proof_url?: string | null
          scheme_id: string
          status?: Database["public"]["Enums"]["expense_status"]
          title: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          department?: string
          description?: string | null
          district?: string
          expense_date?: string
          geo_lat?: number | null
          geo_lng?: number | null
          has_proof?: boolean
          id?: string
          proof_url?: string | null
          scheme_id?: string
          status?: Database["public"]["Enums"]["expense_status"]
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "schemes"
            referencedColumns: ["id"]
          },
        ]
      }
      schemes: {
        Row: {
          announcement_date: string | null
          category: Database["public"]["Enums"]["scheme_category"]
          created_at: string
          department: string
          description: string
          description_ta: string | null
          end_date: string | null
          id: string
          name: string
          name_ta: string | null
          spent: number
          start_date: string | null
          status: Database["public"]["Enums"]["scheme_status"]
          target_beneficiaries: string | null
          total_budget: number
          updated_at: string
        }
        Insert: {
          announcement_date?: string | null
          category: Database["public"]["Enums"]["scheme_category"]
          created_at?: string
          department: string
          description: string
          description_ta?: string | null
          end_date?: string | null
          id?: string
          name: string
          name_ta?: string | null
          spent?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["scheme_status"]
          target_beneficiaries?: string | null
          total_budget: number
          updated_at?: string
        }
        Update: {
          announcement_date?: string | null
          category?: Database["public"]["Enums"]["scheme_category"]
          created_at?: string
          department?: string
          description?: string
          description_ta?: string | null
          end_date?: string | null
          id?: string
          name?: string
          name_ta?: string | null
          spent?: number
          start_date?: string | null
          status?: Database["public"]["Enums"]["scheme_status"]
          target_beneficiaries?: string | null
          total_budget?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      expense_status: "Verified" | "Pending" | "Flagged" | "Rejected"
      scheme_category:
        | "Education"
        | "Healthcare"
        | "Agriculture"
        | "Welfare"
        | "Infrastructure"
        | "Housing"
        | "Employment"
        | "Women & Child"
        | "Social Justice"
      scheme_status: "Active" | "Completed" | "Upcoming" | "Suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      expense_status: ["Verified", "Pending", "Flagged", "Rejected"],
      scheme_category: [
        "Education",
        "Healthcare",
        "Agriculture",
        "Welfare",
        "Infrastructure",
        "Housing",
        "Employment",
        "Women & Child",
        "Social Justice",
      ],
      scheme_status: ["Active", "Completed", "Upcoming", "Suspended"],
    },
  },
} as const
