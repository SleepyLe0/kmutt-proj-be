import { Document } from 'mongoose';

export type IntakeMode = 'none' | 'rounds' | 'monthly';

export interface Term {
  semester: number;
  academic_year_th: number;
  label?: string;
  sort_key?: number; // e.g. 2568.2 for sorting
}

export interface RoundItem {
  no?: number; // optional in newer example
  interview_date: string; // ISO date string (YYYY-MM-DD)
  open?: boolean;
}

export interface MonthlyItem {
  month?: number;
  label?: string;
  interview_date: string; // ISO date string
  open?: boolean;
}

export interface ApplicationWindow {
  open_at: string; // ISO date string
  close_at: string; // ISO date string
  notice?: string;
  calendar_url?: string;
}

export interface Admission {
  term: Term;
  active?: boolean;
  intake_mode?: IntakeMode;
  application_window?: ApplicationWindow;
  rounds?: RoundItem[];
  monthly?: MonthlyItem[];
  meta?: {
    program_id?: string | null;
    created_at?: string; // ISO date string
    updated_at?: string; // ISO date string
    created_by?: string;
  };
  created_at?: Date;
  updated_at?: Date;
}

export type AdmissionDocument = Admission & Document;
