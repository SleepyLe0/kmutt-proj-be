import { Admission, AdmissionDocument } from '@/interfaces/admission.interface';
import { Document, model, Schema } from 'mongoose';

const termSchema = new Schema(
  {
    semester: { type: Number, required: true },
    academic_year_th: { type: Number, required: true },
    label: { type: String },
    sort_key: { type: Number },
  },
  { _id: false }
);

const roundItemSchema = new Schema(
  {
    no: { type: Number },
    interview_date: { type: String, required: true },
    open: { type: Boolean, default: false },
  },
  { _id: false }
);

const monthlyItemSchema = new Schema(
  {
    month: { type: Number },
    label: { type: String },
    interview_date: { type: String, required: true },
    open: { type: Boolean, default: false },
  },
  { _id: false }
);

const applicationWindowSchema = new Schema(
  {
    open_at: { type: String, required: true },
    close_at: { type: String, required: true },
    notice: { type: String },
    calendar_url: { type: String },
  },
  { _id: false }
);

const admissionSchema = new Schema(
  {
    term: { type: termSchema, required: true },
    active: { type: Boolean, default: false },
    intake_mode: {
      type: String,
      enum: ['none', 'rounds', 'monthly'],
      default: 'none',
    },
    application_window: { type: applicationWindowSchema },
    rounds: { type: [roundItemSchema], default: [] },
    monthly: { type: [monthlyItemSchema], default: [] },
    meta: {
      program_id: { type: Schema.Types.Mixed, default: null },
      created_at: { type: String },
      updated_at: { type: String },
      created_by: { type: String },
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

const AdmissionModel = model<Admission & Document>(
  'Admission',
  admissionSchema
);

export default AdmissionModel;
