# Quick Deployment Guide

## 🚀 Deploy to Render (Easiest - 5 minutes)

### Step 1: Prepare MongoDB Atlas (Free)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up (free)
3. Create a **free M0 cluster** (takes 3-5 minutes)
4. Click **"Connect"** → **"Connect your application"**
5. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your actual password
7. Add database name: `smart_attendance`
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smart_attendance?retryWrites=true&w=majority
   ```
8. Go to **Network Access** → **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`)

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up (free)

2. Click **"New +"** → **"Web Service"**

3. **Connect your repository:**
   - If using GitHub: Connect GitHub → Select your repo
   - If not using GitHub: Use **"Manual Deploy"** and upload your `attendance-system` folder

4. **Configure the service:**
   - **Name**: `smart-attendance` (or any name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. **Add Environment Variables:**
   Click **"Environment"** tab and add:
   ```
   NODE_ENV = production
   MONGO_URI = mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/smart_attendance?retryWrites=true&w=majority
   APP_BASE_URL = https://smart-attendance.onrender.com
   PORT = 10000
   ```
   (Replace `smart-attendance.onrender.com` with your actual Render URL after first deploy)

6. **Deploy!**
   - Click **"Create Web Service"**
   - Wait 2-3 minutes for build
   - Copy your public URL (e.g., `https://smart-attendance.onrender.com`)

7. **Update APP_BASE_URL:**
   - Go back to Environment Variables
   - Update `APP_BASE_URL` to your actual Render URL
   - Save → It will redeploy automatically

### Step 3: Test

1. Open `https://your-app.onrender.com/teacher.html`
2. Create a session
3. Share the link with students
4. Test on mobile!

---

## 🚂 Deploy to Railway (Alternative)

1. Go to [railway.app](https://railway.app) and sign up

2. **New Project** → **Deploy from GitHub** (or upload folder)

3. **Add MongoDB:**
   - Click **"+ New"** → **"Database"** → **"MongoDB"**
   - Railway creates MongoDB automatically
   - Copy the connection string from the MongoDB service

4. **Add Environment Variables:**
   - Go to your web service → **Variables** tab
   - Add:
     ```
     MONGO_URI = <railway-mongodb-connection-string>
     APP_BASE_URL = https://your-app.up.railway.app
     ```

5. **Deploy!** Railway auto-deploys on git push

---

## 📱 Mobile Testing

Once deployed:

1. **Teacher (on laptop/desktop):**
   - Open `https://your-app.onrender.com/teacher.html`
   - Create session → Get link

2. **Student (on mobile phone):**
   - Open the link from teacher
   - Allow GPS permission
   - Mark attendance

3. **Works from anywhere!** (Any Wi-Fi, mobile data, etc.)

---

## 🔧 Troubleshooting

### Build fails
- Check Node version (needs 16+)
- Check `package.json` has correct scripts

### MongoDB connection error
- Verify `MONGO_URI` is correct
- Check MongoDB Atlas Network Access allows all IPs
- Ensure database name is in the URI

### App works but links show localhost
- Update `APP_BASE_URL` environment variable to your deployed URL
- Restart the service

### GPS not working on mobile
- Ensure you're using HTTPS (Render/Railway provide this)
- Check browser permissions for location

---

## ✅ Success Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Network Access allows all IPs (0.0.0.0/0)
- [ ] App deployed to Render/Railway
- [ ] Environment variables set correctly
- [ ] Public URL works on desktop
- [ ] Public URL works on mobile
- [ ] GPS permission works on mobile
- [ ] Attendance marking works
- [ ] Export downloads work

---

**Need help?** Check the main `README.md` for more details.

