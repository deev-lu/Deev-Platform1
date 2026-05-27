export type Database = {
  public: {
    Tables: {
      client_leads: {
        Row: {
          id: string;
          name: string;
          email: string;
          project_type: string | null;
          scale: string | null;
          capabilities: string[] | null;
          estimated_min: number | null;
          estimated_max: number | null;
          timeline_weeks: string | null;
          status: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          project_type?: string | null;
          scale?: string | null;
          capabilities?: string[] | null;
          estimated_min?: number | null;
          estimated_max?: number | null;
          timeline_weeks?: string | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          project_type?: string | null;
          scale?: string | null;
          capabilities?: string[] | null;
          estimated_min?: number | null;
          estimated_max?: number | null;
          timeline_weeks?: string | null;
          status?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
