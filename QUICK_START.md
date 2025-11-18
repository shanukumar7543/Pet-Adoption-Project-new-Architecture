# 🚀 Quick Start Guide

Get your Pet Adoption System up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (should be v14+)
node --version

# Check MongoDB (should be v4.4+)
mongod --version

# Check npm
npm --version
```

## Step 1: Start MongoDB

```bash
# Linux/Mac
sudo systemctl start mongod

# Or run directly
mongod

# Verify MongoDB is running
mongo --eval "db.version()"
```

## Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies (first time only)
npm install

# The .env file is already configured with default values
# You can use it as-is for development

# Start the backend server
npm run dev
```

✅ Backend should now be running on `http://localhost:5000`

## Step 3: Setup Frontend (New Terminal)

```bash
# Open a new terminal window/tab

# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start the frontend server
npm start
```

✅ Frontend will automatically open at `http://localhost:3000`

## Step 4: Create Admin Account

1. Open `http://localhost:3000` in your browser
2. Click "Register" and create an account with:
   - Name: Admin User
   - Email: admin@test.com
   - Password: admin123
   - Fill other fields

3. After registration, open MongoDB shell or MongoDB Compass and run:

```javascript
db.users.updateOne(
  { email: "admin@test.com" },
  { $set: { role: "admin" } }
)
```

4. Logout and login again to see Admin Dashboard link

## Step 5: Test the Application

### As Admin:
1. Login with admin account
2. Go to "Admin Dashboard"
3. Add a sample pet:
   - Name: Buddy
   - Species: Dog
   - Breed: Golden Retriever
   - Age: 3
   - Gender: Male
   - Size: Large
   - Description: Friendly dog
   - Photos: Use any image URL like `https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400`
   - Check Vaccinated and Neutered

### As Regular User:
1. Create a new account (different email)
2. Browse pets
3. Click on the pet you added
4. Apply for adoption
5. Go to "My Applications" to see your application

### Back to Admin:
1. Go to Admin Dashboard
2. Click "Review Applications"
3. See the application
4. Approve or reject it

## 🎉 That's it! Your Pet Adoption System is running!

## Quick Commands Reference

### Backend
```bash
cd backend
npm run dev          # Start development server
npm start            # Start production server
```

### Frontend
```bash
cd frontend
npm start            # Start development server
npm run build        # Build for production
```

### MongoDB
```bash
sudo systemctl start mongod    # Start MongoDB (Linux)
sudo systemctl stop mongod     # Stop MongoDB (Linux)
mongo                          # Open MongoDB shell
```

## Default Ports

- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3000
- **MongoDB**: mongodb://localhost:27017

## Troubleshooting

### Backend won't start
- Check if MongoDB is running: `sudo systemctl status mongod`
- Check if port 5000 is available: `lsof -i :5000`
- Check .env file exists in backend directory

### Frontend won't start
- Check if port 3000 is available: `lsof -i :3000`
- Check .env file exists in frontend directory
- Verify backend is running first

### Can't login
- Check browser console for errors
- Verify backend is running
- Check CORS is enabled in backend
- Clear browser localStorage

### MongoDB connection failed
- Verify MongoDB is running: `sudo systemctl status mongod`
- Check MONGODB_URI in backend/.env
- Try: `mongo` in terminal to test connection

## Sample Photo URLs

Use these for testing pet photos:

- Dog: `https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400`
- Cat: `https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400`
- Bird: `https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400`
- Rabbit: `https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400`

## Next Steps

1. Read the full README.md for detailed documentation
2. Explore API endpoints in backend/README.md
3. Customize the UI colors in frontend/src/index.css
4. Add more pets and test all features
5. Deploy to production (see README.md)

## Need Help?

- Check the main README.md for detailed documentation
- Review backend/README.md for API documentation
- Review frontend/README.md for React app details

---

**Happy Pet Adoption! 🐾**

