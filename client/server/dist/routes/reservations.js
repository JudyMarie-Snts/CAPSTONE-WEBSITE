"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all reservations
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const reservations = await (0, database_1.executeQuery)(`
      SELECT 
        r.*,
        rt.table_number
      FROM reservations r
      LEFT JOIN restaurant_tables rt ON r.table_id = rt.id
      ORDER BY r.reservation_date DESC, r.reservation_time DESC
    `);
        const response = {
            success: true,
            message: 'Reservations retrieved successfully',
            data: reservations
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching reservations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reservations'
        });
    }
});
// Get reservation by ID
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const reservations = await (0, database_1.executeQuery)(`
      SELECT 
        r.*,
        rt.table_number
      FROM reservations r
      LEFT JOIN restaurant_tables rt ON r.table_id = rt.id
      WHERE r.id = ?
    `, [id]);
        if (reservations.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Reservation not found'
            });
        }
        const response = {
            success: true,
            message: 'Reservation retrieved successfully',
            data: reservations[0]
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reservation'
        });
    }
});
// Create new reservation
router.post('/', [
    auth_1.authenticateToken,
    (0, express_validator_1.body)('customer_name').isLength({ min: 2 }).withMessage('Customer name is required'),
    (0, express_validator_1.body)('phone').isMobilePhone('any').withMessage('Valid phone number is required'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Valid email is required'),
    (0, express_validator_1.body)('table_id').isInt().withMessage('Table ID must be a valid number'),
    (0, express_validator_1.body)('number_of_guests').isInt({ min: 1 }).withMessage('Number of guests must be at least 1'),
    (0, express_validator_1.body)('reservation_date').isDate().withMessage('Valid reservation date is required'),
    (0, express_validator_1.body)('reservation_time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).withMessage('Valid time is required (HH:MM or HH:MM:SS format)')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { customer_name, phone, email, table_id, occasion, number_of_guests, reservation_date, reservation_time, duration_hours = 2, payment_amount = 0, notes } = req.body;
        // Handle table_id that might be a string like "default_9"
        let parsedTableId = table_id;
        if (typeof table_id === 'string') {
            // Extract number from strings like "default_9" or just use the number if it's already a number
            const match = table_id.match(/(\d+)$/);
            parsedTableId = match ? parseInt(match[1]) : parseInt(table_id) || 1;
        }
        else {
            parsedTableId = parseInt(table_id) || 1;
        }
        // Verify that the table exists, if not use table 1 as fallback
        try {
            const tableCheckQuery = 'SELECT id FROM restaurant_tables WHERE id = ?';
            const tableResult = await (0, database_1.executeQuery)(tableCheckQuery, [parsedTableId]);
            if (!tableResult || tableResult.length === 0) {
                console.log(`⚠️ Table ${parsedTableId} not found in database, using table 1 as fallback`);
                parsedTableId = 1; // Fallback to table 1
            }
            else {
                console.log(`✅ Table ${parsedTableId} verified and exists`);
            }
        }
        catch (tableError) {
            console.log(`❌ Error checking table ${parsedTableId}, using table 1 as fallback:`, tableError);
            parsedTableId = 1; // Fallback to table 1
        }
        // Get customer_id from authenticated user (if customer role)
        const customer_id = req.user?.role === 'customer' ? req.user?.id : null;
        // Generate reservation code
        const reservation_code = `RES${Date.now()}`;
        const result = await (0, database_1.executeQuery)(`
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
        ]);
        const response = {
            success: true,
            message: 'Reservation created successfully',
            data: { id: result.insertId, reservation_code }
        };
        res.status(201).json(response);
    }
    catch (error) {
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
    auth_1.authenticateToken,
    (0, express_validator_1.body)('status').isIn(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }
        const { id } = req.params;
        const { status } = req.body;
        await (0, database_1.executeQuery)('UPDATE reservations SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
        const response = {
            success: true,
            message: 'Reservation status updated successfully'
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error updating reservation status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update reservation status'
        });
    }
});
// Update reservation
router.put('/:id', [
    auth_1.authenticateToken,
    (0, express_validator_1.body)('customer_name').optional().isLength({ min: 2 }),
    (0, express_validator_1.body)('phone').optional().isMobilePhone('any'),
    (0, express_validator_1.body)('email').optional().isEmail(),
    (0, express_validator_1.body)('table_id').optional().isInt(),
    (0, express_validator_1.body)('number_of_guests').optional().isInt({ min: 1 }),
    (0, express_validator_1.body)('reservation_date').optional().isDate(),
    (0, express_validator_1.body)('reservation_time').optional().matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/),
    (0, express_validator_1.body)('payment_status').optional().isIn(['pending', 'completed', 'failed', 'refunded']),
    (0, express_validator_1.body)('payment_amount').optional().isFloat({ min: 0 }),
    (0, express_validator_1.body)('payment_proof').optional().isLength({ max: 255 }),
    (0, express_validator_1.body)('status').optional().isIn(['pending', 'confirmed', 'cancelled', 'completed'])
], async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
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
        const filteredUpdates = {};
        Object.keys(updates).forEach(key => {
            if (validColumns.includes(key)) {
                filteredUpdates[key] = updates[key];
            }
            else {
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
        await (0, database_1.executeQuery)(`UPDATE reservations SET ${setClause} WHERE id = ?`, [...values, id]);
        const response = {
            success: true,
            message: 'Reservation updated successfully'
        };
        res.json(response);
    }
    catch (error) {
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
router.delete('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await (0, database_1.executeQuery)('DELETE FROM reservations WHERE id = ?', [id]);
        const response = {
            success: true,
            message: 'Reservation deleted successfully'
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error deleting reservation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete reservation'
        });
    }
});
// Get fully booked dates for a month
router.get('/fully-booked-dates', async (req, res) => {
    try {
        const { year, month } = req.query;
        if (!year || !month) {
            return res.status(400).json({
                success: false,
                message: 'Year and month are required'
            });
        }
        const monthNumber = Number(month);
        const yearNumber = Number(year);
        // Get total number of active tables once
        const allTables = await (0, database_1.executeQuery)('SELECT COUNT(*) as total FROM restaurant_tables');
        const totalTables = allTables[0]?.total ?? 0;
        if (totalTables === 0) {
            return res.json({
                success: true,
                message: 'No tables configured',
                data: []
            });
        }
        const timeSlots = ['17:00', '18:30', '20:00'];
        const paddedMonth = String(monthNumber).padStart(2, '0');
        const daysInMonth = new Date(yearNumber, monthNumber, 0).getDate();
        const startDate = `${year}-${paddedMonth}-01`;
        const endDate = `${year}-${paddedMonth}-${String(daysInMonth).padStart(2, '0')}`;
        const reservations = await (0, database_1.executeQuery)(`
      SELECT 
        reservation_date,
        DATE_FORMAT(reservation_time, '%H:%i') AS time_slot,
        COUNT(DISTINCT table_id) AS reserved_count
      FROM reservations
      WHERE reservation_date BETWEEN ? AND ?
        AND status IN ('pending', 'confirmed')
      GROUP BY reservation_date, time_slot
    `, [startDate, endDate]);
        const reservationMap = new Map();
        for (const entry of reservations) {
            const date = entry.reservation_date;
            const timeSlot = entry.time_slot;
            const count = Number(entry.reserved_count) || 0;
            if (!reservationMap.has(date)) {
                reservationMap.set(date, new Map());
            }
            reservationMap.get(date).set(timeSlot, count);
        }
        const fullyBookedDates = [];
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${paddedMonth}-${String(day).padStart(2, '0')}`;
            const timeSlotMap = reservationMap.get(dateStr);
            const allBooked = timeSlots.every((slot) => {
                const bookedCount = timeSlotMap?.get(slot) ?? 0;
                return bookedCount >= totalTables;
            });
            if (allBooked) {
                fullyBookedDates.push(dateStr);
            }
        }
        const response = {
            success: true,
            message: 'Fully booked dates retrieved successfully',
            data: fullyBookedDates
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching fully booked dates:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch fully booked dates'
        });
    }
});
exports.default = router;
//# sourceMappingURL=reservations.js.map