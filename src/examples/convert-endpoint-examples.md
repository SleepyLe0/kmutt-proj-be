# Excel to PDF Conversion Endpoint - Usage Examples

## Endpoint
`POST /convert/excel-to-pdf`

## Authentication
Required: Bearer token in Authorization header

---

## Example 1: Using cURL

```bash
curl -X POST http://localhost:3000/convert/excel-to-pdf \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/spreadsheet.xlsx"
```

---

## Example 2: Using Postman

1. **Method**: POST
2. **URL**: `http://localhost:3000/convert/excel-to-pdf`
3. **Headers**:
   - `Authorization: Bearer YOUR_JWT_TOKEN`
4. **Body**:
   - Select `form-data`
   - Key: `file` (change type to "File")
   - Value: Select your Excel file (.xlsx or .xls)

---

## Example 3: Using JavaScript (Fetch API)

```javascript
const formData = new FormData();
const fileInput = document.querySelector('input[type="file"]');
formData.append('file', fileInput.files[0]);

fetch('http://localhost:3000/convert/excel-to-pdf', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
  },
  body: formData
})
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    // data.data.pdfBuffer contains base64 PDF
    // data.data.filename contains PDF filename
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

---

## Example 4: Using Axios (Node.js/React)

```javascript
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const formData = new FormData();
formData.append('file', fs.createReadStream('/path/to/spreadsheet.xlsx'));

axios.post('http://localhost:3000/convert/excel-to-pdf', formData, {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    ...formData.getHeaders()
  }
})
  .then(response => {
    console.log('Success:', response.data);

    // Decode base64 and save PDF
    const pdfBuffer = Buffer.from(response.data.data.pdfBuffer, 'base64');
    fs.writeFileSync('output.pdf', pdfBuffer);
  })
  .catch(error => {
    console.error('Error:', error.response?.data || error.message);
  });
```

---

## Example 5: Using Python (requests)

```python
import requests
import base64

url = 'http://localhost:3000/convert/excel-to-pdf'
headers = {
    'Authorization': 'Bearer YOUR_JWT_TOKEN'
}

files = {
    'file': open('/path/to/spreadsheet.xlsx', 'rb')
}

response = requests.post(url, headers=headers, files=files)
data = response.json()

if data['status']:
    # Decode base64 and save PDF
    pdf_buffer = base64.b64decode(data['data']['pdfBuffer'])
    with open('output.pdf', 'wb') as f:
        f.write(pdf_buffer)
    print(f"PDF saved: {data['data']['filename']}")
else:
    print(f"Error: {data['message']}")
```

---

## Example 6: Using React with File Upload

```jsx
import React, { useState } from 'react';
import axios from 'axios';

function ExcelToPdfConverter() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleConvert = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/convert/excel-to-pdf',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setResult(response.data.data);

      // Auto-download the PDF
      const pdfBlob = base64ToBlob(response.data.data.pdfBuffer, 'application/pdf');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = response.data.data.filename;
      link.click();
      URL.revokeObjectURL(url);

      alert('Conversion successful!');
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  return (
    <div>
      <h2>Excel to PDF Converter</h2>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
      />
      <button onClick={handleConvert} disabled={loading}>
        {loading ? 'Converting...' : 'Convert to PDF'}
      </button>
      {result && (
        <div>
          <p>Filename: {result.filename}</p>
          <p>Size: {(result.size / 1024).toFixed(2)} KB</p>
        </div>
      )}
    </div>
  );
}

export default ExcelToPdfConverter;
```

---

## Request Format

**Content-Type**: `multipart/form-data`

**Form Field**:
- **Key**: `file`
- **Type**: File
- **Accepted formats**: `.xlsx`, `.xls`
- **Max size**: 10MB

---

## Success Response (200)

```json
{
  "status": true,
  "message": "Excel file converted to PDF successfully",
  "data": {
    "filename": "converted-document.pdf",
    "pdfBuffer": "JVBERi0xLjQKJeLjz9MKNCAwIG9iago8PC9MZW5ndGggNSAwIFI+...",
    "size": 245678,
    "originalFilename": "input-spreadsheet.xlsx"
  }
}
```

**Fields Explanation**:
- `filename`: Generated PDF filename
- `pdfBuffer`: Base64-encoded PDF file content
- `size`: PDF file size in bytes
- `originalFilename`: Original Excel filename

---

## Error Responses

### 400 - No File Uploaded
```json
{
  "status": false,
  "message": "No file uploaded. Please provide an Excel file"
}
```

### 400 - Invalid File Type
```json
{
  "status": false,
  "message": "Invalid file type. Only .xlsx and .xls files are allowed"
}
```

### 401 - Unauthorized
```json
{
  "status": false,
  "message": "Authentication token missing"
}
```

### 413 - File Too Large
```json
{
  "status": false,
  "message": "File too large. Maximum size is 10MB"
}
```

### 500 - Conversion Failed
```json
{
  "status": false,
  "message": "Failed to convert Excel file to PDF. Please ensure the file is a valid Excel document"
}
```

---

## Notes

1. **Authentication Required**: All requests must include a valid JWT token in the Authorization header
2. **File Format**: Only `.xlsx` and `.xls` files are accepted
3. **File Size**: Maximum file size is 10MB
4. **PDF Buffer**: The response contains a base64-encoded PDF buffer that needs to be decoded
5. **LibreOffice Required**: The server must have LibreOffice installed for conversion to work
