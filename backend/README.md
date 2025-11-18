# Pet Adoption System - Backend

A comprehensive REST API for a pet adoption system built with Node.js, Express, and MongoDB following a **Layered Architecture Pattern** with Repository and Service layers.

## Features

- **JWT Authentication**: Secure user authentication with role-based authorization (User, Admin)
- **Pet Management**: Complete CRUD operations for pets with advanced filtering
- **Adoption Applications**: Handle adoption applications with approval workflow
- **Image Upload Support**: Cloudinary integration for pet photos
- **Search & Filter**: Advanced search and filtering capabilities
- **Pagination**: Efficient data pagination for large datasets
- **Validation**: Request validation using express-validator
- **Error Handling**: Centralized error handling middleware
- **API Documentation**: Interactive Swagger/OpenAPI documentation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **File Upload**: Multer
- **Image Hosting**: Cloudinary (optional)
- **API Documentation**: Swagger/OpenAPI with swagger-jsdoc and swagger-ui-express

## Architecture

This project follows a **Layered Architecture Pattern** for better separation of concerns, maintainability, and testability:

### Layer Structure
```
┌─────────────────────────────────────────┐
│         Controllers Layer               │  ← HTTP Request/Response handling
├─────────────────────────────────────────┤
│         Services Layer                  │  ← Business Logic
├─────────────────────────────────────────┤
│         Repositories Layer              │  ← Data Access Logic
├─────────────────────────────────────────┤
│         Models Layer (Mongoose)         │  ← Database Schema
└─────────────────────────────────────────┘
```

### Responsibilities

**Controllers** → Handle HTTP requests and responses
- Validate request input
- Call appropriate service methods
- Format and send responses
- Handle errors

**Services** → Contain business logic
- Implement use cases
- Orchestrate operations across multiple repositories
- Enforce business rules
- Handle transactions

**Repositories** → Data access abstraction
- Interact with database models
- Provide CRUD operations
- Build complex queries
- Return data to services

## Project Structure

```
backend/
├── config/
│   ├── database.js          # MongoDB connection
│   ├── cloudinary.js        # Cloudinary configuration
│   └── swagger.js           # Swagger/OpenAPI configuration
├── controllers/              # HTTP request handlers
│   ├── authController.js     # Authentication endpoints
│   ├── petController.js      # Pet management endpoints
│   └── applicationController.js # Application endpoints
├── services/                 # Business logic layer
│   ├── authService.js        # Authentication business logic
│   ├── petService.js         # Pet management business logic
│   └── applicationService.js # Application business logic
├── repositories/             # Data access layer
│   ├── userRepository.js     # User data operations
│   ├── petRepository.js      # Pet data operations
│   └── applicationRepository.js # Application data operations
├── models/                   # Database schemas
│   ├── User.js              # User model (Mongoose schema)
│   ├── Pet.js               # Pet model (Mongoose schema)
│   └── Application.js       # Application model (Mongoose schema)
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── validator.js         # Request validation rules
│   ├── upload.js            # File upload configuration
│   └── errorHandler.js      # Error handling middleware
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── petRoutes.js         # Pet routes
│   └── applicationRoutes.js # Application routes
├── utils/
│   ├── generateToken.js     # JWT token generation
│   ├── apiResponse.js       # Standardized API response utility
│   └── apiError.js          # Custom error classes
├── uploads/                 # Local file uploads (if not using Cloudinary)
├── .env                     # Environment variables
├── .env.example            # Environment variables template
├── server.js               # Application entry point
├── package.json            # Dependencies and scripts
└── README.md               # This file
```

## Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Edit .env file with your configurations**
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/pet-adoption
   JWT_SECRET=your_super_secret_jwt_key_change_in_production
   JWT_EXPIRE=7d
   NODE_ENV=development

   # Optional: Cloudinary for image uploads
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

5. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on your system
   sudo systemctl start mongod
   # OR
   mongod
   ```

6. **Run the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## API Endpoints

For complete API documentation with interactive testing, visit:
**http://localhost:5000/api-docs** (after starting the server)

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for detailed documentation guide.

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/profile` | Update user profile | Private |

### Pets (`/api/pets`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all pets (with filters) | Public |
| GET | `/:id` | Get single pet | Public |
| POST | `/` | Create new pet | Admin |
| PUT | `/:id` | Update pet | Admin |
| DELETE | `/:id` | Delete pet | Admin |
| POST | `/:id/photos` | Upload pet photos | Admin |
| GET | `/admin/stats` | Get pet statistics | Admin |

#### Pet Filters (Query Parameters)
- `search`: Search by name or breed
- `species`: Filter by species (Dog, Cat, Bird, Rabbit, Other)
- `breed`: Filter by breed
- `gender`: Filter by gender (Male, Female)
- `size`: Filter by size (Small, Medium, Large)
- `minAge`: Minimum age
- `maxAge`: Maximum age
- `status`: Filter by status (Available, Pending, Adopted)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)

### Applications (`/api/applications`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create application | User |
| GET | `/` | Get applications | Private |
| GET | `/:id` | Get single application | Private |
| PUT | `/:id/status` | Update application status | Admin |
| DELETE | `/:id` | Delete application | Private |
| GET | `/stats` | Get application statistics | Admin |

## User Roles

### Admin
- Full access to all endpoints
- Can manage pets (CRUD operations)
- Can review and approve/reject adoption applications
- Can view statistics

### User
- Can browse and search pets
- Can apply for pet adoption
- Can view own applications
- Can update own profile

### Visitor (Unauthenticated)
- Can view available pets
- Can search and filter pets
- Can view pet details

## Sample Requests

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "address": "123 Main St"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Pets (with filters)
```bash
curl "http://localhost:5000/api/pets?species=Dog&minAge=1&maxAge=5"
```

### Create Pet (Admin only)
```bash
curl -X POST http://localhost:5000/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Buddy",
    "species": "Dog",
    "breed": "Golden Retriever",
    "age": 3,
    "gender": "Male",
    "size": "Large",
    "color": "Golden",
    "description": "Friendly and energetic dog",
    "vaccinated": true,
    "neutered": true,
    "photos": ["https://example.com/photo.jpg"],
    "adoptionFee": 200,
    "location": "New York"
  }'
```

### Submit Adoption Application
```bash
curl -X POST http://localhost:5000/api/applications \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "pet": "PET_ID",
    "applicantInfo": {
      "phone": "1234567890",
      "address": "123 Main St",
      "housingType": "House",
      "hasYard": true,
      "hasPets": false,
      "experience": "I have experience with dogs",
      "reason": "I want a companion"
    }
  }'
```

## Database Models

### User
- name, email, password, role, phone, address
- Passwords are hashed using bcrypt
- Role: 'user' or 'admin'

### Pet
- name, species, breed, age, gender, size, color
- description, medicalHistory
- vaccinated, neutered (booleans)
- photos (array of URLs)
- status: 'Available', 'Pending', 'Adopted'
- adoptionFee, location
- addedBy (reference to User)

### Application
- pet (reference to Pet)
- applicant (reference to User)
- status: 'Pending', 'Approved', 'Rejected'
- applicantInfo (phone, address, housingType, hasYard, hasPets, petsDescription, experience, reason)
- notes, reviewedBy, reviewedAt

## API Response Format

All API responses follow a standardized format for consistency and predictability.

### Success Response
```json
{
  "success": true,
  "message": "Descriptive success message",
  "data": {
    // Response data
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Items retrieved successfully",
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "count": 10
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    // Optional detailed error information
  }
}
```

### HTTP Status Codes
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request or validation error
- **401 Unauthorized**: Authentication required or failed
- **403 Forbidden**: Authenticated but not authorized
- **404 Not Found**: Resource not found
- **422 Unprocessable Entity**: Validation error with field details
- **500 Internal Server Error**: Server error

### Response Examples

**Successful Login (200)**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Resource Created (201)**
```json
{
  "success": true,
  "message": "Pet created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Buddy",
    "species": "Dog",
    "status": "Available"
  }
}
```

**Validation Error (422)**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

## Benefits of Layered Architecture

### Separation of Concerns
- **Controllers**: Focus solely on HTTP layer
- **Services**: Contain all business logic in one place
- **Repositories**: Centralize database operations

### Maintainability
- Changes to business logic only affect services
- Database query changes isolated to repositories
- Easy to understand code flow

### Testability
- Unit test services independently
- Mock repositories for service tests
- Mock services for controller tests

### Reusability
- Services can be reused across different controllers
- Repository methods can be shared by multiple services
- Reduces code duplication

### Scalability
- Easy to add new features
- Simple to modify existing functionality
- Clear boundaries between layers

## Security Features

- JWT authentication
- Password hashing with bcrypt
- Role-based authorization
- Request validation
- CORS enabled
- Protected routes
- Custom error classes for consistent error handling

## Development

```bash
# Install nodemon for development
npm install -g nodemon

# Run in development mode
npm run dev
```

## Production Deployment

1. Set `NODE_ENV=production` in .env
2. Use strong JWT_SECRET
3. Configure MongoDB connection (MongoDB Atlas recommended)
4. Configure Cloudinary for image hosting
5. Use process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name pet-adoption-api
   ```

## Testing

You can test the API using:
- **Swagger UI** (Interactive): http://localhost:5000/api-docs
- Postman
- cURL
- Thunder Client (VS Code extension)
- Any HTTP client

### Quick Test with Swagger
1. Start the server: `npm start`
2. Open browser: http://localhost:5000/api-docs
3. Click "Authorize" button
4. Register/Login to get a JWT token
5. Enter token in the format: `Bearer YOUR_TOKEN`
6. Test any endpoint interactively

## License

MIT

