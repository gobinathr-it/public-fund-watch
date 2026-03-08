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
          state: string | null
        }
        Insert: {
          allocated: number
          created_at?: string
          district: string
          id?: string
          scheme_id: string
          spent?: number
          state?: string | null
        }
        Update: {
          allocated?: number
          created_at?: string
          district?: string
          id?: string
          scheme_id?: string
          spent?: number
          state?: string | null
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
          state: string | null
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
          state?: string | null
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
          state?: string | null
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
      government_schemes: {
        Row: {
          age_max: number | null
          age_min: number | null
          application_link: string | null
          application_process: string | null
          benefit_amount: string
          category: Database["public"]["Enums"]["govt_scheme_category"]
          coverage_amount: string | null
          created_at: string
          department: string
          description: string
          eligibility_criteria: string
          end_date: string | null
          gender_eligibility: Database["public"]["Enums"]["gender_eligibility"]
          government_type: Database["public"]["Enums"]["government_type"]
          id: string
          income_limit: number | null
          name: string
          premium: string | null
          required_documents: string[]
          start_date: string | null
          state: string
          status: Database["public"]["Enums"]["scheme_status"]
          target_beneficiaries: string | null
          updated_at: string
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          application_link?: string | null
          application_process?: string | null
          benefit_amount: string
          category: Database["public"]["Enums"]["govt_scheme_category"]
          coverage_amount?: string | null
          created_at?: string
          department: string
          description: string
          eligibility_criteria: string
          end_date?: string | null
          gender_eligibility?: Database["public"]["Enums"]["gender_eligibility"]
          government_type?: Database["public"]["Enums"]["government_type"]
          id?: string
          income_limit?: number | null
          name: string
          premium?: string | null
          required_documents?: string[]
          start_date?: string | null
          state?: string
          status?: Database["public"]["Enums"]["scheme_status"]
          target_beneficiaries?: string | null
          updated_at?: string
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          application_link?: string | null
          application_process?: string | null
          benefit_amount?: string
          category?: Database["public"]["Enums"]["govt_scheme_category"]
          coverage_amount?: string | null
          created_at?: string
          department?: string
          description?: string
          eligibility_criteria?: string
          end_date?: string | null
          gender_eligibility?: Database["public"]["Enums"]["gender_eligibility"]
          government_type?: Database["public"]["Enums"]["government_type"]
          id?: string
          income_limit?: number | null
          name?: string
          premium?: string | null
          required_documents?: string[]
          start_date?: string | null
          state?: string
          status?: Database["public"]["Enums"]["scheme_status"]
          target_beneficiaries?: string | null
          updated_at?: string
        }
        Relationships: []
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
          government_type: Database["public"]["Enums"]["government_type"]
          id: string
          name: string
          name_ta: string | null
          spent: number
          start_date: string | null
          state: string | null
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
          government_type?: Database["public"]["Enums"]["government_type"]
          id?: string
          name: string
          name_ta?: string | null
          spent?: number
          start_date?: string | null
          state?: string | null
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
          government_type?: Database["public"]["Enums"]["government_type"]
          id?: string
          name?: string
          name_ta?: string | null
          spent?: number
          start_date?: string | null
          state?: string | null
          status?: Database["public"]["Enums"]["scheme_status"]
          target_beneficiaries?: string | null
          total_budget?: number
          updated_at?: string
        }
        Relationships: []
      }
      scholarships: {
        Row: {
          age_max: number | null
          age_min: number | null
          application_link: string | null
          application_process: string | null
          benefit_amount: string
          category: Database["public"]["Enums"]["scholarship_category"]
          course_type: string | null
          created_at: string
          department: string
          description: string
          education_level: Database["public"]["Enums"]["education_level"]
          eligibility_criteria: string
          end_date: string | null
          gender_eligibility: Database["public"]["Enums"]["gender_eligibility"]
          government_type: Database["public"]["Enums"]["government_type"]
          id: string
          income_limit: number | null
          name: string
          required_documents: string[]
          start_date: string | null
          state: string
          status: Database["public"]["Enums"]["scheme_status"]
          updated_at: string
        }
        Insert: {
          age_max?: number | null
          age_min?: number | null
          application_link?: string | null
          application_process?: string | null
          benefit_amount: string
          category?: Database["public"]["Enums"]["scholarship_category"]
          course_type?: string | null
          created_at?: string
          department: string
          description: string
          education_level?: Database["public"]["Enums"]["education_level"]
          eligibility_criteria: string
          end_date?: string | null
          gender_eligibility?: Database["public"]["Enums"]["gender_eligibility"]
          government_type?: Database["public"]["Enums"]["government_type"]
          id?: string
          income_limit?: number | null
          name: string
          required_documents?: string[]
          start_date?: string | null
          state?: string
          status?: Database["public"]["Enums"]["scheme_status"]
          updated_at?: string
        }
        Update: {
          age_max?: number | null
          age_min?: number | null
          application_link?: string | null
          application_process?: string | null
          benefit_amount?: string
          category?: Database["public"]["Enums"]["scholarship_category"]
          course_type?: string | null
          created_at?: string
          department?: string
          description?: string
          education_level?: Database["public"]["Enums"]["education_level"]
          eligibility_criteria?: string
          end_date?: string | null
          gender_eligibility?: Database["public"]["Enums"]["gender_eligibility"]
          government_type?: Database["public"]["Enums"]["government_type"]
          id?: string
          income_limit?: number | null
          name?: string
          required_documents?: string[]
          start_date?: string | null
          state?: string
          status?: Database["public"]["Enums"]["scheme_status"]
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
      education_level:
        | "School"
        | "College"
        | "Engineering"
        | "Medical"
        | "Postgraduate"
        | "All"
      expense_status: "Verified" | "Pending" | "Flagged" | "Rejected"
      gender_eligibility: "Boys" | "Girls" | "Both"
      government_type: "Central" | "State"
      govt_scheme_category:
        | "Medical & Health"
        | "Insurance"
        | "Welfare Board"
        | "Disability"
        | "Senior Citizen"
        | "Women Welfare"
        | "Agriculture"
        | "Housing"
        | "Employment"
        | "Social Justice"
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
      scholarship_category:
        | "Merit"
        | "Financial"
        | "Minority"
        | "SC/ST"
        | "BC/OBC"
        | "Women"
        | "Disability"
        | "General"
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
      education_level: [
        "School",
        "College",
        "Engineering",
        "Medical",
        "Postgraduate",
        "All",
      ],
      expense_status: ["Verified", "Pending", "Flagged", "Rejected"],
      gender_eligibility: ["Boys", "Girls", "Both"],
      government_type: ["Central", "State"],
      govt_scheme_category: [
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
      ],
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
      scholarship_category: [
        "Merit",
        "Financial",
        "Minority",
        "SC/ST",
        "BC/OBC",
        "Women",
        "Disability",
        "General",
      ],
    },
  },
} as const
