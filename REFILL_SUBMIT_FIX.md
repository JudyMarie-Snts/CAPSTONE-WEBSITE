# Refill Request Submission Fix

## Problem
"Failed to submit refill request. Please try again." error when submitting refill requests.

## Root Causes Identified

1. **Frontend .env not loaded** - Frontend server needs restart to pick up VITE_POS_BASE_URL
2. **Missing table code validation** - No check if table code exists before submission
3. **Poor error messages** - Generic errors don't help debug the issue

## Solutions Implemented

### 1. Enhanced Error Handling
**File:** `client/src/pages/RefillRequest.jsx`

Added:
- Table code validation before submission
- Better error messages with specific details
- Console logging for debugging
- Redirect to refilling page if table code is missing

### 2. Improved API Client
**File:** `client/src/api/pos.js`

Added:
- Detailed console logging for all API calls
- Better error messages
- Response status and data logging

### 3. Connection Test Utility
**File:** `client/src/utils/testConnection.js`

Created automatic backend connection test that:
- Runs on app startup (development mode)
- Checks if VITE_POS_BASE_URL is configured
- Tests actual connection to backend
- Provides helpful error messages

### 4. Auto-loaded in Main App
**File:** `client/src/main.jsx`

Added import to run connection test on startup.

## How to Fix

### Step 1: Restart Frontend Server

**CRITICAL:** The frontend MUST be restarted to load the .env file!

```bash
# Stop current frontend (Ctrl+C in terminal)
cd c:\xampp\htdocs\client
npm run dev
```

**Or use the batch file:**
```
Double-click: c:\xampp\htdocs\client\RESTART_FRONTEND.bat
```

### Step 2: Verify Backend is Running

```bash
# Test backend health
curl http://localhost:5001/api/health

# Or in PowerShell
Invoke-RestMethod -Uri "http://localhost:5001/api/health"
```

Expected response:
```json
{
  "status": "OK",
  "message": "SISZUM POS Server is running"
}
```

### Step 3: Check Browser Console

1. Open browser to `http://localhost:5173`
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Look for connection test output:

**Success:**
```
=== Backend Connection Test ===
Base URL from env: http://localhost:5001
✅ Backend connection successful!
```

**Failure:**
```
=== Backend Connection Test ===
Base URL from env: 
❌ VITE_POS_BASE_URL is not set!
```

### Step 4: Test Refill Request Flow

1. Go to `/refilling`
2. Enter table code: `TBL001`
3. Click "Go to Refill Request"
4. Select some items
5. Click "Submit Refill Request"
6. Check console for detailed logs

## Debugging

### Check .env File

**Location:** `c:\xampp\htdocs\client\.env`

**Contents:**
```env
# POS API Configuration
VITE_POS_BASE_URL=http://localhost:5001
VITE_POS_API_KEY=
```

### Console Logs to Watch For

**When submitting refill request:**
```
Submitting refill request: {table_code: "TBL001", ...}
Creating refill request to: http://localhost:5001/api/refill-requests
Payload: {...}
Response status: 201
Response data: {success: true, ...}
```

**If backend not configured:**
```
POS base URL not configured, check .env file
```

**If network error:**
```
Network error creating refill request: Failed to fetch
```

## Common Issues & Solutions

### Issue 1: "POS base URL not configured"
**Cause:** .env file not loaded or frontend not restarted

**Solution:**
1. Verify `.env` file exists in `client/` folder
2. Verify it contains `VITE_POS_BASE_URL=http://localhost:5001`
3. **Restart frontend server** (CRITICAL!)
4. Hard refresh browser (Ctrl+Shift+R)

### Issue 2: "Table code is missing"
**Cause:** Navigated directly to /refill-request without going through /refilling

**Solution:**
1. Go to `/refilling` first
2. Enter valid table code
3. Then proceed to refill request page

### Issue 3: "Network error"
**Cause:** Backend server not running

**Solution:**
```bash
cd c:\xampp\htdocs\client\server
npm run dev
```

### Issue 4: "Invalid table code"
**Cause:** Table code doesn't exist in database

**Solution:**
Use one of these valid codes:
- TBL001 through TBL008

## Verification Checklist

- [ ] Backend server running on port 5001
- [ ] Frontend server running on port 5173
- [ ] .env file exists with correct VITE_POS_BASE_URL
- [ ] Frontend server restarted after creating .env
- [ ] Browser console shows successful connection test
- [ ] Can navigate to /refilling page
- [ ] Can enter table code and proceed
- [ ] Can select items on refill request page
- [ ] Can submit refill request successfully
- [ ] Database shows new entry in refill_requests table

## Testing the Fix

### Test 1: Connection Test
1. Open browser to `http://localhost:5173`
2. Open console (F12)
3. Look for "✅ Backend connection successful!"

### Test 2: Full Flow
1. Go to `http://localhost:5173/refilling`
2. Enter: `TBL001`
3. Click "Go to Refill Request"
4. Select: Pork (2), Kimchi (1)
5. Click "Submit Refill Request"
6. Should redirect to success page

### Test 3: Database Verification
```sql
SELECT * FROM refill_requests ORDER BY id DESC LIMIT 1;
```

Should show your newly created refill request.

## Technical Details

### Environment Variables in Vite

Vite only loads environment variables that start with `VITE_`:
- ✅ `VITE_POS_BASE_URL` - Loaded
- ❌ `POS_BASE_URL` - NOT loaded

### When .env Changes

Vite does NOT hot-reload .env changes. You MUST:
1. Stop the dev server
2. Start it again
3. Hard refresh browser

### API Flow

```
Frontend (React)
  ↓
pos.js (API Client)
  ↓
HTTP POST to http://localhost:5001/api/refill-requests
  ↓
Backend (Express)
  ↓
refills.ts (Route Handler)
  ↓
MySQL Database (refill_requests table)
```

## Support

If still not working:

1. Check both server terminals for errors
2. Check browser console for errors
3. Verify both servers are running:
   - Backend: `http://localhost:5001/api/health`
   - Frontend: `http://localhost:5173`
4. Clear browser cache completely
5. Try incognito/private window

## Files Modified

- ✅ `client/src/pages/RefillRequest.jsx` - Added validation and better errors
- ✅ `client/src/api/pos.js` - Added logging and error handling
- ✅ `client/src/utils/testConnection.js` - Created connection test
- ✅ `client/src/main.jsx` - Auto-load connection test
- ✅ `client/.env` - Already created with correct values

## Next Steps

After fixing:
1. Test all refill request flows
2. Monitor console for any errors
3. Check database for successful entries
4. Test with different table codes
5. Test with different item selections
