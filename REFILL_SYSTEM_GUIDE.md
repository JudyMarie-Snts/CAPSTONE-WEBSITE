# Refill System Integration Guide

## Overview
The refill system has been successfully integrated with the `siszum_pos` database. Customers can now request refills using valid table codes, and all requests are stored in the database.

## Database Schema

### Table: `refill_requests`
```sql
CREATE TABLE `refill_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `table_code` varchar(20) NOT NULL,
  `table_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `status` enum('pending','in_progress','completed','cancelled') DEFAULT 'pending',
  `request_type` varchar(100) DEFAULT NULL,
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `completed_at` timestamp NULL DEFAULT NULL,
  `processed_by` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `table_id` (`table_id`),
  KEY `customer_id` (`customer_id`),
  KEY `processed_by` (`processed_by`),
  CONSTRAINT FOREIGN KEY (`table_id`) REFERENCES `restaurant_tables` (`id`),
  CONSTRAINT FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`) ON DELETE SET NULL,
  CONSTRAINT FOREIGN KEY (`processed_by`) REFERENCES `admins` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

## API Endpoints

### Backend Routes (`/api/refill-requests`)

#### 1. Get All Refill Requests
- **GET** `/api/refill-requests`
- **Query Parameters:**
  - `status`: Filter by status (pending, in_progress, completed, cancelled)
  - `table_id`: Filter by table ID
- **Response:** List of refill requests with table and customer information

#### 2. Get Refill Request by ID
- **GET** `/api/refill-requests/:id`
- **Response:** Single refill request details

#### 3. Create Refill Request
- **POST** `/api/refill-requests`
- **Body:**
  ```json
  {
    "table_code": "TBL001",
    "customer_id": 1,
    "request_type": "Pork (2), Kimchi (1)",
    "notes": "Additional notes"
  }
  ```
- **Response:** Created refill request with ID

#### 4. Update Refill Request Status
- **PATCH** `/api/refill-requests/:id/status`
- **Body:**
  ```json
  {
    "status": "completed",
    "processed_by": 1,
    "notes": "Completed by staff"
  }
  ```
- **Response:** Updated refill request

#### 5. Delete Refill Request
- **DELETE** `/api/refill-requests/:id`
- **Response:** Success message

#### 6. Validate Table Code
- **POST** `/api/refill-requests/validate-table`
- **Body:**
  ```json
  {
    "table_code": "TBL001"
  }
  ```
- **Response:** Table information if valid

## Frontend Components

### 1. Refilling.jsx
- **Purpose:** Validate table code before allowing refill requests
- **Features:**
  - Validates table code against database
  - Stores table information in localStorage
  - Provides user feedback for invalid codes
  - Loading state during validation

### 2. RefillRequest.jsx
- **Purpose:** Submit refill requests with item selections
- **Features:**
  - Displays table code and number from localStorage
  - Timer functionality
  - Item selection (sides, meats, food)
  - Submits to database with proper payload
  - Real-time socket.io updates

### 3. RefillRequestSubmitted.jsx
- **Purpose:** Confirmation page after submission
- **Features:**
  - Success message
  - Navigation back to refill request page

## Configuration

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=siszum_pos
DB_PORT=3306
PORT=5001
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_POS_BASE_URL=http://localhost:5001
VITE_POS_API_KEY=
```

## How It Works

### Customer Flow:
1. Customer navigates to `/refilling`
2. Enters table code (e.g., TBL001)
3. System validates table code against database
4. If valid, redirects to `/refill-request` with table info
5. Customer selects items to refill
6. Submits request to database
7. Request is stored with status "pending"
8. Admin receives real-time notification via Socket.IO

### Admin Flow:
1. Admin sees new refill request in dashboard
2. Updates status to "in_progress" when preparing
3. Updates status to "completed" when delivered
4. Customer can see status updates in real-time

## Real-time Features

The system uses Socket.IO for real-time updates:
- **Event:** `refill-request-created` - Emitted when new request is created
- **Event:** `refill-request-updated` - Emitted when request status changes
- **Event:** `refill-request-deleted` - Emitted when request is deleted

## Testing

### Test Table Codes (from database):
- TBL001 - Table 1 (Capacity: 4)
- TBL002 - Table 2 (Capacity: 4)
- TBL003 - Table 3 (Capacity: 6)
- TBL004 - Table 4 (Capacity: 4)
- TBL005 - Table 5 (Capacity: 2)
- TBL006 - Table 6 (Capacity: 4)
- TBL007 - Table 7 (Capacity: 8)
- TBL008 - Table 8 (Capacity: 4)

### Sample Test Flow:
1. Start the backend server: `cd client/server && npm run dev`
2. Start the frontend: `cd client && npm run dev`
3. Navigate to `http://localhost:5173/refilling`
4. Enter table code: `TBL001`
5. Click "Go to Refill Request"
6. Select items and submit
7. Check database for new entry in `refill_requests` table

## Database Queries

### Get all pending refill requests:
```sql
SELECT rr.*, rt.table_number, c.first_name, c.last_name
FROM refill_requests rr
LEFT JOIN restaurant_tables rt ON rr.table_id = rt.id
LEFT JOIN customers c ON rr.customer_id = c.id
WHERE rr.status = 'pending'
ORDER BY rr.requested_at DESC;
```

### Update refill request status:
```sql
UPDATE refill_requests 
SET status = 'completed', 
    completed_at = NOW(), 
    processed_by = 1
WHERE id = ?;
```

## Troubleshooting

### Issue: "Invalid table code"
- **Solution:** Verify table code exists in `restaurant_tables` table
- **Check:** `SELECT * FROM restaurant_tables WHERE table_code = 'TBL001';`

### Issue: "Failed to submit refill request"
- **Solution:** Check backend server is running on port 5001
- **Check:** Visit `http://localhost:5001/api/health`

### Issue: "Unable to validate table code"
- **Solution:** Ensure VITE_POS_BASE_URL is set in client/.env
- **Check:** Console logs in browser developer tools

## Next Steps

1. **Admin Dashboard Integration:** Create admin panel to manage refill requests
2. **Customer Notifications:** Add email/SMS notifications when refill is ready
3. **Analytics:** Track refill request patterns and popular items
4. **Mobile App:** Develop mobile app for easier refill requests
5. **QR Code Integration:** Generate QR codes for tables to auto-fill table code

## Support

For issues or questions, check:
- Backend logs: `client/server/` console output
- Frontend logs: Browser developer console
- Database logs: phpMyAdmin or MySQL console
