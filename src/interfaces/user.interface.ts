import mongoose from 'mongoose';

export interface User {
  _id: string | mongoose.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}
