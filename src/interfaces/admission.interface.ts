import mongoose from "mongoose";

export interface Admission {
  _id: string | mongoose.ObjectId;
  term: {
    semester: number;
    academic_year_th: number;
    label: string;
    sort_key: number;
  };
  active: boolean;
  application_window: {
    open_at: string;
    close_at: string;
    notice: string;
    calendar_url?: string;
  };
  rounds: {
    no: number;
    interview_date: string;
  }[];
  monthly: {
    month: string;
    interview_date: string;
  }[];
  created_at: string;
  updated_at: string;
}
