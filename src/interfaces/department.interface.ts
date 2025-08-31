import mongoose from 'mongoose';

export interface Department {
  _id: string | mongoose.ObjectId;
  faculty_id: string | mongoose.ObjectId;
  title: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}
