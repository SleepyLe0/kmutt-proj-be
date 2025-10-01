export const createFormResponse = {
  "admission_id": "64f8b2c1e4b0a1234567890a",
  "faculty_id": "64f8b2c1e4b0a1234567890b",
  "department_id": "64f8b2c1e4b0a1234567890c",
  "intake_programs": [
    {
      "program_id": "64f8b2c1e4b0a1234567890d",
      "intake_degree": {
        "master": {
          "amount": 30,
          "bachelor_req": true
        },
        "doctoral": {
          "amount": 15,
          "bachelor_req": true,
          "master_req": true
        }
      },
      "intake_calendar": {
        "rounds": [
          {
            "no": 1,
            "title": "รอบที่ 1",
            "interview_date": "2025-03-21T00:00:00.000Z"
          },
          {
            "no": 2,
            "title": "รอบที่ 2",
            "interview_date": "2025-07-04T00:00:00.000Z"
          }
        ],
        "monthly": [
          {
            "month": "มกราคม",
            "title": "รอบที่ 1",
            "interview_date": "2025-01-20T00:00:00.000Z"
          },
          {
            "month": "กุมภาพันธ์",
            "title": "รอบที่ 2",
            "interview_date": "2025-02-21T00:00:00.000Z"
          },
          {
            "month": "มีนาคม",
            "title": "รอบที่ 3",
            "interview_date": "2025-03-21T00:00:00.000Z"
          }
        ]
      }
    }
  ],
  "submitter": {
    "name": "ดร.สมชาย ใจดี",
    "phone": ["081-234-5678"],
    "email": "somchai.jaidee@kmutt.ac.th"
  },
  "status": "received"
}

export const updateFormResponse = {
  "faculty_id": "64f8b2c1e4b0a1234567890b",
  "department_id": "64f8b2c1e4b0a1234567890c",
  "intake_programs": [
    {
      "program_id": "64f8b2c1e4b0a1234567890d",
      "intake_degree": {
        "master": {
          "amount": 35,
          "bachelor_req": true
        },
        "doctoral": {
          "amount": 20,
          "bachelor_req": true,
          "master_req": true
        }
      },
      "intake_calendar": {
        "rounds": [],
        "monthly": [],
        "message": "การรับสมัครระดับบัณฑิตศึกษา ภาคการศึกษาที่ 2/2568 (เริ่มการศึกษา มกราคม 2569) - อัปเดต"
      }
    }
  ],
  "submitter": {
    "name": "ดร.สมชาย ใจดี",
    "phone": ["081-234-5679"],
    "email": "somchai.jaidee@kmutt.ac.th"
  },
  "status": "verified"
}
