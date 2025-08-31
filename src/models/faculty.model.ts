import { Faculty } from '@/interfaces/faculty.interface';
import { Document, model, Schema } from 'mongoose';

const facultySchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

const FacultyModel = model<Faculty & Document>('Faculty', facultySchema);
export default FacultyModel;
