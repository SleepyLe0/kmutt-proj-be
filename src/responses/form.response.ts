export const createFormResponse = {
  "admission_id": "64f8b2c1e4b0a1234567890a",
  "faculty_id": "64f8b2c1e4b0a1234567890b",
  "department_id": "64f8b2c1e4b0a1234567890c",
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
        "active": true,
        "no": 1,
        "interview_date": "2025-03-21T00:00:00.000Z"
      },
      {
        "active": true,
        "no": 2,
        "interview_date": "2025-07-04T00:00:00.000Z"
      }
    ],
    "monthly": [
      {
        "active": true,
        "month": "มกราคม",
        "interview_date": "2025-01-20T00:00:00.000Z"
      },
      {
        "active": true,
        "month": "กุมภาพันธ์",
        "interview_date": "2025-02-21T00:00:00.000Z"
      },
      {
        "active": false,
        "month": "มีนาคม",
        "interview_date": "2025-03-21T00:00:00.000Z"
      }
    ]
  },
  "submitter": {
    "name": "ดร.สมชาย ใจดี",
    "phone": "081-234-5678",
    "email": "somchai.jaidee@kmutt.ac.th"
  },
  "status": "received"
}

export const updateFormResponse = {
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
    "rounds": [
      {
        "active": true,
        "no": 1,
        "interview_date": "2025-04-15T00:00:00.000Z"
      }
    ],
    "monthly": [
      {
        "active": true,
        "month": "เมษายน",
        "interview_date": "2025-04-15T00:00:00.000Z"
      }
    ]
  },
  "submitter": {
    "name": "ดร.สมชาย ใจดี",
    "phone": "081-234-5679",
    "email": "somchai.jaidee@kmutt.ac.th"
  },
  "status": "verified"
}
