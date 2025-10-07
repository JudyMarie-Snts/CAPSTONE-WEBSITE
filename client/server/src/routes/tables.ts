import express from 'express';
import { executeQuery } from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { AuthenticatedRequest, ApiResponse } from '../types';

const router = express.Router();

interface Table {
  id: number;
  table_number: string;
  table_code: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  location?: string;
  created_at: string;
  updated_at: string;
}

// Get available tables for a specific date and time
router.get('/available', async (req: express.Request, res: express.Response) => {
  try {
    const { date, time } = req.query;

    if (!date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Date and time are required'
      });
    }

    console.log('Checking availability for date:', date, 'time:', time);

    // Get all tables
    const allTables = await executeQuery('SELECT * FROM restaurant_tables ORDER BY table_number') as Table[];
    console.log('Total tables in database:', allTables.length);

    // Get reserved tables for the specific date and time
    // Use TIME() function to compare time without seconds
    const reservedTables = await executeQuery(`
      SELECT DISTINCT table_id 
      FROM reservations 
      WHERE reservation_date = ? 
      AND TIME_FORMAT(reservation_time, '%H:%i') = ? 
      AND status IN ('pending', 'confirmed')
    `, [date, time]) as any[];

    const reservedTableIds = reservedTables.map(r => r.table_id);
    console.log('Reserved table IDs:', reservedTableIds);

    // Filter out reserved tables
    const availableTables = allTables.filter(table => !reservedTableIds.includes(table.id));
    console.log('Available tables count:', availableTables.length);

    const response: ApiResponse<Table[]> = {
      success: true,
      message: 'Available tables retrieved successfully',
      data: availableTables
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching available tables:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available tables'
    });
  }
});

// Get all tables
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const tables = await executeQuery('SELECT * FROM restaurant_tables ORDER BY table_number') as Table[];

    const response: ApiResponse<Table[]> = {
      success: true,
      message: 'Tables retrieved successfully',
      data: tables
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tables'
    });
  }
});

// Get table by ID
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { id } = req.params;

    const tables = await executeQuery('SELECT * FROM restaurant_tables WHERE id = ?', [id]) as Table[];

    if (tables.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Table not found'
      });
    }

    const response: ApiResponse<Table> = {
      success: true,
      message: 'Table retrieved successfully',
      data: tables[0]
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching table:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch table'
    });
  }
});

// Update table status
router.put('/:id/status', authenticateToken, async (req: AuthenticatedRequest, res: express.Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['available', 'occupied', 'reserved', 'maintenance'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    await executeQuery(
      'UPDATE restaurant_tables SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );

    const response: ApiResponse = {
      success: true,
      message: 'Table status updated successfully'
    };

    res.json(response);
  } catch (error) {
    console.error('Error updating table status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update table status'
    });
  }
});

export default router;
