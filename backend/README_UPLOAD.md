# File Upload Implementation

## Using Multer Only

This project uses **Multer** for handling file uploads. No external services required.

## Configuration

### Multer Setup (backend/middleware/upload.js)

```javascript
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage configuration
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only images allowed'));
};

// Multer instance
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 10 
  },
  fileFilter: fileFilter
});
```

## API Endpoint

### Upload Pet Photos

```
POST /api/pets/:id/photos
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data

Form Data:
- photos: [files] (multiple files supported)
```

### Response

```json
{
  "success": true,
  "data": {
    "_id": "pet_id",
    "name": "Buddy",
    "photos": [
      "/uploads/buddy-1701234567890-987654321.jpg",
      "/uploads/buddy-1701234567891-123456789.jpg"
    ],
    ...
  }
}
```

## Frontend Integration

### Using the ImageUpload Component

```javascript
import ImageUpload from '../components/ImageUpload';

<ImageUpload 
  petId={petId} 
  onUploadSuccess={handleSuccess}
/>
```

### Manual Upload

```javascript
const handleUpload = async (files) => {
  const formData = new FormData();
  
  files.forEach(file => {
    formData.append('photos', file);
  });

  const response = await api.post(
    `/pets/${petId}/photos`, 
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
};
```

## File Storage

- **Location**: `backend/uploads/`
- **Access URL**: `http://localhost:5000/uploads/filename.jpg`
- **Filename Format**: `originalname-timestamp-random.ext`

## Features

✅ Local file storage (no cloud service needed)
✅ Automatic directory creation
✅ Unique filename generation
✅ Image type validation
✅ File size limit (5MB)
✅ Multiple file upload
✅ Static file serving

## Testing

### Using cURL

```bash
curl -X POST http://localhost:5000/api/pets/{PET_ID}/photos \
  -H "Authorization: Bearer {TOKEN}" \
  -F "photos=@/path/to/image1.jpg" \
  -F "photos=@/path/to/image2.jpg"
```

### Using Postman

1. Set method to POST
2. URL: `http://localhost:5000/api/pets/:id/photos`
3. Headers: `Authorization: Bearer {token}`
4. Body → form-data
5. Key: `photos` (Type: File)
6. Select multiple files

## Security

- Admin authentication required
- File type validation
- File size limit
- Unique filenames (prevent overwrite)
- Sanitized filenames

## Production Notes

1. Ensure `uploads/` directory has write permissions
2. Consider adding image optimization (sharp)
3. Backup uploads directory regularly
4. Use nginx/Apache for serving static files
5. Consider adding cleanup for deleted pets

## No External Dependencies

This implementation uses **only Multer** for file handling. No Cloudinary, AWS S3, or any other external service is required. Everything runs locally.

