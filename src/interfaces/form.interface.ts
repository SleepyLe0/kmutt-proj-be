import mongoose from 'mongoose';

export interface Form {
  _id: string | mongoose.ObjectId;
  user_id: string | mongoose.ObjectId;
  admission_id: string | mongoose.ObjectId;
  faculty_id: string | mongoose.ObjectId;
  department_id: string | mongoose.ObjectId;
  intake_programs: {
    program_id: string | mongoose.ObjectId;
    intake_degree: {
      master?: {
        amount: number;
        bachelor_req?: boolean;
      };
      doctoral?: {
        amount: number;
        bachelor_req?: boolean;
        master_req?: boolean;
      };
    };
    intake_calendar: {
      rounds: {
        no: number;
        interview_date: string;
      }[];
      monthly: {
        month: string;
        interview_date: string;
      }[];
      message?: string;
    };
  }[];
  submitter: {
    name: string;
    phone: string[];
    email: string;
  };
  status: 'received' | 'verified';
  created_at: string;
  updated_at: string;
}
