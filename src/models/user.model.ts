import { User } from '@/interfaces/user.interface';
import { Document, model, Schema } from 'mongoose';

const userSchema: Schema = new Schema({
  google_id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'user'],
  },
  created_at: {
    type: String,
    default: Date.now(),
  },
  updated_at: {
    type: String,
    default: Date.now(),
  },
});

const UserModel = model<User & Document>('User', userSchema);
export default UserModel;
