import { Admission } from '@/interfaces/admission.interface';
import { Document, model, Schema } from 'mongoose';

const admissionSchema: Schema = new Schema({
  term: {
    semester: {
      type: Number,
      required: true,
    },
    academic_year_th: {
      type: Number,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    sort_key: {
      type: Number,
      required: true,
    },
  },
  active: {
    type: Boolean,
    default: true,
  },
  application_window: {
    open_at: {
      type: Date,
      required: true,
    },
    close_at: {
      type: Date,
      required: true,
    },
    notice: {
      type: String,
      required: true,
    },
    calendar_url: {
      type: String,
      required: false,
    },
  },
  rounds: [{
    no: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    interview_date: {
      type: Date,
      required: true,
    },
  }],
  monthly: [{
    month: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    interview_date: {
      type: Date,
      required: true,
    },
  }],
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

const AdmissionModel = model<Admission & Document>('Admission', admissionSchema);
export default AdmissionModel;