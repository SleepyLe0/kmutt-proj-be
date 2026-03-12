import mongoose from 'mongoose';

export interface Program {
  _id: string | mongoose.ObjectId;
  faculty_id: string | mongoose.ObjectId;
  department_id?: string | mongoose.ObjectId;
  title: string;
  order: number;
  degree_level: 'master' | 'doctoral';
  degree_abbr: string;
  degree_req?: 'bachelor' | 'master';
  active: boolean;
  created_at: string;
  updated_at: string;
}
