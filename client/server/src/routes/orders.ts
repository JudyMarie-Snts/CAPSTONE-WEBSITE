import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { pool } from '../config/database';
import { RowDataPacket } from 'mysql2';

const router = express.Router();

// Get all orders with pagination and filtering
router.get('/', async (req, res) => {
  try {
    console.log('Orders API called with params:', req.query);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const status = (req.query.status as string) || 'all';
    
    console.log('Parsed params:', { page, limit, search, status });
    
    const offset = (page - 1) * limit;
    
    let whereConditions = [];
    let queryParams: any[] = [];
    
    // Add search conditions
    if (search) {
      whereConditions.push(`(o.order_code LIKE ? OR o.customer_name LIKE ? OR c.first_name LIKE ? OR c.last_name LIKE ?)`);
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }
    
    // Add status filter
    if (status !== 'all') {
      whereConditions.push(`o.status = ?`);
      queryParams.push(status);
    }
    
    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';
    
    // Count total records
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ${whereClause}
    `;
    
    const [countResult] = await pool.execute<RowDataPacket[]>(countQuery, queryParams);
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    // Get orders with pagination
    const ordersQuery = `
      SELECT 
        o.id,
        o.order_code,
        o.customer_id,
        o.customer_name,
        o.order_type,
        o.subtotal,
        o.discount_amount,
        o.tax_amount,
        o.total_amount,
        o.status,
        o.payment_status,
        o.order_date,
        o.order_time,
        o.completed_at,
        o.notes,
        o.created_at,
        o.updated_at,
        COUNT(oi.id) as item_count,
        rt.table_number as table_no,
        rt.table_code,
        SUM(oi.quantity) as quantity
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN restaurant_tables rt ON o.table_id = rt.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    queryParams.push(limit, offset);
    const [ordersResult] = await pool.execute<RowDataPacket[]>(ordersQuery, queryParams);
    
    res.json({
      success: true,
      message: 'Orders retrieved successfully',
      data: ordersResult,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Get orders statistics
router.get('/stats/overview', async (req, res) => {
  try {
    console.log('Stats API called');
    const statsQuery = `
      SELECT 
        COUNT(*) as total_orders,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COALESCE(SUM(CASE WHEN status = 'completed' THEN total_amount ELSE 0 END), 0) as total_revenue,
        COUNT(CASE WHEN DATE(created_at) = CURDATE() THEN 1 END) as today_orders,
        COALESCE(SUM(CASE WHEN DATE(created_at) = CURDATE() AND status = 'completed' THEN total_amount ELSE 0 END), 0) as today_revenue
      FROM orders
    `;
    
    const [statsResult] = await pool.execute<RowDataPacket[]>(statsQuery);
    
    res.json({
      success: true,
      message: 'Orders statistics retrieved successfully',
      data: statsResult[0]
    });

  } catch (error) {
    console.error('Error fetching orders statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders statistics',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

// Get orders by customer ID
router.get('/customer/:customerId', authenticateToken, async (req, res) => {
  try {
    const customerId = parseInt(req.params.customerId);
    
    if (!customerId || isNaN(customerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID'
      });
    }

    const query = `
      SELECT 
        o.id,
        o.order_code,
        o.customer_id,
        o.customer_name,
        o.order_type,
        o.subtotal,
        o.discount_amount,
        o.tax_amount,
        o.total_amount,
        o.status,
        o.payment_status,
        o.order_date,
        o.order_time,
        o.completed_at,
        o.notes,
        o.created_at,
        o.updated_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.customer_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;

    const [rows] = await pool.execute<RowDataPacket[]>(query, [customerId]);

    res.json({
      success: true,
      message: 'Customer orders retrieved successfully',
      data: rows
    });

  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer orders',
      error: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
});

export default router;
