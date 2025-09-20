import mongoose from 'mongoose';

export interface User {
  _id: string | mongoose.ObjectId;
  google_id: string;
  email: string;
  name: string;
  picture?: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}
