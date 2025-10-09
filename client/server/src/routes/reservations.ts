import express from 'express';
import { body, validationResult } from 'express-validator';
import { executeQuery } from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { AuthenticatedRequest, ApiResponse } from '../types';

const router = express.Router();

interface Reservation {
  id: number;
  reservation_code: string;
  customer_name: string;
  phone: string;
  email?: string;
  table_id: number;
  table_number: string;
  occasion?: string;
  number_of_guests: number;
  reservation_date: string;
  reservation_time: string;
  duration_hours: number;
  payment_amount: number;
  payment_status: 'pending' | 'paid' | 'cancelled';
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

// Get all reservations
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const reservations = await executeQuery(`
      SELECT 
        r.*,
        rt.table_number
      FROM reservations r
      LEFT JOIN restaurant_tables rt ON r.table_id = rt.id
      ORDER BY r.reservation_date DESC, r.reservation_time DESC
    `) as Reservation[];

    const response: ApiResponse<Reservation[]> = {
      success: true,
      message: 'Reservations retrieved successfully',
      data: reservations
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reservations'
    });
  }
});

// Get reservation by ID
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { id } = req.params;

    const reservations = await executeQuery(`
      SELECT 
        r.*,
        rt.table_number
      FROM reservations r
      LEFT JOIN restaurant_tables rt ON r.table_id = rt.id
      WHERE r.id = ?
    `, [id]) as Reservation[];

    if (reservations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reservation not found'
      });
    }

    const response: ApiResponse<Reservation> = {
      success: true,
      message: 'Reservation retrieved successfully',
      data: reservations[0]
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reservation'
    });
  }
});

// Create new reservation
router.post('/', [
  authenticateToken,
  body('customer_name').isLength({ min: 2 }).withMessage('Customer name is required'),
  body('phone').isMobilePhone('any').withMessage('Valid phone number is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('table_id').isInt().withMessage('Table ID must be a valid number'),
  body('number_of_guests').isInt({ min: 1 }).withMessage('Number of guests must be at least 1'),
  body('reservation_date').isDate().withMessage('Valid reservation date is required'),
  body('reservation_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Valid time is required (HH:MM or HH:MM:SS format)')
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      customer_name,
      phone,
      email,
      table_id,
      occasion,
      number_of_guests,
      reservation_date,
      reservation_time,
      duration_hours = 2,
      payment_amount = 0,
      notes
    } = req.body;

    // Handle table_id that might be a string like "default_9"
    let parsedTableId = table_id;
    if (typeof table_id === 'string') {
      // Extract number from strings like "default_9" or just use the number if it's already a number
      const match = table_id.match(/(\d+)$/);
      parsedTableId = match ? parseInt(match[1]) : parseInt(table_id) || 1;
    } else {
      parsedTableId = parseInt(table_id) || 1;
    }

    // Verify that the table exists, if not use table 1 as fallback
    try {
      const tableCheckQuery = 'SELECT id FROM restaurant_tables WHERE id = ?';
      const tableResult: any = await executeQuery(tableCheckQuery, [parsedTableId]);

      if (!tableResult || tableResult.length === 0) {
        console.log(`⚠️ Table ${parsedTableId} not found in database, using table 1 as fallback`);
        parsedTableId = 1; // Fallback to table 1
      } else {
        console.log(`✅ Table ${parsedTableId} verified and exists`);
      }
    } catch (tableError) {
      console.log(`❌ Error checking table ${parsedTableId}, using table 1 as fallback:`, tableError);
      parsedTableId = 1; // Fallback to table 1
    }

    // Get customer_id from authenticated user (if customer role)
    const customer_id = (req.user as any)?.role === 'customer' ? (req.user as any)?.id : null;

    // Generate reservation code
    const reservation_code = `RES${Date.now()}`;

    const result = await executeQuery(`
      INSERT INTO reservations (
        reservation_code, customer_id, customer_name, phone, email, table_id, occasion,
        number_of_guests, reservation_date, reservation_time,
        payment_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      reservation_code, 
      customer_id || null, 
      customer_name, 
      phone, 
      email || null, 
      parsedTableId, 
      occasion || null,
      number_of_guests, 
      reservation_date, 
      reservation_time,
      payment_amount
    ]) as any;

    const response: ApiResponse = {
      success: true,
      message: 'Reservation created successfully',
      data: { id: result.insertId, reservation_code }
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Error creating reservation:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage,
      sql: error.sql
    });
    res.status(500).json({
      success: false,
      message: 'Failed to create reservation',
      error: error.message
    });
  }
});

// Update reservation status
router.put('/:id/status', [
  authenticateToken,
  body('status').isIn(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    await executeQuery(
      'UPDATE reservations SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    const response: ApiResponse = {
      success: true,
      message: 'Reservation status updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update reservation status'
    });
  }
});

// Update reservation
router.put('/:id', [
  authenticateToken,
  body('customer_name').optional().isLength({ min: 2 }),
  body('phone').optional().isMobilePhone('any'),
  body('email').optional().isEmail(),
  body('table_id').optional().isInt(),
  body('number_of_guests').optional().isInt({ min: 1 }),
  body('reservation_date').optional().isDate(),
  body('reservation_time').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
  body('payment_status').optional().isIn(['pending', 'paid', 'cancelled']),
  body('payment_amount').optional().isFloat({ min: 0 }),
  body('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed'])
], async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const updates = req.body;

    // List of valid columns that exist in the database
    const validColumns = [
      'customer_name', 'phone', 'email', 'table_id', 'number_of_guests',
      'reservation_date', 'reservation_time', 'payment_status', 'payment_amount',
      'status', 'occasion'
    ];

    // Filter out invalid columns
    const filteredUpdates: any = {};
    Object.keys(updates).forEach(key => {
      if (validColumns.includes(key)) {
        filteredUpdates[key] = updates[key];
      } else {
        console.warn(`Ignoring invalid column: ${key}`);
      }
    });

    // Build dynamic update query
    const fields = Object.keys(filteredUpdates);
    const values = Object.values(filteredUpdates);
    
    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');

    console.log('Updating reservation:', { id, fields, values });

    await executeQuery(
      `UPDATE reservations SET ${setClause} WHERE id = ?`,
      [...values, id]
    );

    const response: ApiResponse = {
      success: true,
      message: 'Reservation updated successfully'
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error updating reservation:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({
      success: false,
      message: 'Failed to update reservation',
      error: error.message
    });
  }
});

// Delete reservation
router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { id } = req.params;

    await executeQuery('DELETE FROM reservations WHERE id = ?', [id]);

    const response: ApiResponse = {
      success: true,
      message: 'Reservation deleted successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete reservation'
    });
  }
});

// Get fully booked dates for a month
router.get('/fully-booked-dates', async (req: express.Request, res: express.Response) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        success: false,
        message: 'Year and month are required'
      });
    }

    // Get total number of tables
    const allTables = await executeQuery('SELECT COUNT(*) as total FROM restaurant_tables') as any[];
    const totalTables = allTables[0].total;

    // Get all time slots (you can customize this based on your business hours)
    const timeSlots = ['17:00', '18:30', '20:00']; // 5:00 PM, 6:30 PM, 8:00 PM

    // Get all dates in the month that have reservations
    const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

    const fullyBookedDates: string[] = [];

    // Check each day of the month
    for (let day = 1; day <= 31; day++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      let allSlotsBooked = true;
      
      // Check each time slot
      for (const timeSlot of timeSlots) {
        const reservedTables = await executeQuery(`
          SELECT COUNT(DISTINCT table_id) as reserved_count
          FROM reservations
          WHERE reservation_date = ?
          AND TIME_FORMAT(reservation_time, '%H:%i') = ?
          AND status IN ('pending', 'confirmed')
        `, [dateStr, timeSlot]) as any[];

        const reservedCount = reservedTables[0].reserved_count;
        
        // If any time slot has available tables, the date is not fully booked
        if (reservedCount < totalTables) {
          allSlotsBooked = false;
          break;
        }
      }

      if (allSlotsBooked) {
        fullyBookedDates.push(dateStr);
      }
    }

    const response: ApiResponse<string[]> = {
      success: true,
      message: 'Fully booked dates retrieved successfully',
      data: fullyBookedDates
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching fully booked dates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fully booked dates'
    });
  }
});

export default router;
