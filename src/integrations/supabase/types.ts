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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ai_chat_history: {
        Row: {
          animal_id: string | null
          created_at: string | null
          diagnosis_confidence: number | null
          id: string
          message: string
          response: string | null
          symptoms: string | null
          user_id: string
        }
        Insert: {
          animal_id?: string | null
          created_at?: string | null
          diagnosis_confidence?: number | null
          id?: string
          message: string
          response?: string | null
          symptoms?: string | null
          user_id: string
        }
        Update: {
          animal_id?: string | null
          created_at?: string | null
          diagnosis_confidence?: number | null
          id?: string
          message?: string
          response?: string | null
          symptoms?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_history_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      animals: {
        Row: {
          breed: string | null
          created_at: string | null
          date_of_birth: string | null
          gender: Database["public"]["Enums"]["animal_gender"] | null
          health_status: Database["public"]["Enums"]["health_status"] | null
          id: string
          identification_number: string | null
          latitude: number | null
          location: string | null
          longitude: number | null
          name: string | null
          owner_id: string
          photo_url: string | null
          species: Database["public"]["Enums"]["animal_species"]
          updated_at: string | null
        }
        Insert: {
          breed?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          gender?: Database["public"]["Enums"]["animal_gender"] | null
          health_status?: Database["public"]["Enums"]["health_status"] | null
          id?: string
          identification_number?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string | null
          owner_id: string
          photo_url?: string | null
          species: Database["public"]["Enums"]["animal_species"]
          updated_at?: string | null
        }
        Update: {
          breed?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          gender?: Database["public"]["Enums"]["animal_gender"] | null
          health_status?: Database["public"]["Enums"]["health_status"] | null
          id?: string
          identification_number?: string | null
          latitude?: number | null
          location?: string | null
          longitude?: number | null
          name?: string | null
          owner_id?: string
          photo_url?: string | null
          species?: Database["public"]["Enums"]["animal_species"]
          updated_at?: string | null
        }
        Relationships: []
      }
      breeding_records: {
        Row: {
          actual_delivery_date: string | null
          animal_id: string
          breeding_date: string
          breeding_method: string | null
          created_at: string | null
          expected_delivery_date: string | null
          id: string
          notes: string | null
          offspring_count: number | null
          partner_details: string | null
        }
        Insert: {
          actual_delivery_date?: string | null
          animal_id: string
          breeding_date: string
          breeding_method?: string | null
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          offspring_count?: number | null
          partner_details?: string | null
        }
        Update: {
          actual_delivery_date?: string | null
          animal_id?: string
          breeding_date?: string
          breeding_method?: string | null
          created_at?: string | null
          expected_delivery_date?: string | null
          id?: string
          notes?: string | null
          offspring_count?: number | null
          partner_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "breeding_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      emergency_contacts: {
        Row: {
          contact_name: string
          contact_number: string
          created_at: string | null
          id: string
          is_default: boolean | null
          relationship: string | null
          user_id: string
        }
        Insert: {
          contact_name: string
          contact_number: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          relationship?: string | null
          user_id: string
        }
        Update: {
          contact_name?: string
          contact_number?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          relationship?: string | null
          user_id?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string | null
          comments: string | null
          created_at: string | null
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          comments?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      feeding_schedules: {
        Row: {
          animal_id: string
          created_at: string | null
          feed_type: string
          frequency: string | null
          id: string
          quantity: string | null
          season: string | null
          special_instructions: string | null
          updated_at: string | null
        }
        Insert: {
          animal_id: string
          created_at?: string | null
          feed_type: string
          frequency?: string | null
          id?: string
          quantity?: string | null
          season?: string | null
          special_instructions?: string | null
          updated_at?: string | null
        }
        Update: {
          animal_id?: string
          created_at?: string | null
          feed_type?: string
          frequency?: string | null
          id?: string
          quantity?: string | null
          season?: string | null
          special_instructions?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feeding_schedules_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      government_schemes: {
        Row: {
          application_process: string | null
          benefits: string | null
          contact_details: string | null
          created_at: string | null
          description: string | null
          district: string | null
          documents_required: string[] | null
          eligibility_criteria: string | null
          id: string
          is_active: boolean | null
          official_website: string | null
          scheme_name: string
          state: string | null
          updated_at: string | null
        }
        Insert: {
          application_process?: string | null
          benefits?: string | null
          contact_details?: string | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          documents_required?: string[] | null
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          official_website?: string | null
          scheme_name: string
          state?: string | null
          updated_at?: string | null
        }
        Update: {
          application_process?: string | null
          benefits?: string | null
          contact_details?: string | null
          created_at?: string | null
          description?: string | null
          district?: string | null
          documents_required?: string[] | null
          eligibility_criteria?: string | null
          id?: string
          is_active?: boolean | null
          official_website?: string | null
          scheme_name?: string
          state?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      health_records: {
        Row: {
          animal_id: string
          attachments: Json | null
          created_at: string | null
          diagnosis: string | null
          id: string
          next_checkup_date: string | null
          prescription: string | null
          record_date: string
          recorded_by: string | null
          symptoms: string | null
          treatment: string | null
          veterinarian_notes: string | null
        }
        Insert: {
          animal_id: string
          attachments?: Json | null
          created_at?: string | null
          diagnosis?: string | null
          id?: string
          next_checkup_date?: string | null
          prescription?: string | null
          record_date: string
          recorded_by?: string | null
          symptoms?: string | null
          treatment?: string | null
          veterinarian_notes?: string | null
        }
        Update: {
          animal_id?: string
          attachments?: Json | null
          created_at?: string | null
          diagnosis?: string | null
          id?: string
          next_checkup_date?: string | null
          prescription?: string | null
          record_date?: string
          recorded_by?: string | null
          symptoms?: string | null
          treatment?: string | null
          veterinarian_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "health_records_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_listings: {
        Row: {
          animal_id: string | null
          contact_number: string | null
          created_at: string | null
          description: string | null
          id: string
          location: string
          photos: Json | null
          price: number | null
          seller_id: string
          status: Database["public"]["Enums"]["listing_status"] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          animal_id?: string | null
          contact_number?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location: string
          photos?: Json | null
          price?: number | null
          seller_id: string
          status?: Database["public"]["Enums"]["listing_status"] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          animal_id?: string | null
          contact_number?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string
          photos?: Json | null
          price?: number | null
          seller_id?: string
          status?: Database["public"]["Enums"]["listing_status"] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_listings_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          priority: Database["public"]["Enums"]["priority_level"] | null
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: Database["public"]["Enums"]["priority_level"] | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: Database["public"]["Enums"]["priority_level"] | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          district: string | null
          full_name: string
          id: string
          onboarding_completed: boolean | null
          phone_number: string | null
          pin_code: string | null
          preferred_language: string | null
          state: string | null
          updated_at: string | null
          village: string | null
        }
        Insert: {
          created_at?: string | null
          district?: string | null
          full_name: string
          id: string
          onboarding_completed?: boolean | null
          phone_number?: string | null
          pin_code?: string | null
          preferred_language?: string | null
          state?: string | null
          updated_at?: string | null
          village?: string | null
        }
        Update: {
          created_at?: string | null
          district?: string | null
          full_name?: string
          id?: string
          onboarding_completed?: boolean | null
          phone_number?: string | null
          pin_code?: string | null
          preferred_language?: string | null
          state?: string | null
          updated_at?: string | null
          village?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          duration_months: number
          features: string[]
          id: string
          is_active: boolean | null
          name: string
          price: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_months: number
          features: string[]
          id?: string
          is_active?: boolean | null
          name: string
          price: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_months?: number
          features?: string[]
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          end_date: string
          id: string
          payment_details: Json | null
          plan_id: string
          start_date: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          end_date: string
          id?: string
          payment_details?: Json | null
          plan_id: string
          start_date?: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          end_date?: string
          id?: string
          payment_details?: Json | null
          plan_id?: string
          start_date?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccinations: {
        Row: {
          administered_by: string | null
          administered_date: string
          animal_id: string
          batch_number: string | null
          created_at: string | null
          id: string
          next_due_date: string | null
          notes: string | null
          vaccine_name: string
          vaccine_type: string | null
        }
        Insert: {
          administered_by?: string | null
          administered_date: string
          animal_id: string
          batch_number?: string | null
          created_at?: string | null
          id?: string
          next_due_date?: string | null
          notes?: string | null
          vaccine_name: string
          vaccine_type?: string | null
        }
        Update: {
          administered_by?: string | null
          administered_date?: string
          animal_id?: string
          batch_number?: string | null
          created_at?: string | null
          id?: string
          next_due_date?: string | null
          notes?: string | null
          vaccine_name?: string
          vaccine_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vaccinations_animal_id_fkey"
            columns: ["animal_id"]
            isOneToOne: false
            referencedRelation: "animals"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_alerts: {
        Row: {
          advisory: string | null
          alert_type: string
          created_at: string | null
          description: string
          district: string | null
          id: string
          severity: string | null
          state: string
          valid_from: string
          valid_until: string
        }
        Insert: {
          advisory?: string | null
          alert_type: string
          created_at?: string | null
          description: string
          district?: string | null
          id?: string
          severity?: string | null
          state: string
          valid_from: string
          valid_until: string
        }
        Update: {
          advisory?: string | null
          alert_type?: string
          created_at?: string | null
          description?: string
          district?: string | null
          id?: string
          severity?: string | null
          state?: string
          valid_from?: string
          valid_until?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      animal_gender: "male" | "female"
      animal_species:
        | "cattle"
        | "goat"
        | "sheep"
        | "poultry"
        | "buffalo"
        | "pig"
        | "other"
      app_role:
        | "farmer"
        | "veterinary_officer"
        | "program_coordinator"
        | "admin"
      health_status:
        | "healthy"
        | "sick"
        | "under_treatment"
        | "quarantine"
        | "deceased"
      listing_status: "active" | "sold" | "inactive"
      priority_level: "low" | "medium" | "high" | "critical"
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
      animal_gender: ["male", "female"],
      animal_species: [
        "cattle",
        "goat",
        "sheep",
        "poultry",
        "buffalo",
        "pig",
        "other",
      ],
      app_role: [
        "farmer",
        "veterinary_officer",
        "program_coordinator",
        "admin",
      ],
      health_status: [
        "healthy",
        "sick",
        "under_treatment",
        "quarantine",
        "deceased",
      ],
      listing_status: ["active", "sold", "inactive"],
      priority_level: ["low", "medium", "high", "critical"],
    },
  },
} as const
