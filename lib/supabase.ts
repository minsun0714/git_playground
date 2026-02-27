import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface QuizSubmission {
  id?: string;
  attempt_id: string;
  user_name: string;
  step: number;
  question: string;
  answer: string;
  score: number;
  total_score?: number;
  created_at?: string;
}

export interface UserRanking {
  attempt_id: string;
  user_name: string;
  total_score: number;
  completed_at: string;
}
