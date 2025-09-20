import { Program } from '@/interfaces/program.interface';
import { Document, model, Schema } from 'mongoose';

const programSchema: Schema = new Schema({
  faculty_id: {
    type: Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },
  department_id: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
  },
  title: {
    type: String,
    required: true,
  },
  degree_level: {
    type: String,
    required: true,
    enum: ['master', 'doctoral'],
  },
  degree_abbr: {
    type: String,
    required: true,
  },
  degree_req: {
    type: String,
    required: false,
    enum: ['bachelor', 'master'],
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

const ProgramModel = model<Program & Document>('Program', programSchema);
export default ProgramModel;
