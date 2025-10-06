# Image Display Fix Guide

## Problem
Images are not displaying on all pages in the SISZUM POS application.

## Root Causes
1. Vite dev server needs proper asset configuration
2. Frontend server needs restart to pick up changes
3. Asset paths need to be properly resolved

## Solutions Implemented

### 1. Updated Vite Configuration
**File:** `client/vite.config.js`

Added:
- Path aliases for easier imports
- Asset file type inclusions (JPG, PNG, etc.)
- Proper asset handling in build
- Server configuration

### 2. Created Image Loader Utility
**File:** `client/src/utils/imageLoader.js`

Provides:
- Centralized image imports
- Helper functions for dynamic image loading
- All asset paths exported as constants

### 3. How to Use Image Loader (Optional)

Instead of:
```javascript
import bg from '../assets/bg.jpg'
```

You can use:
```javascript
import ASSETS from '../utils/imageLoader'
// Then use: ASSETS.BG
```

## Quick Fix Steps

### Option 1: Restart Frontend Server (Recommended)

**Windows:**
1. Double-click `client/RESTART_FRONTEND.bat`
2. Wait for server to start
3. Open browser to `http://localhost:5173`

**Manual:**
```bash
# Stop current server (Ctrl+C in terminal)
cd c:\xampp\htdocs\client
npm run dev
```

### Option 2: Clear Cache and Restart

```bash
cd c:\xampp\htdocs\client

# Clear Vite cache
rm -rf node_modules/.vite

# Restart server
npm run dev
```

### Option 3: Full Clean Restart

```bash
cd c:\xampp\htdocs\client

# Clear all caches
rm -rf node_modules/.vite
rm -rf dist

# Reinstall dependencies (if needed)
npm install

# Start server
npm run dev
```

## Verification

After restarting, check these pages to verify images are loading:

1. **Home Page** (`/`) - Hero image, gallery
2. **Menu Pages:**
   - Featured Menu (`/featuremenu`)
   - Unlimited Menu (`/unlimited`)
   - Ala Carte (`/alacarte`)
   - Side Dishes (`/sidedish`)
3. **Promos** (`/promos`) - Promo images
4. **Feedback** (`/feedback`) - Background images
5. **Reservation** (`/reservation`) - Reservation images
6. **Refilling** (`/refilling`) - Background images

## Common Issues & Solutions

### Issue: Images still not loading after restart
**Solution:** Hard refresh browser
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

### Issue: Some images load, others don't
**Solution:** Check file names match exactly (case-sensitive)
- Example: `Bean Sprouts.png` vs `bean sprouts.png`

### Issue: Images work in dev but not in build
**Solution:** The vite.config.js now handles this with:
```javascript
assetsInclude: ['**/*.jpg', '**/*.JPG', '**/*.png', '**/*.PNG']
```

### Issue: Console shows 404 errors for images
**Solution:** 
1. Verify image exists in `src/assets/` folder
2. Check import path is correct
3. Restart dev server

## Asset Organization

All images are located in: `client/src/assets/`

Categories:
- **Backgrounds:** bg.jpg, bg2.png, hero.jpg, reservation.jpg
- **Logos:** websitelogo.jpg, blacklogo.jpg
- **Gallery:** 1.jpg through 15.png
- **Food Items:** Siomai.png, Pork.png, Beef.png, etc.
- **Menu Items:** SET A UNLIMITED PORK.jpg, CHICKEN POPPERS.JPG
- **Other:** gcash.png, bday.jpg, korea.jpg

## Testing Checklist

- [ ] Home page hero image displays
- [ ] Navigation logo displays
- [ ] Gallery images display (all 5-6 images)
- [ ] Menu page food images display
- [ ] Refill request page item images display
- [ ] Background images on all pages display
- [ ] Promo page images display
- [ ] Reservation page images display

## Technical Details

### Vite Asset Handling
Vite automatically processes imports like:
```javascript
import image from './image.jpg'
```

And converts them to optimized URLs in production.

### Import Methods

**Method 1: Direct Import (Current)**
```javascript
import bg from '../assets/bg.jpg'
<img src={bg} alt="Background" />
```

**Method 2: Using Image Loader (New Option)**
```javascript
import ASSETS from '../utils/imageLoader'
<img src={ASSETS.BG} alt="Background" />
```

**Method 3: Dynamic Import**
```javascript
import { getImageUrl } from '../utils/imageLoader'
const bgUrl = getImageUrl('bg.jpg')
<img src={bgUrl} alt="Background" />
```

## Support

If images still don't display after following all steps:

1. Check browser console for errors (F12)
2. Verify all files exist in `src/assets/`
3. Check file permissions
4. Try different browser
5. Clear browser cache completely

## Maintenance

When adding new images:
1. Place in `src/assets/` folder
2. Import in component:
   ```javascript
   import newImage from '../assets/newImage.jpg'
   ```
3. Use in JSX:
   ```javascript
   <img src={newImage} alt="Description" />
   ```
4. (Optional) Add to `imageLoader.js` for centralized access
