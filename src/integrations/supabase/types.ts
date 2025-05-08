export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          id: string
        }
        Insert: {
          created_at?: string
          id: string
        }
        Update: {
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      beta_invites: {
        Row: {
          code: string
          created_at: string
          email: string
          id: string
          used: boolean | null
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          id?: string
          used?: boolean | null
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          id?: string
          used?: boolean | null
          used_at?: string | null
        }
        Relationships: []
      }
      bids: {
        Row: {
          created_at: string
          fee: number
          id: string
          job_id: string
          note: string | null
          portfolio_url: string | null
          status: string
          time_estimate: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fee: number
          id?: string
          job_id: string
          note?: string | null
          portfolio_url?: string | null
          status?: string
          time_estimate: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fee?: number
          id?: string
          job_id?: string
          note?: string | null
          portfolio_url?: string | null
          status?: string
          time_estimate?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bids_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      chats: {
        Row: {
          created_at: string
          id: string
          job_id: string
          message: string
          read: boolean
          recipient_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          message: string
          read?: boolean
          recipient_id: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          message?: string
          read?: boolean
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chats_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancer_profiles: {
        Row: {
          created_at: string
          headline: string | null
          hourly_rate: number | null
          id: string
          portfolio_url: string | null
          skills: string[] | null
          updated_at: string
          years_experience: number | null
        }
        Insert: {
          created_at?: string
          headline?: string | null
          hourly_rate?: number | null
          id: string
          portfolio_url?: string | null
          skills?: string[] | null
          updated_at?: string
          years_experience?: number | null
        }
        Update: {
          created_at?: string
          headline?: string | null
          hourly_rate?: number | null
          id?: string
          portfolio_url?: string | null
          skills?: string[] | null
          updated_at?: string
          years_experience?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_poster_profiles: {
        Row: {
          company_name: string | null
          company_size: string | null
          company_website: string | null
          created_at: string
          id: string
          industry: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          company_size?: string | null
          company_website?: string | null
          created_at?: string
          id: string
          industry?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          company_size?: string | null
          company_website?: string | null
          created_at?: string
          id?: string
          industry?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_poster_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          bidding_end_time: string
          budget: number
          category: string
          created_at: string
          currency: string
          deadline: string
          description: string | null
          id: string
          payment_status: string | null
          status: string
          title: string
          updated_at: string
          user_id: string
          uses_milestones: boolean
        }
        Insert: {
          bidding_end_time: string
          budget: number
          category: string
          created_at?: string
          currency?: string
          deadline: string
          description?: string | null
          id?: string
          payment_status?: string | null
          status?: string
          title: string
          updated_at?: string
          user_id: string
          uses_milestones?: boolean
        }
        Update: {
          bidding_end_time?: string
          budget?: number
          category?: string
          created_at?: string
          currency?: string
          deadline?: string
          description?: string | null
          id?: string
          payment_status?: string | null
          status?: string
          title?: string
          updated_at?: string
          user_id?: string
          uses_milestones?: boolean
        }
        Relationships: []
      }
      milestones: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          job_id: string
          order_index: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          job_id: string
          order_index?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          job_id?: string
          order_index?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "milestones_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          card_type: string | null
          created_at: string
          id: string
          is_default: boolean | null
          last_four: string | null
          payment_method_id: string
          provider: string
          updated_at: string
          user_id: string
        }
        Insert: {
          card_type?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          payment_method_id: string
          provider: string
          updated_at?: string
          user_id: string
        }
        Update: {
          card_type?: string | null
          created_at?: string
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          payment_method_id?: string
          provider?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          first_name: string | null
          id: string
          is_beta_tester: boolean
          last_name: string | null
          updated_at: string
          user_type: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id: string
          is_beta_tester?: boolean
          last_name?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          first_name?: string | null
          id?: string
          is_beta_tester?: boolean
          last_name?: string | null
          updated_at?: string
          user_type?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          job_id: string
          rated_user_id: string
          rater_id: string
          rating: number
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          job_id: string
          rated_user_id: string
          rater_id: string
          rating: number
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          job_id?: string
          rated_user_id?: string
          rater_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          bid_id: string
          chip_transaction_id: string | null
          created_at: string
          currency: string
          escrow_released_at: string | null
          fee_amount: number
          id: string
          job_id: string
          milestone_id: string | null
          payee_id: string
          payer_id: string
          payment_method_id: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          bid_id: string
          chip_transaction_id?: string | null
          created_at?: string
          currency: string
          escrow_released_at?: string | null
          fee_amount: number
          id?: string
          job_id: string
          milestone_id?: string | null
          payee_id: string
          payer_id: string
          payment_method_id?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          bid_id?: string
          chip_transaction_id?: string | null
          created_at?: string
          currency?: string
          escrow_released_at?: string | null
          fee_amount?: number
          id?: string
          job_id?: string
          milestone_id?: string | null
          payee_id?: string
          payer_id?: string
          payment_method_id?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
        ]
      }
      work_submissions: {
        Row: {
          bid_id: string
          created_at: string
          id: string
          job_id: string
          note: string
          review_note: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bid_id: string
          created_at?: string
          id?: string
          job_id: string
          note: string
          review_note?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bid_id?: string
          created_at?: string
          id?: string
          job_id?: string
          note?: string
          review_note?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_submissions_bid_id_fkey"
            columns: ["bid_id"]
            isOneToOne: false
            referencedRelation: "bids"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_submissions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_accepted_bid: {
        Args: { job_id: string; user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
