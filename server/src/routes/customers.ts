import express from 'express';
import { Pool } from 'mysql2/promise';
import { authenticateToken } from '../middleware/auth';
import { pool } from '../config/database';
import { Customer, ApiResponse } from '../types';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Get all customers with pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('GET /api/customers - Request received');
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const searchEmail = req.query.email as string;

    console.log('Query parameters:', { page, limit, offset, searchEmail });

    try {
      let whereClause = '';
      let queryParams: any[] = [];

      // Add email filter if provided
      if (searchEmail) {
        whereClause = 'WHERE email = ?';
        queryParams.push(searchEmail);
      }

      // First, get total count
      console.log('Executing count query...');
      let countQuery = 'SELECT COUNT(*) as total FROM customers';
      if (whereClause) {
        countQuery += ' ' + whereClause;
      }
      const [countResult]: any = await pool.execute(countQuery, queryParams);
      const total = countResult[0].total;
      console.log('Total customers:', total);

      // Then get paginated data
      let dataQuery = `
        SELECT id, customer_code, first_name, last_name, email, phone,
               date_of_birth, address, city, country, is_active,
               created_at, updated_at
        FROM customers
      `;

      if (whereClause) {
        dataQuery += ' ' + whereClause;
      }

      dataQuery += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';

      const dataParams = [...queryParams, limit, offset];
      console.log('Executing data query:', dataQuery);
      console.log('Query parameters:', dataParams);

      const [customers]: any = await pool.execute(dataQuery, dataParams);
      console.log('Query result:', customers);

      const response: ApiResponse<Customer[]> = {
        success: true,
        message: 'Customers retrieved successfully',
        data: customers,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };

      console.log('Sending response:', response);
      res.json(response);
    } catch (queryError: any) {
      console.error('Database query error:', queryError);
      throw queryError;
    }
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customers',
      error: error.message
    });
  }
});

// Get customer by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT id, customer_code, first_name, last_name, email, phone, 
             date_of_birth, address, city, country, is_active, 
             created_at, updated_at
      FROM customers 
      WHERE id = ?
    `;

    const [customers]: any = await pool.execute(query, [id]);

    if (customers.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    const response: ApiResponse<Customer> = {
      success: true,
      message: 'Customer retrieved successfully',
      data: customers[0]
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error fetching customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer',
      error: error.message
    });
  }
});

// Customer signup (no authentication required)
router.post('/signup', async (req, res) => {
  console.log('Signup request received:', {
    body: req.body,
    headers: req.headers
  });

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Log raw request body for debugging
    console.log('Raw request body:', req.body);
    
    const { first_name, last_name, email, password } = req.body;

    // Validate required fields with more detailed error messages
    const missingFields = [];
    if (!first_name) missingFields.push('first_name');
    if (!email) missingFields.push('email');
    if (!password) missingFields.push('password');
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields
      });
    }

    // Check if email already exists
    const [existingUser]: any = await connection.execute(
      'SELECT id FROM customers WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate customer code
    const [countResult]: any = await connection.execute('SELECT COUNT(*) as total FROM customers');
    const customerCount = countResult[0].total || 0;
    const customer_code = `CUST${String(customerCount + 1).padStart(4, '0')}`;

    // Create customer
    const [result]: any = await connection.execute(
      `INSERT INTO customers (
        customer_code, first_name, last_name, email, password_hash, is_active
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [customer_code, first_name, last_name, email, hashedPassword, 1]
    );

    await connection.commit();

    const response: ApiResponse = {
      success: true,
      message: 'Registration successful',
      data: {
        id: result.insertId,
        customer_code,
        first_name,
        last_name,
        email
      }
    };

    res.status(201).json(response);
  } catch (error: any) {
    await connection.rollback();
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register',
      error: error.message
    });
    connection.release();
  }
});

// Customer login
router.post('/login', async (req, res) => {
  console.log('Login request received:', {
    body: req.body,
    headers: req.headers
  });

  const connection = await pool.getConnection();
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find customer by email
    const [customers]: any = await connection.execute(
      'SELECT * FROM customers WHERE email = ?',
      [email]
    );

    if (customers.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const customer = customers[0];

    // Check if password is correct
    // Handle both password and password_hash columns for backward compatibility
    const storedPassword = customer.password || customer.password_hash;
    
    if (!storedPassword) {
      return res.status(401).json({
        success: false,
        message: 'No password set for this account. Please reset your password.'
      });
    }
    
    const isPasswordValid = await bcrypt.compare(password, storedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await connection.execute(
      'UPDATE customers SET last_login = NOW() WHERE id = ?',
      [customer.id]
    );

    // Generate JWT token
    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { 
        userId: customer.id, 
        email: customer.email, 
        role: 'customer' 
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    // Remove password from response
    const { password_hash, ...customerWithoutPassword } = customer;

    const response = {
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: customerWithoutPassword
      }
    };

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.json(response);
  } catch (error: unknown) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: errorMessage
    });
  } finally {
    connection.release();
  }
});

// Create new customer (admin only)
router.post('/', authenticateToken, async (req, res) => {
  console.log('=== CREATE CUSTOMER REQUEST ===');
  console.log('Headers:', req.headers);
  console.log('Request body:', req.body);
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { 
      first_name, 
      last_name, 
      email, 
      phone,
      date_of_birth,
      address,
      city,
      country,
      is_active = 1
    } = req.body;

    // Get customer count for generating customer code
    const [countResult]: any = await connection.execute('SELECT COUNT(*) as total FROM customers');
    const customerCount = countResult[0].total || 0;
    const customer_code = `CUST${String(customerCount + 1).padStart(4, '0')}`;

    // Check if email already exists (if provided)
    if (email) {
      const emailQuery = 'SELECT id FROM customers WHERE email = ?';
      const [emailResult]: any = await pool.execute(emailQuery, [email]);
      if (emailResult.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    const query = `
      INSERT INTO customers (
        customer_code, first_name, last_name, email, phone, 
        date_of_birth, address, city, country, is_active, password_hash
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result]: any = await connection.execute(query, [
      customer_code,
      first_name,
      last_name,
      email || null,
      phone || null,
      date_of_birth || null,
      address || null,
      city || null,
      country || null,
      is_active,
      null // password_hash can be null for customers created through reservations
    ]);

    const response: ApiResponse = {
      success: true,
      message: 'Customer created successfully',
      data: { id: result.insertId, customer_code }
    };

    res.status(201).json(response);
  } catch (error: any) {
    console.error('Error creating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create customer',
      error: error.message
    });
  }
});

// Update customer
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      phone,
      date_of_birth,
      address,
      city,
      country,
      is_active
    } = req.body;

    // Check if customer exists
    const checkQuery = 'SELECT id FROM customers WHERE id = ?';
    const [checkResult]: any = await pool.execute(checkQuery, [id]);
    if (checkResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Check if email already exists (if provided and different from current)
    if (email) {
      const emailQuery = 'SELECT id FROM customers WHERE email = ? AND id != ?';
      const [emailResult]: any = await pool.execute(emailQuery, [email, id]);
      if (emailResult.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }
    }

    const query = `
      UPDATE customers SET 
        first_name = ?, last_name = ?, email = ?, phone = ?, 
        date_of_birth = ?, address = ?, city = ?, country = ?, 
        is_active = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await pool.execute(query, [
      first_name,
      last_name,
      email || null,
      phone || null,
      date_of_birth || null,
      address || null,
      city || null,
      country || null,
      is_active !== undefined ? is_active : true,
      id
    ]);

    const response: ApiResponse = {
      success: true,
      message: 'Customer updated successfully'
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error updating customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer',
      error: error.message
    });
  }
});

// Delete customer
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if customer exists
    const checkQuery = 'SELECT id FROM customers WHERE id = ?';
    const [checkResult]: any = await pool.execute(checkQuery, [id]);
    if (checkResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Check if customer has any orders or reservations
    const ordersQuery = 'SELECT COUNT(*) as count FROM orders WHERE customer_id = ?';
    const [ordersResult]: any = await pool.execute(ordersQuery, [id]);
    
    const reservationsQuery = 'SELECT COUNT(*) as count FROM reservations WHERE customer_id = ?';
    const [reservationsResult]: any = await pool.execute(reservationsQuery, [id]);

    if (ordersResult[0].count > 0 || reservationsResult[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete customer with existing orders or reservations'
      });
    }

    const query = 'DELETE FROM customers WHERE id = ?';
    await pool.execute(query, [id]);

    const response: ApiResponse = {
      success: true,
      message: 'Customer deleted successfully'
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      error: error.message
    });
  }
});

// Get customer statistics
router.get('/stats/overview', authenticateToken, async (req, res) => {
  try {
    // Total customers
    const totalQuery = 'SELECT COUNT(*) as total FROM customers';
    const [totalResult]: any = await pool.execute(totalQuery);

    // Active customers
    const activeQuery = 'SELECT COUNT(*) as active FROM customers WHERE is_active = 1';
    const [activeResult]: any = await pool.execute(activeQuery);

    // New customers this month
    const thisMonthQuery = `
      SELECT COUNT(*) as new_this_month 
      FROM customers 
      WHERE MONTH(created_at) = MONTH(CURRENT_DATE()) 
      AND YEAR(created_at) = YEAR(CURRENT_DATE())
    `;
    const [thisMonthResult]: any = await pool.execute(thisMonthQuery);

    // Customers with orders
    const withOrdersQuery = `
      SELECT COUNT(DISTINCT customer_id) as with_orders 
      FROM orders 
      WHERE customer_id IS NOT NULL
    `;
    const [withOrdersResult]: any = await pool.execute(withOrdersQuery);

    const response: ApiResponse = {
      success: true,
      message: 'Customer statistics retrieved successfully',
      data: {
        total_customers: totalResult[0].total,
        active_customers: activeResult[0].active,
        new_this_month: thisMonthResult[0].new_this_month,
        customers_with_orders: withOrdersResult[0].with_orders
      }
    };

    res.json(response);
  } catch (error: any) {
    console.error('Error fetching customer statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch customer statistics',
      error: error.message
    });
  }
});

// Customer registration
router.post('/register', async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone, address } = req.body;
    
    console.log('Registration request for email:', email);
    
    // Validate input
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, first name, and last name are required'
      });
    }
    
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Check if customer already exists
    const checkQuery = 'SELECT id FROM customers WHERE email = ?';
    const [existingCustomer]: any = await pool.execute(checkQuery, [email]);
    
    if (existingCustomer.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Customer with this email already exists'
      });
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Address column should already exist in the customers table
    
    // Generate customer code
    const customerCode = `CUST${Date.now()}`;
    
    // Insert new customer
    const insertQuery = `
      INSERT INTO customers (customer_code, first_name, last_name, email, password_hash, phone, address, is_active, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
    `;
    
    const [result]: any = await pool.execute(insertQuery, [
      customerCode,
      first_name,
      last_name,
      email,
      hashedPassword,
      phone || null,
      address || null
    ]);
    
    console.log('Customer registration successful for email:', email);
    
    const response: ApiResponse = {
      success: true,
      message: 'Customer registered successfully',
      data: {
        id: result.insertId,
        customer_code: customerCode,
        email: email
      }
    };
    
    res.status(201).json(response);
  } catch (error: any) {
    console.error('Error registering customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register customer',
      error: error.message
    });
  }
});

// Reset customer password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    console.log('Password reset request for email:', email);
    
    // Validate input
    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email and new password are required'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }
    
    // Check if customer exists
    const checkQuery = 'SELECT id FROM customers WHERE email = ?';
    const [customerResult]: any = await pool.execute(checkQuery, [email]);
    
    if (customerResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found with this email'
      });
    }
    
    const customer = customerResult[0];
    
    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password in database
    const updateQuery = 'UPDATE customers SET password_hash = ?, updated_at = NOW() WHERE id = ?';
    await pool.execute(updateQuery, [hashedPassword, customer.id]);
    
    console.log('Password reset successful for email:', email);
    
    const response: ApiResponse = {
      success: true,
      message: 'Password reset successfully',
      data: null
    };
    
    res.json(response);
  } catch (error: any) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message
    });
  }
});

export default router;
