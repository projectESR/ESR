import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BloodReport = {
  id: string;
  user_id: string;
  blood_type: string;
  image_url: string;
  confidence_score: number;
  analysis_data: {
    section_0?: { agglutination: boolean; confidence: number };
    section_1?: { agglutination: boolean; confidence: number };
    section_2?: { agglutination: boolean; confidence: number };
  };
  created_at: string;
  updated_at: string;
};
