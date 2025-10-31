# MongoDB Setup for WealthWatch

## Overview
This application now uses MongoDB for database storage with full CRUD operations for:
- Users (Authentication)
- Expenses (Track spending)
- Budgets (Budget management)

## MongoDB Storage Features

### CRUD Operations Implemented:
1. **Users**
   - Create user (registration)
   - Read user by ID or email
   
2. **Expenses**
   - Create expense
   - Read all expenses for a user
   - Read single expense by ID
   - Update expense
   - Delete expense

3. **Budgets**
   - Create budget
   - Read all budgets for a user
   - Read single budget by ID
   - Update budget
   - Delete budget

## Setup Instructions

### Option 1: Using Docker (Recommended)
```bash
# Start MongoDB container
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Stop MongoDB
docker stop mongodb

# Restart MongoDB
docker start mongodb
```

### Option 2: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get your connection string
4. Update `.env` file with your connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wealthwatch
   ```

### Option 3: Local MongoDB Installation
```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongodb
```

## Environment Configuration

Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/wealthwatch
PORT=5001
NODE_ENV=development
```

## Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Expenses
- `GET /api/expenses` - Get all expenses
- `GET /api/expenses/:id` - Get expense by ID
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/stats/summary` - Get expense statistics

### Budgets
- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/:id` - Get budget by ID
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget

### Analytics
- `GET /api/analytics/summary` - Get analytics summary

## Database Collections

The MongoDB database contains three collections:
1. **users** - User accounts
2. **expenses** - Expense records
3. **budgets** - Budget configurations

## Fallback to Memory Storage

If MongoDB is not available, you can switch back to in-memory storage by updating `server/storage.ts`:
```typescript
// Comment out MongoDB storage
// const mongoStorage = new MongoStorage();
// mongoStorage.connect().catch(console.error);
// export const storage = mongoStorage;

// Use memory storage
export const storage = new MemStorage();
```

## Troubleshooting

### MongoDB Connection Issues
1. Check if MongoDB is running: `docker ps` or `sudo systemctl status mongodb`
2. Verify connection string in `.env` file
3. Check firewall settings for port 27017
4. Review logs: `docker logs mongodb`

### Application Issues
1. Check `.env` file exists and is configured correctly
2. Ensure all dependencies are installed: `npm install`
3. Clear node_modules and reinstall if needed
