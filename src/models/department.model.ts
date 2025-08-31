import { Department } from '@/interfaces/department.interface';
import { Document, model, Schema } from 'mongoose';

const departmentSchema: Schema = new Schema({
  faculty_id: {
    type: Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },
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

const DepartmentModel = model<Department & Document>(
  'Department',
  departmentSchema
);
export default DepartmentModel;
