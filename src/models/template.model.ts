import { Template } from '@/interfaces/template.interface';
import { Document, model, Schema } from 'mongoose';

const templateSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  contents: [{
    no: {
      type: Number,
      required: true,
    },
    sequence: {
      type: Number,
      required: true,
    },
    label_on_web_th: {
      title: {
        type: String,
        required: true,
      },
      subtitle: {
        type: String,
        required: false,
      },
    },
    label_on_web_en: {
      type: String,
      required: true,
    },
    application_form_status: {
      type: String,
      required: true,
    },
    start_date: {
      type: String,
      required: true,
    },
    end_date: {
      type: String,
      required: true,
    },
    current_stage: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    export: {
      type: Boolean,
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

const TemplateModel = model<Template & Document>('Template', templateSchema);
export default TemplateModel;