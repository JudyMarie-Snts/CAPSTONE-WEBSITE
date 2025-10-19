"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../config/database");
const router = express_1.default.Router();
// Get all refill requests (for admin)
router.get('/', async (req, res) => {
    try {
        const { status, table_id } = req.query;
        let query = `
      SELECT 
        rr.*,
        rt.table_number,
        c.first_name,
        c.last_name,
        c.email
      FROM refill_requests rr
      LEFT JOIN restaurant_tables rt ON rr.table_id = rt.id
      LEFT JOIN customers c ON rr.customer_id = c.id
      WHERE 1=1
    `;
        const params = [];
        if (status) {
            query += ' AND rr.status = ?';
            params.push(status);
        }
        if (table_id) {
            query += ' AND rr.table_id = ?';
            params.push(table_id);
        }
        query += ' ORDER BY rr.requested_at DESC';
        const [rows] = await database_1.pool.execute(query, params);
        res.json({
            success: true,
            data: rows
        });
    }
    catch (error) {
        console.error('Error fetching refill requests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch refill requests',
            error: error.message
        });
    }
});
// Get refill request by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await database_1.pool.execute(`SELECT 
        rr.*,
        rt.table_number,
        c.first_name,
        c.last_name,
        c.email
      FROM refill_requests rr
      LEFT JOIN restaurant_tables rt ON rr.table_id = rt.id
      LEFT JOIN customers c ON rr.customer_id = c.id
      WHERE rr.id = ?`, [id]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Refill request not found'
            });
        }
        res.json({
            success: true,
            data: rows[0]
        });
    }
    catch (error) {
        console.error('Error fetching refill request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch refill request',
            error: error.message
        });
    }
});
// Create a new refill request
router.post('/', async (req, res) => {
    try {
        const { table_code, customer_id, request_type, notes } = req.body;
        // Validate required fields
        if (!table_code) {
            return res.status(400).json({
                success: false,
                message: 'Table code is required'
            });
        }
        // Get table_id from table_code
        const [tableRows] = await database_1.pool.execute('SELECT id FROM restaurant_tables WHERE table_code = ?', [table_code]);
        if (tableRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Table not found with the provided code'
            });
        }
        const table_id = tableRows[0].id;
        // Insert refill request
        const [result] = await database_1.pool.execute(`INSERT INTO refill_requests 
        (table_code, table_id, customer_id, status, request_type, notes, requested_at)
      VALUES (?, ?, ?, 'pending', ?, ?, NOW())`, [table_code, table_id, customer_id || null, request_type || null, notes || null]);
        // Create or update customer timer when refill request is created
        try {
            // Get customer name if customer_id is provided
            let customerName = 'Walk-in Customer';
            if (customer_id) {
                const [customerRows] = await database_1.pool.execute('SELECT first_name, last_name FROM customers WHERE id = ?', [customer_id]);
                if (customerRows.length > 0) {
                    const customer = customerRows[0];
                    customerName = `${customer.first_name} ${customer.last_name}`.trim();
                }
            }
            // Check if there's already an active timer for this table
            const [existingTimerRows] = await database_1.pool.execute('SELECT id FROM customer_timers WHERE table_id = ? AND is_active = 1', [table_id]);
            if (existingTimerRows.length > 0) {
                // Update existing timer - reset start time for refill
                await database_1.pool.execute(`UPDATE customer_timers 
           SET customer_name = ?, start_time = NOW(), updated_at = NOW()
           WHERE id = ?`, [customerName, existingTimerRows[0].id]);
                console.log('✅ Updated existing customer timer for refill request');
            }
            else {
                // Create new timer
                await database_1.pool.execute(`INSERT INTO customer_timers 
            (customer_name, table_id, start_time, is_active, created_at, updated_at)
          VALUES (?, ?, NOW(), 1, NOW(), NOW())`, [customerName, table_id]);
                console.log('✅ Created new customer timer for refill request');
            }
        }
        catch (timerError) {
            console.error('Error managing customer timer:', timerError);
            // Don't fail the refill request if timer creation fails
        }
        // Fetch the created refill request
        const [newRequest] = await database_1.pool.execute(`SELECT 
        rr.*,
        rt.table_number,
        c.first_name,
        c.last_name
      FROM refill_requests rr
      LEFT JOIN restaurant_tables rt ON rr.table_id = rt.id
      LEFT JOIN customers c ON rr.customer_id = c.id
      WHERE rr.id = ?`, [result.insertId]);
        // Emit socket event for real-time updates
        const io = req.app.get('io');
        if (io) {
            io.to('admin').emit('refill-request-created', newRequest[0]);
        }
        res.status(201).json({
            success: true,
            message: 'Refill request created successfully',
            data: newRequest[0]
        });
    }
    catch (error) {
        console.error('Error creating refill request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create refill request',
            error: error.message
        });
    }
});
// Update refill request status
router.patch('/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status, processed_by, notes } = req.body;
        // Validate status
        const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }
        // Check if refill request exists
        const [existingRows] = await database_1.pool.execute('SELECT * FROM refill_requests WHERE id = ?', [id]);
        if (existingRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Refill request not found'
            });
        }
        // Update refill request
        const updateFields = ['status = ?'];
        const updateParams = [status];
        if (processed_by) {
            updateFields.push('processed_by = ?');
            updateParams.push(processed_by);
        }
        if (notes !== undefined) {
            updateFields.push('notes = ?');
            updateParams.push(notes);
        }
        if (status === 'completed') {
            updateFields.push('completed_at = NOW()');
        }
        updateParams.push(id);
        await database_1.pool.execute(`UPDATE refill_requests SET ${updateFields.join(', ')} WHERE id = ?`, updateParams);
        // Update customer timer based on refill status
        try {
            const refillRequest = existingRows[0];
            const tableId = refillRequest.table_id;
            if (status === 'completed') {
                // Stop the customer timer when refill is completed
                await database_1.pool.execute(`UPDATE customer_timers 
           SET is_active = 0, end_time = NOW(), 
               elapsed_seconds = TIMESTAMPDIFF(SECOND, start_time, NOW()),
               updated_at = NOW()
           WHERE table_id = ? AND is_active = 1`, [tableId]);
                console.log('✅ Stopped customer timer - refill completed');
            }
            else if (status === 'in_progress') {
                // Ensure timer is active when refill is in progress
                const [activeTimerRows] = await database_1.pool.execute('SELECT id FROM customer_timers WHERE table_id = ? AND is_active = 1', [tableId]);
                if (activeTimerRows.length === 0) {
                    // Create new timer if none exists
                    let customerName = 'Walk-in Customer';
                    if (refillRequest.customer_id) {
                        const [customerRows] = await database_1.pool.execute('SELECT first_name, last_name FROM customers WHERE id = ?', [refillRequest.customer_id]);
                        if (customerRows.length > 0) {
                            const customer = customerRows[0];
                            customerName = `${customer.first_name} ${customer.last_name}`.trim();
                        }
                    }
                    await database_1.pool.execute(`INSERT INTO customer_timers 
              (customer_name, table_id, start_time, is_active, created_at, updated_at)
            VALUES (?, ?, NOW(), 1, NOW(), NOW())`, [customerName, tableId]);
                    console.log('✅ Created customer timer - refill in progress');
                }
            }
        }
        catch (timerError) {
            console.error('Error updating customer timer for refill status:', timerError);
            // Don't fail the refill status update if timer update fails
        }
        // Fetch updated refill request
        const [updatedRows] = await database_1.pool.execute(`SELECT 
        rr.*,
        rt.table_number,
        c.first_name,
        c.last_name
      FROM refill_requests rr
      LEFT JOIN restaurant_tables rt ON rr.table_id = rt.id
      LEFT JOIN customers c ON rr.customer_id = c.id
      WHERE rr.id = ?`, [id]);
        // Emit socket event for real-time updates
        const io = req.app.get('io');
        if (io) {
            io.to('admin').emit('refill-request-updated', updatedRows[0]);
            if (updatedRows[0].customer_id) {
                io.to(`customer-${updatedRows[0].customer_id}`).emit('refill-request-updated', updatedRows[0]);
            }
        }
        res.json({
            success: true,
            message: 'Refill request updated successfully',
            data: updatedRows[0]
        });
    }
    catch (error) {
        console.error('Error updating refill request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update refill request',
            error: error.message
        });
    }
});
// Delete refill request
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check if refill request exists
        const [existingRows] = await database_1.pool.execute('SELECT * FROM refill_requests WHERE id = ?', [id]);
        if (existingRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Refill request not found'
            });
        }
        await database_1.pool.execute('DELETE FROM refill_requests WHERE id = ?', [id]);
        // Emit socket event for real-time updates
        const io = req.app.get('io');
        if (io) {
            io.to('admin').emit('refill-request-deleted', { id });
        }
        res.json({
            success: true,
            message: 'Refill request deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting refill request:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete refill request',
            error: error.message
        });
    }
});
// Validate table code (for frontend validation)
router.post('/validate-table', async (req, res) => {
    try {
        const { table_code } = req.body;
        if (!table_code) {
            return res.status(400).json({
                success: false,
                message: 'Table code is required'
            });
        }
        const [rows] = await database_1.pool.execute('SELECT id, table_number, table_code, status FROM restaurant_tables WHERE table_code = ?', [table_code]);
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Invalid table code'
            });
        }
        res.json({
            success: true,
            data: rows[0]
        });
    }
    catch (error) {
        console.error('Error validating table:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to validate table',
            error: error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=refills.js.map