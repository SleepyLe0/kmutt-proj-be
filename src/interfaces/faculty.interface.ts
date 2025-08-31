import mongoose from 'mongoose';

export interface Faculty {
  _id: string | mongoose.ObjectId;
  title: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}
