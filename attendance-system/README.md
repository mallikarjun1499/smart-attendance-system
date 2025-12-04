# Smart Attendance System

A full-stack geofencing-based attendance system with timed links, built with Node.js, Express, MongoDB, and vanilla HTML/CSS/JS.

## Features

- ✅ **Teacher creates attendance session** with GPS location
- ✅ **Random code + auto-expiring link** (10 minutes)
- ✅ **Student marks attendance** with geofencing (10m radius)
- ✅ **One student = One attendance** (unique roll number)
- ✅ **Subject-wise data separation**
- ✅ **Export attendance** (CSV, Excel, PDF)
- ✅ **Modern responsive UI** with animations
- ✅ **Works on mobile & desktop**

## Tech Stack

- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Frontend**: HTML/CSS/JS (no framework)
- **Export**: ExcelJS, PDFKit, json2csv

## Quick Start (Local)

### Prerequisites

- Node.js (v16+)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone and install dependencies:**

```bash
cd attendance-system
npm install
```

2. **Set up environment variables:**

Create a `.env` file:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/smart_attendance
APP_BASE_URL=http://localhost:3000
```

3. **Start MongoDB** (if using local):

```bash
# Windows (if installed as service, it should auto-start)
# Or download MongoDB Community Server

# macOS/Linux
mongod
```

4. **Run the server:**

```bash
npm run dev    # Development mode with auto-reload
# OR
npm start      # Production mode
```

5. **Open in browser:**

- Teacher: `http://localhost:3000/teacher.html`
- Student: `http://localhost:3000/attend.html`

## Deployment Options

### Option 1: Render (Recommended - Free Tier)

1. **Sign up** at [render.com](https://render.com)

2. **Create a new Web Service:**
   - Connect your GitHub repository
   - Or use manual deploy

3. **Configure:**
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: `Node`

4. **Add Environment Variables:**
   ```
   NODE_ENV=production
   MONGO_URI=<your-mongodb-atlas-uri>
   APP_BASE_URL=https://your-app-name.onrender.com
   PORT=10000
   ```

5. **Deploy!** Render will give you a public URL like `https://smart-attendance.onrender.com`

### Option 2: Railway

1. **Sign up** at [railway.app](https://railway.app)

2. **New Project** → Deploy from GitHub

3. **Add MongoDB:**
   - Click "New" → Database → MongoDB
   - Copy the connection string

4. **Add Environment Variables:**
   ```
   MONGO_URI=<railway-mongodb-uri>
   APP_BASE_URL=https://your-app.up.railway.app
   ```

5. **Deploy!**

### Option 3: MongoDB Atlas (Cloud Database)

If deploying anywhere, use MongoDB Atlas:

1. **Sign up** at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)

2. **Create a free cluster** (M0 Sandbox)

3. **Get connection string:**
   - Click "Connect" → "Connect your application"
   - Copy the URI (replace `<password>` with your password)

4. **Whitelist IP:**
   - Network Access → Add IP Address → "Allow Access from Anywhere" (0.0.0.0/0)

5. **Use in `.env`:**
   ```
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smart_attendance?retryWrites=true&w=majority
   ```

### Option 4: Heroku

1. **Install Heroku CLI** and login

2. **Create app:**
   ```bash
   heroku create your-app-name
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set MONGO_URI=<your-mongodb-uri>
   heroku config:set APP_BASE_URL=https://your-app-name.herokuapp.com
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

## Mobile Access

Once deployed, the app works on **any device** (mobile/laptop) from **any network**:

- Teacher creates session → gets a public link
- Share link with students
- Students open link on their phones → mark attendance
- All data syncs to MongoDB

## API Endpoints

### Teacher Routes

- `POST /api/teacher/session` - Create attendance session
- `GET /api/teacher/session/:code` - Get session details
- `GET /api/teacher/session/:code/attendance` - Get attendance list
- `GET /api/teacher/session/:code/export/csv` - Export CSV
- `GET /api/teacher/session/:code/export/excel` - Export Excel
- `GET /api/teacher/session/:code/export/pdf` - Export PDF

### Student Routes

- `POST /api/student/attendance` - Mark attendance

### Export Routes

- `GET /api/export/csv?subject=Math` - Export all (or filtered by subject)
- `GET /api/export/excel?subject=Math` - Export Excel
- `GET /api/export/pdf?subject=Math` - Export PDF

## Project Structure

```
attendance-system/
├── server.js              # Main Express server
├── config/
│   └── db.js             # MongoDB connection
├── models/
│   ├── Session.js        # Session model
│   └── Attendance.js     # Attendance model
├── routes/
│   ├── sessionRoutes.js  # Teacher/session routes
│   ├── attendanceRoutes.js # Student routes
│   └── exportRoutes.js   # Export routes
├── public/
│   ├── teacher.html      # Teacher UI
│   ├── attend.html       # Student UI
│   └── styles.css        # Styles
├── package.json
├── .env                  # Environment variables
└── README.md
```

## Troubleshooting

### "Cannot GET /api/export/..."
- **Solution**: Restart the server after code changes

### "Connection refused" on mobile
- **Solution**: Use the deployed public URL, not `localhost`

### GPS not working on mobile
- **Solution**: Deploy with HTTPS (Render/Railway provide this automatically)

### MongoDB connection error
- **Solution**: Check `MONGO_URI` in `.env` and ensure MongoDB is running/accessible

## License

MIT


