export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      invoices: {
        Row: {
          created_at: string | null
          customer_country: string
          customer_name: string | null
          customer_vat_id: string | null
          date: string
          id: string
          invoice_id: string
          net_amount: number
          product_type: string | null
          status: string | null
          upload_id: string
          vat_amount: number
          vat_rate_percent: number
        }
        Insert: {
          created_at?: string | null
          customer_country: string
          customer_name?: string | null
          customer_vat_id?: string | null
          date: string
          id?: string
          invoice_id: string
          net_amount: number
          product_type?: string | null
          status?: string | null
          upload_id: string
          vat_amount: number
          vat_rate_percent: number
        }
        Update: {
          created_at?: string | null
          customer_country?: string
          customer_name?: string | null
          customer_vat_id?: string | null
          date?: string
          id?: string
          invoice_id?: string
          net_amount?: number
          product_type?: string | null
          status?: string | null
          upload_id?: string
          vat_amount?: number
          vat_rate_percent?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoices_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      uploads: {
        Row: {
          created_at: string | null
          errors_found: number | null
          file_size: number | null
          file_type: string
          filename: string
          id: string
          period: string | null
          processed: boolean | null
          processing_progress: number | null
          processing_status: string | null
          row_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          errors_found?: number | null
          file_size?: number | null
          file_type: string
          filename: string
          id?: string
          period?: string | null
          processed?: boolean | null
          processing_progress?: number | null
          processing_status?: string | null
          row_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          errors_found?: number | null
          file_size?: number | null
          file_type?: string
          filename?: string
          id?: string
          period?: string | null
          processed?: boolean | null
          processing_progress?: number | null
          processing_status?: string | null
          row_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "uploads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          company_id: string | null
          company_name: string
          country_code: string
          created_at: string | null
          email: string
          health_score: number | null
          id: string
          onboarding_completed: boolean | null
          plan_tier: string | null
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_status: string | null
          updated_at: string | null
          vat_id: string | null
        }
        Insert: {
          company_id?: string | null
          company_name: string
          country_code?: string
          created_at?: string | null
          email: string
          health_score?: number | null
          id: string
          onboarding_completed?: boolean | null
          plan_tier?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          vat_id?: string | null
        }
        Update: {
          company_id?: string | null
          company_name?: string
          country_code?: string
          created_at?: string | null
          email?: string
          health_score?: number | null
          id?: string
          onboarding_completed?: boolean | null
          plan_tier?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          vat_id?: string | null
        }
        Relationships: []
      }
      vat_errors: {
        Row: {
          auto_fixable: boolean | null
          confidence_score: number | null
          created_at: string | null
          error_type: string
          id: string
          invoice_id: string
          message: string
          penalty_risk_eur: number | null
          resolved: boolean | null
          severity: string | null
          suggested_fix: string | null
        }
        Insert: {
          auto_fixable?: boolean | null
          confidence_score?: number | null
          created_at?: string | null
          error_type: string
          id?: string
          invoice_id: string
          message: string
          penalty_risk_eur?: number | null
          resolved?: boolean | null
          severity?: string | null
          suggested_fix?: string | null
        }
        Update: {
          auto_fixable?: boolean | null
          confidence_score?: number | null
          created_at?: string | null
          error_type?: string
          id?: string
          invoice_id?: string
          message?: string
          penalty_risk_eur?: number | null
          resolved?: boolean | null
          severity?: string | null
          suggested_fix?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vat_errors_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_savings: {
        Row: {
          id: string
          company_id: string
          user_id: string
          period: string
          total_errors_fixed: number | null
          total_penalty_avoided: number | null
          auto_fix_count: number | null
          manual_fix_count: number | null
          processing_time_saved_hours: number | null
          estimated_manual_cost: number | null
          traditional_method_cost: number | null
          vatana_cost: number | null
          net_savings: number | null
          roi_percentage: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          period: string
          total_errors_fixed?: number | null
          total_penalty_avoided?: number | null
          auto_fix_count?: number | null
          manual_fix_count?: number | null
          processing_time_saved_hours?: number | null
          estimated_manual_cost?: number | null
          traditional_method_cost?: number | null
          vatana_cost?: number | null
          net_savings?: number | null
          roi_percentage?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string
          period?: string
          total_errors_fixed?: number | null
          total_penalty_avoided?: number | null
          auto_fix_count?: number | null
          manual_fix_count?: number | null
          processing_time_saved_hours?: number | null
          estimated_manual_cost?: number | null
          traditional_method_cost?: number | null
          vatana_cost?: number | null
          net_savings?: number | null
          roi_percentage?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cost_savings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      fix_history: {
        Row: {
          id: string
          company_id: string
          user_id: string
          error_id: string | null
          invoice_id: string
          fix_type: string
          fix_strategy: string
          before_value: Json
          after_value: Json
          penalty_avoided: number
          time_saved_minutes: number | null
          fixed_at: string | null
          can_undo: boolean | null
          undone: boolean | null
          undone_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          error_id?: string | null
          invoice_id: string
          fix_type: string
          fix_strategy: string
          before_value: Json
          after_value: Json
          penalty_avoided: number
          time_saved_minutes?: number | null
          fixed_at?: string | null
          can_undo?: boolean | null
          undone?: boolean | null
          undone_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string
          error_id?: string | null
          invoice_id?: string
          fix_type?: string
          fix_strategy?: string
          before_value?: Json
          after_value?: Json
          penalty_avoided?: number
          time_saved_minutes?: number | null
          fixed_at?: string | null
          can_undo?: boolean | null
          undone?: boolean | null
          undone_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fix_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fix_history_error_id_fkey"
            columns: ["error_id"]
            isOneToOne: false
            referencedRelation: "vat_errors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fix_history_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          id: string
          company_id: string
          user_id: string
          type: string
          title: string
          message: string
          severity: string | null
          sent_via: string[] | null
          sent_at: string | null
          read: boolean | null
          read_at: string | null
          action_url: string | null
          action_label: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          company_id: string
          user_id: string
          type: string
          title: string
          message: string
          severity?: string | null
          sent_via?: string[] | null
          sent_at?: string | null
          read?: boolean | null
          read_at?: string | null
          action_url?: string | null
          action_label?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          severity?: string | null
          sent_via?: string[] | null
          sent_at?: string | null
          read?: boolean | null
          read_at?: string | null
          action_url?: string | null
          action_label?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

