import { Template } from '@/interfaces/template.interface';
import { Document, model, Schema } from 'mongoose';

const templateSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  contents: [
    {
      no: {
        type: Number,
        required: true,
      },
      sequence: {
        type: Number,
        required: true,
      },
      label_on_web_th: {
        label: {
          type: String,
          required: false,
        },
        description: {
          type: String,
          required: false,
        },
      },
      label_on_web_en: {
        type: String,
        required: false,
      },
      application_form_status: {
        type: String,
        required: false,
      },
      date: {
        start_date: {
          type: String,
          required: true,
        },
        end_date: {
          type: String,
          required: true,
        },
        description: {
          type: String,
          required: false,
        },
        show_range: { type: Boolean, required: false },
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
    },
  ],
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
