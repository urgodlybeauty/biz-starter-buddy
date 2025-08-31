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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      banking_options: {
        Row: {
          bank_results: Json
          created_at: string
          id: string
          updated_at: string
          user_id: string
          zip_code: string
        }
        Insert: {
          bank_results: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
          zip_code: string
        }
        Update: {
          bank_results?: Json
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
          zip_code?: string
        }
        Relationships: []
      }
      business_licenses: {
        Row: {
          business_state: string
          business_type: string
          business_zip: string
          created_at: string
          id: string
          license_links: string[] | null
          permit_requirements: string[] | null
          required_licenses: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          business_state: string
          business_type: string
          business_zip: string
          created_at?: string
          id?: string
          license_links?: string[] | null
          permit_requirements?: string[] | null
          required_licenses?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          business_state?: string
          business_type?: string
          business_zip?: string
          created_at?: string
          id?: string
          license_links?: string[] | null
          permit_requirements?: string[] | null
          required_licenses?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ein_applications: {
        Row: {
          banking_info: string | null
          business_activity_code: string | null
          business_address: string
          business_city: string
          business_name: string
          business_purpose: string
          business_state: string
          business_type: string
          business_zip: string
          created_at: string
          employees_expected: number | null
          federal_tax_deposits: string | null
          id: string
          mailing_address: string | null
          responsible_party_name: string
          responsible_party_ssn: string | null
          start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          banking_info?: string | null
          business_activity_code?: string | null
          business_address: string
          business_city: string
          business_name: string
          business_purpose: string
          business_state: string
          business_type: string
          business_zip: string
          created_at?: string
          employees_expected?: number | null
          federal_tax_deposits?: string | null
          id?: string
          mailing_address?: string | null
          responsible_party_name: string
          responsible_party_ssn?: string | null
          start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          banking_info?: string | null
          business_activity_code?: string | null
          business_address?: string
          business_city?: string
          business_name?: string
          business_purpose?: string
          business_state?: string
          business_type?: string
          business_zip?: string
          created_at?: string
          employees_expected?: number | null
          federal_tax_deposits?: string | null
          id?: string
          mailing_address?: string | null
          responsible_party_name?: string
          responsible_party_ssn?: string | null
          start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      llc_applications: {
        Row: {
          business_address: string
          business_city: string
          business_purpose: string
          business_state: string
          business_zip: string
          created_at: string
          duration: string | null
          effective_date: string | null
          id: string
          llc_name: string
          management_structure: string
          member_names: string[] | null
          organizer_address: string
          organizer_name: string
          registered_agent_address: string
          registered_agent_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_address: string
          business_city: string
          business_purpose: string
          business_state: string
          business_zip: string
          created_at?: string
          duration?: string | null
          effective_date?: string | null
          id?: string
          llc_name: string
          management_structure: string
          member_names?: string[] | null
          organizer_address: string
          organizer_name: string
          registered_agent_address: string
          registered_agent_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_address?: string
          business_city?: string
          business_purpose?: string
          business_state?: string
          business_zip?: string
          created_at?: string
          duration?: string | null
          effective_date?: string | null
          id?: string
          llc_name?: string
          management_structure?: string
          member_names?: string[] | null
          organizer_address?: string
          organizer_name?: string
          registered_agent_address?: string
          registered_agent_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
