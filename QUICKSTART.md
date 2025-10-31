# Quick Start Guide - WealthWatch

## ✅ Current Status
Your WealthWatch website is **LIVE and RUNNING**!

### Services Running:
- **MongoDB**: Docker container on port 27017
- **Web Server**: Node.js on port 5001
- **Website**: http://localhost:5001

---

## 🌐 Access Website
Open your browser and go to:
```
http://localhost:5001
```

---

## 🎯 What's Working

### MongoDB CRUD Operations
All database operations are implemented and working:

**Users**
- ✅ Create (Register new users)
- ✅ Read (Login, authentication)

**Expenses**
- ✅ Create (Add new expenses)
- ✅ Read (View all expenses, single expense)
- ✅ Update (Modify existing expenses)
- ✅ Delete (Remove expenses)

**Budgets**
- ✅ Create (Set budget limits)
- ✅ Read (View all budgets, single budget)
- ✅ Update (Modify budget amounts)
- ✅ Delete (Remove budgets)

---

## 📱 API Endpoints

### Authentication
```bash
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login
POST /api/auth/logout      # Logout
GET  /api/auth/me          # Get current user
```

### Expenses (Full CRUD)
```bash
GET    /api/expenses           # List all expenses
GET    /api/expenses/:id       # Get single expense
POST   /api/expenses           # Create expense
PUT    /api/expenses/:id       # Update expense
DELETE /api/expenses/:id       # Delete expense
GET    /api/expenses/stats/summary  # Get statistics
```

### Budgets (Full CRUD)
```bash
GET    /api/budgets       # List all budgets
GET    /api/budgets/:id   # Get single budget
POST   /api/budgets       # Create budget
PUT    /api/budgets/:id   # Update budget
DELETE /api/budgets/:id   # Delete budget
```

### Analytics
```bash
GET /api/analytics/summary    # Get spending analytics
```

---

## 🔧 Management Commands

### Check Status
```bash
# View server logs
tail -f /tmp/wealthwatch.log

# Check if server is running
ps aux | grep "tsx server" | grep -v grep

# Check MongoDB
docker ps | grep mongodb

# Test website
curl http://localhost:5001
```

### Start/Stop Services

**Stop Everything:**
```bash
# Stop web server
pkill -f "tsx server"

# Stop MongoDB
docker stop mongodb
```

**Start Everything:**
```bash
# Start MongoDB (if stopped)
docker start mongodb

# Start web server
cd /home/joyjames/Desktop/priya/wealthwatch
npm run dev
```

---

## 💾 Database Management

### Access MongoDB Shell
```bash
# Connect to MongoDB
docker exec -it mongodb mongosh

# Inside MongoDB shell:
use wealthwatch
db.users.find()      # View users
db.expenses.find()   # View expenses
db.budgets.find()    # View budgets
```

### View Collections
```bash
# List all collections
docker exec -it mongodb mongosh wealthwatch --eval "db.getCollectionNames()"

# Count documents
docker exec -it mongodb mongosh wealthwatch --eval "db.expenses.countDocuments()"
```

---

## 📚 Project Structure

```
/home/joyjames/Desktop/priya/wealthwatch/
├── server/
│   ├── index.ts           # Main server file
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Storage interface
│   └── mongoStorage.ts    # MongoDB implementation (CRUD)
├── client/                # Frontend React app
├── .env                   # Environment variables
├── package.json           # Dependencies
└── MONGODB_SETUP.md       # Detailed setup guide
```

---

## 🧪 Test the API

### Register a User
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

### Create an Expense (after login)
```bash
curl -X POST http://localhost:5001/api/expenses \
  -H "Content-Type: application/json" \
  -H "Cookie: token=YOUR_TOKEN_HERE" \
  -d '{
    "amount": 50.00,
    "category": "Food",
    "description": "Lunch",
    "date": "2025-10-30"
  }'
```

---

## 🔐 Environment Variables

Located in `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/wealthwatch
PORT=5001
NODE_ENV=development
```

---

## ⚠️ Troubleshooting

**Website not loading?**
```bash
# Restart the server
pkill -f "tsx server" && cd /home/joyjames/Desktop/priya/wealthwatch && npm run dev
```

**MongoDB connection error?**
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# Start if not running
docker start mongodb
```

**Port 5001 already in use?**
```bash
# Find process using port
sudo lsof -i :5001

# Kill the process
sudo kill -9 <PID>
```

---

## 🎉 Success!

Your WealthWatch application is:
- ✅ Running on http://localhost:5001
- ✅ Connected to MongoDB database
- ✅ Full CRUD operations working
- ✅ Ready to track expenses and budgets

Enjoy your wealth management application!

---

## 📖 Additional Resources

- **Full Setup Guide**: `MONGODB_SETUP.md`
- **Complete Summary**: `SETUP_COMPLETE.md`
- **Server Logs**: `/tmp/wealthwatch.log`
