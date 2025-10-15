import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { pool } from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

const router = express.Router();

// Get all customer timers
router.get('/', async (req, res) => {
  try {
    const { table_id, is_active } = req.query;
    
    let query = `
      SELECT 
        ct.*,
        rt.table_number,
        rt.table_code,
        o.order_code,
        TIMESTAMPDIFF(SECOND, ct.start_time, COALESCE(ct.end_time, NOW())) as current_elapsed_seconds
      FROM customer_timers ct
      LEFT JOIN restaurant_tables rt ON ct.table_id = rt.id
      LEFT JOIN orders o ON ct.order_id = o.id
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (table_id) {
      query += ' AND ct.table_id = ?';
      params.push(table_id);
    }
    
    if (is_active !== undefined) {
      query += ' AND ct.is_active = ?';
      params.push(is_active === 'true' ? 1 : 0);
    }
    
    query += ' ORDER BY ct.created_at DESC';
    
    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    
    res.json({
      success: true,
      data: rows
    });
  } catch (error: any) {
    console.error('Error fetching customer timers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer timers',
      error: error.message
    });
  }
});

// Get customer timer by table code
router.get('/table/:tableCode', async (req, res) => {
  try {
    const { tableCode } = req.params;
    
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        ct.*,
        rt.table_number,
        rt.table_code,
        o.order_code,
        TIMESTAMPDIFF(SECOND, ct.start_time, COALESCE(ct.end_time, NOW())) as current_elapsed_seconds
      FROM customer_timers ct
      LEFT JOIN restaurant_tables rt ON ct.table_id = rt.id
      LEFT JOIN orders o ON ct.order_id = o.id
      WHERE rt.table_code = ? AND ct.is_active = 1
      ORDER BY ct.created_at DESC
      LIMIT 1`,
      [tableCode]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active timer found for this table'
      });
    }
    
    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error: any) {
    console.error('Error fetching customer timer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer timer',
      error: error.message
    });
  }
});

// Create or update customer timer
router.post('/', async (req, res) => {
  try {
    const { 
      customer_name, 
      table_id, 
      table_code,
      order_id, 
      start_time 
    } = req.body;
    
    // Validate required fields
    if (!customer_name || (!table_id && !table_code)) {
      return res.status(400).json({
        success: false,
        message: 'Customer name and table information are required'
      });
    }
    
    let finalTableId = table_id;
    
    // If table_code is provided but not table_id, get table_id from table_code
    if (!table_id && table_code) {
      const [tableRows] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM restaurant_tables WHERE table_code = ?',
        [table_code]
      );
      
      if (tableRows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Table not found with the provided code'
        });
      }
      
      finalTableId = tableRows[0].id;
    }
    
    // Check if there's already an active timer for this table
    const [existingRows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM customer_timers WHERE table_id = ? AND is_active = 1',
      [finalTableId]
    );
    
    if (existingRows.length > 0) {
      // Update existing timer
      const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE customer_timers 
         SET customer_name = ?, order_id = ?, start_time = COALESCE(?, start_time), updated_at = NOW()
         WHERE id = ?`,
        [customer_name, order_id || null, start_time || null, existingRows[0].id]
      );
      
      // Fetch updated timer
      const [updatedRows] = await pool.execute<RowDataPacket[]>(
        `SELECT 
          ct.*,
          rt.table_number,
          rt.table_code,
          o.order_code
        FROM customer_timers ct
        LEFT JOIN restaurant_tables rt ON ct.table_id = rt.id
        LEFT JOIN orders o ON ct.order_id = o.id
        WHERE ct.id = ?`,
        [existingRows[0].id]
      );
      
      res.json({
        success: true,
        message: 'Customer timer updated successfully',
        data: updatedRows[0]
      });
    } else {
      // Create new timer
      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO customer_timers 
          (customer_name, table_id, order_id, start_time, is_active, created_at, updated_at)
        VALUES (?, ?, ?, COALESCE(?, NOW()), 1, NOW(), NOW())`,
        [customer_name, finalTableId, order_id || null, start_time || null]
      );
      
      // Fetch created timer
      const [newRows] = await pool.execute<RowDataPacket[]>(
        `SELECT 
          ct.*,
          rt.table_number,
          rt.table_code,
          o.order_code
        FROM customer_timers ct
        LEFT JOIN restaurant_tables rt ON ct.table_id = rt.id
        LEFT JOIN orders o ON ct.order_id = o.id
        WHERE ct.id = ?`,
        [result.insertId]
      );
      
      res.status(201).json({
        success: true,
        message: 'Customer timer created successfully',
        data: newRows[0]
      });
    }
  } catch (error: any) {
    console.error('Error creating/updating customer timer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create/update customer timer',
      error: error.message
    });
  }
});

// Update customer timer (stop/pause/resume)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active, end_time, elapsed_seconds } = req.body;
    
    // Check if timer exists
    const [existingRows] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM customer_timers WHERE id = ?',
      [id]
    );
    
    if (existingRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer timer not found'
      });
    }
    
  const updateFields: string[] = [];
  const updateParams: any[] = [];
    
    if (is_active !== undefined) {
      updateFields.push('is_active = ?');
      updateParams.push(is_active ? 1 : 0);

      // If deactivating, set end_time if not provided
      if (!is_active && !end_time) {
        updateFields.push('end_time = NOW()');
      }
    }

    if (end_time !== undefined) {
      updateFields.push('end_time = ?');
      updateParams.push(end_time);
    }

    if (elapsed_seconds !== undefined) {
      // Explicit override if provided in payload
      updateFields.push('elapsed_seconds = ?');
      updateParams.push(elapsed_seconds);
    } else {
      // If the request is turning the timer inactive or providing an end_time,
      // compute and set the final elapsed_seconds as well for consistency
      const isCurrentlyActive = existingRows[0].is_active === 1;
      const deactivatingNow = is_active !== undefined ? (!is_active && isCurrentlyActive) : false;
      const finalizing = deactivatingNow || end_time !== undefined;

      if (finalizing) {
        if (end_time !== undefined) {
          // Use provided end_time for precise calculation
          updateFields.push('elapsed_seconds = TIMESTAMPDIFF(SECOND, start_time, ?)');
          updateParams.push(end_time);
        } else {
          // end_time is NOW() (set above) so compute against NOW()
          updateFields.push('elapsed_seconds = TIMESTAMPDIFF(SECOND, start_time, NOW())');
        }
      }
    }
    
    updateFields.push('updated_at = NOW()');
    updateParams.push(id);
    
    await pool.execute(
      `UPDATE customer_timers SET ${updateFields.join(', ')} WHERE id = ?`,
      updateParams
    );
    
    // Fetch updated timer
    const [updatedRows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        ct.*,
        rt.table_number,
        rt.table_code,
        o.order_code
      FROM customer_timers ct
      LEFT JOIN restaurant_tables rt ON ct.table_id = rt.id
      LEFT JOIN orders o ON ct.order_id = o.id
      WHERE ct.id = ?`,
      [id]
    );
    
    res.json({
      success: true,
      message: 'Customer timer updated successfully',
      data: updatedRows[0]
    });
  } catch (error: any) {
    console.error('Error updating customer timer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer timer',
      error: error.message
    });
  }
});

// Stop timer by table code
router.patch('/table/:tableCode/stop', async (req, res) => {
  try {
    const { tableCode } = req.params;
    
    // Get table_id from table_code
    const [tableRows] = await pool.execute<RowDataPacket[]>(
      'SELECT id FROM restaurant_tables WHERE table_code = ?',
      [tableCode]
    );
    
    if (tableRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Table not found with the provided code'
      });
    }
    
    const tableId = tableRows[0].id;
    
    // Update active timer for this table
    const [result] = await pool.execute<ResultSetHeader>(
      `UPDATE customer_timers 
       SET is_active = 0, end_time = NOW(), 
           elapsed_seconds = TIMESTAMPDIFF(SECOND, start_time, NOW()),
           updated_at = NOW()
       WHERE table_id = ? AND is_active = 1`,
      [tableId]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'No active timer found for this table'
      });
    }
    
    // Fetch updated timer
    const [updatedRows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
        ct.*,
        rt.table_number,
        rt.table_code,
        o.order_code
      FROM customer_timers ct
      LEFT JOIN restaurant_tables rt ON ct.table_id = rt.id
      LEFT JOIN orders o ON ct.order_id = o.id
      WHERE ct.table_id = ? AND ct.is_active = 0
      ORDER BY ct.updated_at DESC
      LIMIT 1`,
      [tableId]
    );
    
    res.json({
      success: true,
      message: 'Customer timer stopped successfully',
      data: updatedRows[0] || null
    });
  } catch (error: any) {
    console.error('Error stopping customer timer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to stop customer timer',
      error: error.message
    });
  }
});

export default router;
