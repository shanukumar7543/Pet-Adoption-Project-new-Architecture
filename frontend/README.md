# Pet Adoption System - Frontend

A modern, responsive React application for browsing and adopting pets. Features a beautiful UI with role-based dashboards for users and administrators.

## Features

### Public Features
- 🏠 Beautiful landing page with featured sections
- 🐾 Browse available pets with advanced filters
- 🔍 Search pets by name or breed
- 📊 Filter by species, breed, age, gender, and size
- 📄 Pagination for large datasets
- 📱 Fully responsive design
- 🖼️ Pet detail pages with photo galleries

### User Features
- 🔐 Secure authentication (Login/Register)
- 📝 Apply for pet adoption
- 📋 View application status
- ✏️ Update profile information
- 🗑️ Cancel pending applications

### Admin Features
- 🎛️ Comprehensive admin dashboard
- ➕ Add new pets
- ✏️ Edit pet information
- 🗑️ Delete pets
- 👀 View all adoption applications
- ✅ Approve applications
- ❌ Reject applications with notes
- 📊 Automatic pet status management

## Tech Stack

- **Framework**: React 18
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS3 with custom styles
- **State Management**: React Context API
- **Build Tool**: Create React App

## Project Structure

```
frontend/
├── public/
│   └── index.html           # HTML template
├── src/
│   ├── components/
│   │   ├── Navbar.js        # Navigation component
│   │   ├── Navbar.css
│   │   ├── PrivateRoute.js  # Protected route wrapper
│   │   └── AdminRoute.js    # Admin-only route wrapper
│   ├── context/
│   │   └── AuthContext.js   # Authentication context
│   ├── pages/
│   │   ├── Home.js          # Landing page
│   │   ├── Home.css
│   │   ├── Login.js         # Login page
│   │   ├── Register.js      # Registration page
│   │   ├── Auth.css         # Auth pages styles
│   │   ├── PetList.js       # Pet listing page
│   │   ├── PetList.css
│   │   ├── PetDetails.js    # Pet detail page
│   │   ├── PetDetails.css
│   │   ├── UserDashboard.js # User dashboard
│   │   ├── UserDashboard.css
│   │   ├── AdminDashboard.js # Admin dashboard
│   │   └── AdminDashboard.css
│   ├── utils/
│   │   └── api.js           # Axios instance with auth
│   ├── App.js               # Main app component
│   ├── index.js             # Entry point
│   └── index.css            # Global styles
├── .env                     # Environment variables
├── package.json             # Dependencies
└── README.md
```

## Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Available Scripts

### `npm start`
Runs the app in development mode on `http://localhost:3000`

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner

### `npm run eject`
**Note: this is a one-way operation!**

## Pages & Routes

| Route | Component | Access | Description |
|-------|-----------|--------|-------------|
| `/` | Home | Public | Landing page |
| `/pets` | PetList | Public | Browse all pets |
| `/pets/:id` | PetDetails | Public | View pet details |
| `/login` | Login | Public | User login |
| `/register` | Register | Public | User registration |
| `/dashboard` | UserDashboard | Private (User) | User's applications |
| `/admin` | AdminDashboard | Private (Admin) | Admin panel |

## Key Features Implementation

### Authentication & Security
- **JWT-based Authentication**: Secure token-based authentication system
- **HTTP-Only Cookies**: JWT tokens stored in cookies (not sessionStorage/localStorage)
- **No Client-Side Data Storage**: User data fetched from API using JWT, preventing tampering
- **Automatic Token Validation**: Tokens validated on app load, auto-logout on expiration
- **Protected Routes**: Route guards for authenticated users
- **Admin-Only Routes**: Separate route protection for administrative functions
- **Automatic Token Inclusion**: JWT automatically added to all API requests via interceptor
- **Role-Based Access Control**: Server-side role verification, not client-side
- **Always Fresh Data**: User data always fetched from server, never stale cached data

### Pet Browsing
- Grid layout with responsive design
- Real-time search functionality
- Multiple filter options:
  - Species (Dog, Cat, Bird, Rabbit, Other)
  - Gender (Male, Female)
  - Size (Small, Medium, Large)
  - Age range (Min/Max)
- Pagination with page navigation
- Beautiful pet cards with hover effects

### Pet Details
- Comprehensive pet information display
- Photo gallery support
- Medical history and health status
- Adoption application form (inline)
- Real-time availability status

### User Dashboard
- View all submitted applications
- Filter by status (All, Pending, Approved, Rejected)
- Application status badges
- Cancel pending applications
- View pet details from applications

### Admin Dashboard
- Two main tabs: Pets Management & Applications
- **Pets Management**:
  - Add new pets with complete details
  - Edit existing pets
  - Delete pets with confirmation
  - Photo URL support
  - Status tracking
- **Applications Management**:
  - View all applications
  - See applicant details
  - Review application information
  - Approve/reject with notes
  - Automatic pet status updates

## Styling

The application uses a modern, gradient-based design with:
- Purple/blue gradient theme (#667eea to #764ba2)
- Card-based layouts
- Smooth animations and transitions
- Responsive grid systems
- Mobile-first design approach
- Hover effects for interactivity

## State Management

### AuthContext
Provides global authentication state with secure data management:
- `user`: Current user object (fetched from API, never stored in browser storage)
- `loading`: Loading state during authentication checks
- `register()`: Register new user and fetch user data from API
- `login()`: Login user and fetch user data from API
- `logout()`: Logout user and clear authentication token
- `updateUser()`: Update user profile on server and refetch fresh data (async)
- `fetchUserData()`: Fetch current user data from API using JWT token

## API Integration

All API calls use the configured axios instance (`utils/api.js`) which:
- Automatically includes JWT token in headers
- Uses base URL from environment variables
- Handles authentication errors

Example:
```javascript
import api from '../utils/api';

// Make authenticated request
const response = await api.get('/applications');
```

## Responsive Design

The application is fully responsive with breakpoints for:
- Mobile: < 768px
- Tablet: 768px - 968px
- Desktop: > 968px

Features adapt including:
- Navigation menu (hamburger on mobile)
- Grid layouts (1-4 columns based on screen)
- Form layouts
- Card sizes
- Button widths

## User Experience

### For Visitors
1. Browse pets on landing page
2. Use filters to find ideal pet
3. View detailed pet information
4. Register to apply for adoption

### For Users
1. Login to account
2. Browse and search pets
3. Apply for pet adoption
4. Track application status
5. Receive feedback on applications

### For Admins
1. Login with admin account
2. Add new pets to system
3. Manage existing pets
4. Review applications
5. Approve/reject applications
6. System auto-updates pet status

## Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy build folder**
   The `build` folder contains static files ready for deployment

3. **Deployment Options**:
   - **Netlify**: Drag and drop build folder
   - **Vercel**: Connect GitHub repo
   - **AWS S3**: Upload to S3 bucket
   - **Nginx**: Serve build folder

4. **Environment Variables**
   Update `REACT_APP_API_URL` to point to production API

## Sample Admin Account Creation

To create an admin account, you need to manually update the database:

```javascript
// Using MongoDB shell or compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or register normally and update via backend.

## Best Practices

- Components are modular and reusable
- Context API for global state
- Protected routes for security
- Error handling on all API calls
- Loading states for better UX
- Form validation
- Responsive design throughout

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## Troubleshooting

### API Connection Issues
- Verify backend is running on correct port
- Check REACT_APP_API_URL in .env
- Verify CORS is enabled on backend

### Authentication Issues
- Clear browser cookies for the domain
- Check token expiration (tokens validated on each app load)
- Verify JWT_SECRET matches backend
- Check browser console for API errors

### Build Issues
- Delete node_modules and reinstall
- Clear npm cache: `npm cache clean --force`
- Check Node.js version compatibility

## License

MIT

