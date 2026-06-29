import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase URL or Anon Key is missing in environment variables. ' +
    'Please check your .env or .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Database Schema interface for Type Safety in React components
export interface Database {
  public: {
    Tables: {
      applications: {
        Row: Application;
        Insert: Omit<Application, 'id' | 'created_at' | 'status'> & {
          id?: string;
          created_at?: string;
          status?: 'pending' | 'approved' | 'rejected' | 'archived';
        };
        Update: Partial<Application>;
      };
    };
  };
}

export interface Application {
  id?: string;
  created_at?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'archived';
  
  // Step 1
  name: string;
  nickname: string;
  phone: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  address: string;
  mbti: string;
  
  // Step 2
  ideal_type: string;
  bio: string;
  photo_urls: string[];
  sns_link: string;
  
  // Step 3
  job_type: string;
  company_name: string;
  verification_file_url: string;
  
  // Step 4
  preferred_schedules: string[];
  single_pledge: boolean; // Must be true
  privacy_pledge: boolean; // Must be true

  // Archiving / Match Backup
  is_matched?: boolean;
  matched_partner?: string;

  // Step 3 Pre-Interview (new)
  deal_breaker?: string;
  crisis_response?: string;
  group_position?: string;

  // Onboarding
  is_agreed?: boolean;

  // Date flexibility consent
  is_date_flexible?: boolean;

  // Signal meetup code
  signal_code?: string;
}
