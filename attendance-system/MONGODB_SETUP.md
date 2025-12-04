# MongoDB Atlas Connection Setup

## Quick Fix for Connection Error

The error "Could not connect to any servers" usually means your IP address isn't whitelisted in MongoDB Atlas.

### Step 1: Replace Password in .env

1. Open `attendance-system/.env` file
2. Find this line:
   ```
   MONGO_URI=mongodb+srv://abhi_22:<db_password>@cluster0.86fenev.mongodb.net/smart_attendance?retryWrites=true&w=majority&appName=Cluster0
   ```
3. Replace `<db_password>` with your actual MongoDB Atlas password
4. Save the file

### Step 2: Whitelist Your IP Address

1. **Go to MongoDB Atlas Dashboard:**
   - Visit: https://cloud.mongodb.com
   - Log in to your account

2. **Navigate to Network Access:**
   - Click on your cluster (Cluster0)
   - Click **"Network Access"** in the left sidebar
   - Or go directly: https://cloud.mongodb.com/v2#/security/network/whitelist

3. **Add Your IP Address:**
   - Click **"Add IP Address"** button
   - You have two options:
   
   **Option A: Add Current IP (Recommended for Testing)**
   - Click **"Add Current IP Address"** button
   - This automatically adds your current IP
   - Click **"Confirm"**
   
   **Option B: Allow All IPs (For Development)**
   - Click **"Add IP Address"**
   - Enter: `0.0.0.0/0` (allows all IPs - less secure but convenient)
   - Add a comment: "Allow all IPs for development"
   - Click **"Confirm"**

4. **Wait 1-2 minutes:**
   - MongoDB Atlas takes a moment to update the whitelist
   - You'll see a green checkmark when it's active

### Step 3: Verify Connection

1. Make sure your `.env` file has the correct password (no `<db_password>` placeholder)
2. Restart your server:
   ```bash
   npm run dev
   ```
3. You should see: `MongoDB connected` ✅

## Troubleshooting

### Still Can't Connect?

1. **Check Password:**
   - Make sure you replaced `<db_password>` with your actual password
   - Password should NOT have `<` or `>` characters
   - If your password has special characters, they might need URL encoding

2. **Check IP Whitelist:**
   - Go back to Network Access in Atlas
   - Make sure your IP shows as "Active" (green checkmark)
   - If using `0.0.0.0/0`, make sure it's confirmed

3. **Check Connection String:**
   - Your connection string should look like:
   ```
   mongodb+srv://abhi_22:YOUR_ACTUAL_PASSWORD@cluster0.86fenev.mongodb.net/smart_attendance?retryWrites=true&w=majority&appName=Cluster0
   ```

4. **Test Connection:**
   - Try connecting from MongoDB Compass or another tool
   - This helps isolate if it's a code issue or Atlas configuration

### For Production Deployment

When deploying to Render/Railway/etc:
- Use `0.0.0.0/0` in Network Access (allows all IPs)
- Or add the specific IP ranges of your hosting provider
- Make sure `APP_BASE_URL` in `.env` matches your deployed URL

---

**Need Help?** Check MongoDB Atlas documentation: https://www.mongodb.com/docs/atlas/security-whitelist/


