# 🚨 URGENT: Fix "POS base URL not configured" Error

## The Problem
The frontend cannot connect to the backend because the `.env` file is not being loaded.

## ✅ SOLUTION - Follow These Steps EXACTLY:

### Step 1: Verify .env File Exists
```bash
# Check if file exists
dir c:\xampp\htdocs\client\.env
```

**Expected:** File should exist with this content:
```env
# POS API Configuration
VITE_POS_BASE_URL=http://localhost:5001
VITE_POS_API_KEY=
```

✅ **File already exists and is correct!**

### Step 2: Test Environment Variables

1. **Open browser** to: `http://localhost:5173/test-env`

2. **Check the page** - You should see:
   - ✅ Green box showing: `http://localhost:5001`
   - ❌ Red box showing: `NOT SET` (means .env not loaded)

### Step 3: Hard Refresh Browser

**CRITICAL:** After server restarts, you MUST hard refresh!

- **Windows:** `Ctrl + Shift + R`
- **Or:** `Ctrl + F5`
- **Or:** Open DevTools (F12) → Right-click refresh button → "Empty Cache and Hard Reload"

### Step 4: Verify Connection Test

1. Open browser to: `http://localhost:5173`
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Look for this output:

**✅ SUCCESS:**
```
=== Backend Connection Test ===
Base URL from env: http://localhost:5001
✅ Backend connection successful!
Backend response: {status: "OK", message: "SISZUM POS Server is running"}
```

**❌ FAILURE:**
```
=== Backend Connection Test ===
Base URL from env: 
❌ VITE_POS_BASE_URL is not set!
```

### Step 5: Test Refill Request

1. Go to: `http://localhost:5173/refilling`
2. Enter table code: `TBL001`
3. Click "Go to Refill Request"
4. Select items
5. Click "Submit Refill Request"

**Expected:** Should redirect to success page!

## 🔧 If Still Not Working

### Option A: Manual Server Restart

1. **Stop frontend** (in terminal where it's running):
   - Press `Ctrl + C`
   - Wait for it to fully stop

2. **Start frontend again**:
   ```bash
   cd c:\xampp\htdocs\client
   npm run dev
   ```

3. **Wait for this message**:
   ```
   VITE v... ready in ...ms
   ➜  Local:   http://localhost:5173/
   ```

4. **Hard refresh browser**: `Ctrl + Shift + R`

### Option B: Use Batch File

1. **Close all browser tabs** with `localhost:5173`
2. **Double-click**: `c:\xampp\htdocs\client\RESTART_FRONTEND.bat`
3. **Wait** for server to start
4. **Open browser** to `http://localhost:5173`
5. **Check** `/test-env` page

### Option C: Nuclear Option (Complete Reset)

```bash
# Stop all node processes
taskkill /F /IM node.exe

# Wait 2 seconds
timeout /t 2

# Start backend
cd c:\xampp\htdocs\client\server
start npm run dev

# Wait 3 seconds
timeout /t 3

# Start frontend
cd c:\xampp\htdocs\client
npm run dev
```

Then:
1. Wait for both servers to fully start
2. Open browser to `http://localhost:5173/test-env`
3. Verify green box shows `http://localhost:5001`
4. Hard refresh: `Ctrl + Shift + R`

## 🎯 Quick Verification Checklist

- [ ] Backend running: `http://localhost:5001/api/health` returns OK
- [ ] Frontend running: `http://localhost:5173` loads
- [ ] .env file exists in `c:\xampp\htdocs\client\.env`
- [ ] .env contains `VITE_POS_BASE_URL=http://localhost:5001`
- [ ] Test page shows green: `http://localhost:5173/test-env`
- [ ] Console shows connection success (F12 → Console)
- [ ] Refill request works: `/refilling` → enter TBL001 → submit

## 📝 Understanding the Issue

### Why .env Doesn't Load

Vite (the frontend build tool) only loads `.env` files when the server **starts**. If you:
1. Create `.env` file
2. Server is already running
3. **Result:** File is NOT loaded!

**Solution:** Restart the server!

### Why Hard Refresh is Needed

Browsers cache JavaScript files. Even if the server restarts:
1. Browser uses old cached JavaScript
2. Old JavaScript doesn't have environment variables
3. **Result:** Still shows "not configured"!

**Solution:** Hard refresh clears cache!

## 🐛 Debugging

### Check Console Logs

When you submit a refill request, console should show:

```javascript
Submitting refill request: {table_code: "TBL001", ...}
Creating refill request to: http://localhost:5001/api/refill-requests
Payload: {...}
Response status: 201
Response data: {success: true, ...}
```

### If You See:

**"POS base URL not configured"**
→ .env not loaded, restart frontend

**"Network error"**
→ Backend not running, start backend

**"Invalid table code"**
→ Table doesn't exist, use TBL001-TBL008

**"Table code is missing"**
→ Go to /refilling first, enter table code

## 📞 Support

Both servers are currently running:
- ✅ Backend: http://localhost:5001
- ✅ Frontend: http://localhost:5173

**Next step:** Hard refresh your browser and check `/test-env` page!

## 🎉 Success Indicators

You'll know it's working when:
1. `/test-env` shows GREEN box with `http://localhost:5001`
2. Console shows "✅ Backend connection successful!"
3. Refill request submits without errors
4. Database shows new entry in `refill_requests` table
