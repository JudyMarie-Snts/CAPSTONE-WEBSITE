import express from 'express';
import { pool } from '../config/database';
import { authenticateToken } from '../middleware/auth';
import { ApiResponse } from '../types';

const router = express.Router();

// Get public feedback (resolved only, no authentication required)
router.get('/public', async (req, res) => {
  try {
    const query = `
      SELECT 
        id,
        customer_name,
        feedback_type,
        rating,
        feedback_text,
        admin_response,
        created_at,
        responded_at
      FROM customer_feedback 
      WHERE status = 'resolved' AND rating IS NOT NULL
      ORDER BY responded_at DESC, created_at DESC
      LIMIT 20
    `;
    const [feedback]: any = await pool.execute(query);

    const response: ApiResponse = {
      success: true,
      message: 'Public feedback retrieved successfully',
      data: feedback
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error fetching public feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch public feedback',
      error: error.message
    });
  }
});

// Get all feedback (admin only)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = `
      SELECT * FROM customer_feedback 
      ORDER BY created_at DESC
    `;
    const [feedback]: any = await pool.execute(query);

    const response: ApiResponse = {
      success: true,
      message: 'Feedback retrieved successfully',
      data: feedback
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
});

// Create anonymous feedback (public, no authentication required)
router.post('/anonymous', async (req, res) => {
  try {
    const {
      customer_name,
      email,
      feedback_type = 'general',
      rating,
      feedback_text
    } = req.body;

    // Validate required fields
    if (!feedback_text) {
      return res.status(400).json({
        success: false,
        message: 'Feedback text is required'
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
        customer_name, email, feedback_type, 
        rating, feedback_text, status
      ) VALUES (?, ?, ?, ?, ?, 'pending')
    `;

    const [result]: any = await pool.execute(query, [
      customer_name || 'Anonymous Customer',
      email || 'anonymous@feedback.com',
      feedback_type,
      rating || null,
      feedback_text
    ]);

    const response: ApiResponse = {
      success: true,
      message: 'Feedback submitted successfully',
      data: { id: result.insertId }
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Error creating anonymous feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
});

// Create new feedback (customer)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      customer_name,
      email,
      feedback_type = 'general',
      rating,
      feedback_text,
      order_id
    } = req.body;

    // Get customer_id from authenticated user
    const customer_id = (req as any).user?.userId || null;

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

    const [result]: any = await pool.execute(query, [
      customer_id,
      customer_name,
      email || null,
      feedback_type,
      rating || null,
      feedback_text,
      order_id || null
    ]);

    const response: ApiResponse = {
      success: true,
      message: 'Feedback submitted successfully',
      data: { id: result.insertId }
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Error creating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit feedback',
      error: error.message
    });
  }
});

// Get feedback by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const query = 'SELECT * FROM customer_feedback WHERE id = ?';
    const [feedback]: any = await pool.execute(query, [id]);

    if (feedback.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found'
      });
    }

    const response: ApiResponse = {
      success: true,
      message: 'Feedback retrieved successfully',
      data: feedback[0]
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch feedback',
      error: error.message
    });
  }
});

// Update feedback status (admin only)
router.put('/:id/status', authenticateToken, async (req, res) => {
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

    const admin_id = (req as any).user?.userId || null;

    let query = 'UPDATE customer_feedback SET status = ?';
    const params: any[] = [status];

    if (admin_response) {
      query += ', admin_response = ?, responded_by = ?, responded_at = NOW()';
      params.push(admin_response, admin_id);
    }

    query += ', updated_at = NOW() WHERE id = ?';
    params.push(id);

    await pool.execute(query, params);

    const response: ApiResponse = {
      success: true,
      message: 'Feedback status updated successfully'
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error updating feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update feedback',
      error: error.message
    });
  }
});

export default router;
