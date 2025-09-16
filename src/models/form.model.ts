import { Form } from '@/interfaces/form.interface';
import { Document, model, Schema } from 'mongoose';

const intakeDegreeSchema = new Schema(
  {
    amount: { type: Number, required: true, min: 0 },
    bachelor_req: { type: Boolean, default: false },
    master_req: { type: Boolean, default: false },
  },
  { _id: false }
);

const intakeRoundsSchema = new Schema(
  {
    active: { type: Boolean, default: true },
    no: { type: Number, required: true, min: 1 },
    interview_date: { type: String, required: true },
  },
  { _id: false }
);

const intakeMonthlySchema = new Schema(
  {
    active: { type: Boolean, default: true },
    month: { type: String, required: true },
    interview_date: { type: String, required: true },
  },
  { _id: false }
);

const intakeCalendarSchema = new Schema(
  {
    rounds: { type: [intakeRoundsSchema], default: [] },
    monthly: { type: [intakeMonthlySchema], default: [] },
  },
  { _id: false }
);

const intakeProgramSchema = new Schema(
  {
    program_id: { type: Schema.Types.ObjectId, ref: 'Program', required: true },
    intake_degree: {
      master: { type: intakeDegreeSchema, required: true },
      doctoral: { type: intakeDegreeSchema, required: true },
    },
    intake_calendar: { type: intakeCalendarSchema, required: true },
  },
  { _id: false }
);

const formSchema: Schema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  admission_id: {
    type: Schema.Types.ObjectId,
    ref: 'Admission',
    required: true,
  },
  faculty_id: {
    type: Schema.Types.ObjectId,
    ref: 'Faculty',
    required: true,
  },
  department_id: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true,
  },
  intake_programs: { type: [intakeProgramSchema], required: true },
  submitter: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ['received', 'verified'],
    default: 'received',
  },
  created_at: { type: Date, default: Date.now() },
  updated_at: { type: Date, default: Date.now() },
});

const FormModel = model<Form & Document>('Form', formSchema);
export default FormModel;
