# Timer Auto-Complete Feature

## Overview
When the refill request timer reaches 00:00:00, the system will automatically update the refill request status to "completed" in the database.

## How It Works

### 1. Refill Request Creation
When a customer submits a refill request:
- Request is created in database with status "pending"
- Refill request ID is saved in localStorage
- Timer starts counting down

### 2. Timer Countdown
- Timer displays remaining time (HH:MM:SS format)
- Status shows "On-going" while timer is running
- Updates every second

### 3. Timer Completion (00:00:00)
When timer reaches zero:
1. **Status changes to "Completed"** (displayed on screen)
2. **Database is updated** via API call to mark request as "completed"
3. **Waits 1 second** to show the completed status
4. **Redirects to TimesUp page**

## Technical Implementation

### Frontend Changes

**File:** `client/src/pages/RefillRequest.jsx`

**Added:**
- `currentRefillId` state to track the active refill request
- `updateRefillStatusToCompleted()` function to update database
- Modified timer tick function to call update when timer ends
- Save refill ID to localStorage when request is created

**File:** `client/src/api/pos.js`

**Added:**
- `updateRefillRequestStatus(refillId, status)` function
- Makes PATCH request to `/api/refill-requests/:id/status`

### Backend API

**Endpoint:** `PATCH /api/refill-requests/:id/status`

**Request Body:**
```json
{
  "status": "completed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Refill request updated successfully",
  "data": {
    "id": 37,
    "status": "completed",
    "completed_at": "2025-10-06T03:23:00.000Z",
    ...
  }
}
```

## Flow Diagram

```
Customer submits refill request
         ↓
Request created in DB (status: "pending")
         ↓
Refill ID saved to localStorage
         ↓
Timer starts (e.g., 02:00:00)
         ↓
Timer counts down...
         ↓
Timer reaches 00:00:00
         ↓
Status changes to "Completed" on screen
         ↓
API call: PATCH /api/refill-requests/{id}/status
         ↓
Database updated: status = "completed"
         ↓
Wait 1 second
         ↓
Redirect to /timesup page
```

## Database Changes

### Before Timer Ends:
```sql
SELECT * FROM refill_requests WHERE id = 37;
```
```
id | status  | completed_at
37 | pending | NULL
```

### After Timer Ends:
```sql
SELECT * FROM refill_requests WHERE id = 37;
```
```
id | status    | completed_at
37 | completed | 2025-10-06 11:23:00
```

## Console Logs

When timer ends, you'll see:
```
Timer ended, updating refill request status to completed...
Updating refill request status to: completed
Update status response: {success: true, ...}
✅ Refill request marked as completed
```

## Benefits

1. **Automatic tracking** - No manual intervention needed
2. **Accurate timing** - Exact completion time recorded
3. **Database consistency** - Status always reflects timer state
4. **Admin visibility** - Admins can see which requests are completed
5. **Analytics** - Can track average completion times

## Testing

### Test the Feature:

1. **Create a refill request** with short timer:
   - Go to `/refill-request?minutes=1`
   - This sets a 1-minute timer
   
2. **Submit the request**
   - Select some items
   - Click "Submit Refill Request"
   - Note the refill ID in console
   
3. **Wait for timer to end**
   - Watch the countdown
   - At 00:00:00, status changes to "Completed"
   
4. **Check database**:
   ```sql
   SELECT * FROM refill_requests 
   WHERE id = [your_refill_id]
   ORDER BY id DESC LIMIT 1;
   ```
   - Should show `status = 'completed'`
   - Should have `completed_at` timestamp

### Quick Test (30 seconds):

```
http://localhost:5173/refill-request?minutes=0.5
```

This creates a 30-second timer for quick testing.

## Error Handling

If the API call fails:
- Error is logged to console
- Status still shows "Completed" on screen
- User is still redirected to TimesUp page
- Admin can manually update status if needed

## Future Enhancements

Possible improvements:
1. **Retry logic** - Retry API call if it fails
2. **Offline queue** - Queue updates if offline, sync when online
3. **Notification** - Notify admin when request is auto-completed
4. **Analytics** - Track completion rate and timing statistics
5. **Custom actions** - Allow different actions based on timer end

## Configuration

### Timer Duration

Can be set via:
1. **URL parameter**: `?minutes=20`
2. **localStorage**: `refillDurationSec`
3. **Default**: 2 hours (7200 seconds)

### Status Values

Valid status values:
- `pending` - Just created
- `in_progress` - Being prepared
- `completed` - Timer ended or manually completed
- `cancelled` - Cancelled by customer/admin

## Notes

- Refill ID is stored in localStorage as `currentRefillId`
- Timer deadline is stored as `refillDeadlineMs`
- If user refreshes page, timer continues from localStorage
- If user closes tab, timer is lost (could be enhanced)
