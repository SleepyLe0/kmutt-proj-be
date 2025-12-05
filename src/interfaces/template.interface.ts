export interface Template {
  _id: string;
  title: string;
  contents: {
    no: number;
    sequence: number;
    label_on_web_th: {
      title: string;
      subtitle?: string;
    };
    label_on_web_en: string;
    application_form_status: string;
    start_date: string;
    end_date: string;
    current_stage: 'Yes' | 'No';
    export: boolean;
  }[];
  created_at: string;
  updated_at: string;
}