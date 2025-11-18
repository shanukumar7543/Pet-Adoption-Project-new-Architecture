# 🐾 Pet Adoption System

A comprehensive, production-ready full-stack web application for managing pet adoptions. Built with modern technologies and following MVC architecture patterns.

## 📋 Overview

This system enables users to browse pets available for adoption, submit adoption applications, and allows administrators to manage the entire adoption process. The application features role-based access control, advanced search/filtering, and a beautiful modern UI.

## ✨ Features

### 👥 User Roles

#### **Visitor (Public)**
- Browse available pets
- Search pets by name or breed
- Filter pets by species, breed, age, gender, and size
- View detailed pet information
- Pagination on pet listings

#### **Registered User**
- All visitor features
- Register and login
- Submit adoption applications
- View application status
- Track application history
- Update profile information
- Cancel pending applications

#### **Administrator**
- All user features
- Add new pets to the system
- Edit pet information
- Delete pets
- Upload pet photos
- View all adoption applications
- Approve or reject applications
- Add notes to applications
- Automatic pet status management
- View system statistics

### 🚀 Technical Features

- **JWT Authentication**: Secure token-based authentication
- **Role-Based Authorization**: Different permissions for users and admins
- **RESTful API**: Well-structured API endpoints
- **MVC Architecture**: Clean separation of concerns
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Centralized error management
- **Responsive Design**: Mobile-first, works on all devices
- **Image Support**: Photo uploads for pets
- **Search & Filter**: Advanced filtering capabilities
- **Pagination**: Efficient data loading
- **Real-time Updates**: Status updates and notifications

### 🔒 Security Features

- **Secure Authentication**: JWT tokens stored in HTTP-only cookies (not sessionStorage/localStorage)
- **No Client-Side Data Storage**: User data fetched from API using JWT, preventing data tampering
- **Automatic Token Validation**: Tokens validated on app load, auto-logout on expiration
- **Password Hashing**: bcrypt with salt rounds for secure password storage
- **Protected Routes**: Middleware authentication for sensitive endpoints
- **Role-Based Access Control**: Server-side role verification, not client-side
- **Always Fresh Data**: User data always fetched from server, never stale cached data

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcryptjs
- **Validation**: express-validator
- **File Upload**: Multer (local storage)

### Frontend
- **Library**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 (Custom)
- **State Management**: Context API
- **Build Tool**: Create React App

## 📁 Project Structure

```
pet-ado-app/
├── backend/
│   ├── config/              # Configuration files
│   ├── controllers/         # Business logic
│   ├── models/              # Database models
│   ├── middleware/          # Custom middleware
│   ├── routes/              # API routes
│   ├── utils/               # Helper functions
│   ├── uploads/             # Local file storage
│   ├── .env                 # Environment variables
│   ├── server.js            # Entry point
│   └── package.json
├── frontend/
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # Context providers
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   ├── App.js
│   │   └── index.js
│   ├── .env                 # Environment variables
│   └── package.json
└── README.md
```

**Note**: This is a production-ready application with all essential features implemented. Make sure to configure environment variables properly before deployment and use strong secrets in production.

# Pet-Adoption
