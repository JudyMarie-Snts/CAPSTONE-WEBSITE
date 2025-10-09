"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get available tables for a specific date and time
router.get('/available', async (req, res) => {
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
        const allTables = await (0, database_1.executeQuery)('SELECT * FROM restaurant_tables ORDER BY table_number');
        console.log('Total tables in database:', allTables.length);
        // Get reserved tables for the specific date and time
        // Use TIME() function to compare time without seconds
        const reservedTables = await (0, database_1.executeQuery)(`
      SELECT DISTINCT table_id 
      FROM reservations 
      WHERE reservation_date = ? 
      AND TIME_FORMAT(reservation_time, '%H:%i') = ? 
      AND status IN ('pending', 'confirmed')
    `, [date, time]);
        const reservedTableIds = reservedTables.map(r => r.table_id);
        console.log('Reserved table IDs:', reservedTableIds);
        // Filter out reserved tables
        const availableTables = allTables.filter(table => !reservedTableIds.includes(table.id));
        console.log('Available tables count:', availableTables.length);
        const response = {
            success: true,
            message: 'Available tables retrieved successfully',
            data: availableTables
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching available tables:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch available tables'
        });
    }
});
// Get all tables
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const tables = await (0, database_1.executeQuery)('SELECT * FROM restaurant_tables ORDER BY table_number');
        const response = {
            success: true,
            message: 'Tables retrieved successfully',
            data: tables
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching tables:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tables'
        });
    }
});
// Get table by ID
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const tables = await (0, database_1.executeQuery)('SELECT * FROM restaurant_tables WHERE id = ?', [id]);
        if (tables.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Table not found'
            });
        }
        const response = {
            success: true,
            message: 'Table retrieved successfully',
            data: tables[0]
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching table:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch table'
        });
    }
});
// Update table status
router.put('/:id/status', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['available', 'occupied', 'reserved', 'maintenance'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        await (0, database_1.executeQuery)('UPDATE restaurant_tables SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
        const response = {
            success: true,
            message: 'Table status updated successfully'
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error updating table status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update table status'
        });
    }
});
exports.default = router;
//# sourceMappingURL=tables.js.map