"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../config/database");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Get all feedback (admin only)
router.get('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const query = `
      SELECT * FROM customer_feedback 
      ORDER BY created_at DESC
    `;
        const [feedback] = await database_1.pool.execute(query);
        const response = {
            success: true,
            message: 'Feedback retrieved successfully',
            data: feedback
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback',
            error: error.message
        });
    }
});
// Create new feedback (customer)
router.post('/', auth_1.authenticateToken, async (req, res) => {
    try {
        const { customer_name, email, feedback_type = 'general', rating, feedback_text, order_id } = req.body;
        // Get customer_id from authenticated user
        const customer_id = req.user?.userId || null;
        // Validate required fields
        if (!customer_name || !feedback_text) {
            return res.status(400).json({
                success: false,
                message: 'Customer name and feedback text are required'
            });
        }
        // Validate rating if provided
        if (rating && (rating < 1 || rating > 5)) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be between 1 and 5'
            });
        }
        const query = `
      INSERT INTO customer_feedback (
        customer_id, customer_name, email, feedback_type, 
        rating, feedback_text, order_id, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `;
        const [result] = await database_1.pool.execute(query, [
            customer_id,
            customer_name,
            email || null,
            feedback_type,
            rating || null,
            feedback_text,
            order_id || null
        ]);
        const response = {
            success: true,
            message: 'Feedback submitted successfully',
            data: { id: result.insertId }
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Error creating feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit feedback',
            error: error.message
        });
    }
});
// Get feedback by ID
router.get('/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const query = 'SELECT * FROM customer_feedback WHERE id = ?';
        const [feedback] = await database_1.pool.execute(query, [id]);
        if (feedback.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Feedback not found'
            });
        }
        const response = {
            success: true,
            message: 'Feedback retrieved successfully',
            data: feedback[0]
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch feedback',
            error: error.message
        });
    }
});
// Update feedback status (admin only)
router.put('/:id/status', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, admin_response } = req.body;
        const validStatuses = ['pending', 'reviewed', 'responded', 'resolved'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }
        const admin_id = req.user?.userId || null;
        let query = 'UPDATE customer_feedback SET status = ?';
        const params = [status];
        if (admin_response) {
            query += ', admin_response = ?, responded_by = ?, responded_at = NOW()';
            params.push(admin_response, admin_id);
        }
        query += ', updated_at = NOW() WHERE id = ?';
        params.push(id);
        await database_1.pool.execute(query, params);
        const response = {
            success: true,
            message: 'Feedback status updated successfully'
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update feedback',
            error: error.message
        });
    }
});
exports.default = router;
//# sourceMappingURL=feedback.js.map