import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { pool } from '../config/database';
import { RowDataPacket, OkPacket } from 'mysql2';

const router = express.Router();

// Get all menu items for feedback selection (no authentication required)
router.get('/menu-items/all', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        mi.id,
        mi.name,
        mc.name as category_name,
        mi.selling_price
      FROM menu_items mi
      LEFT JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.availability = 'available'
      ORDER BY mc.sort_order, mi.name
    `) as [RowDataPacket[], any];

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching all menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items'
    });
  }
});

// Get public menu items by category (no authentication required)
router.get('/menu/:category', async (req, res) => {
  try {
    const { category } = req.params;
    let whereClause = '';
    
    // Map category names to database conditions
    switch (category.toLowerCase()) {
      case 'unlimited':
        whereClause = "WHERE mc.name = 'Unlimited Menu' AND mi.availability = 'available'";
        break;
      case 'alacarte':
        whereClause = "WHERE mc.name = 'Ala Carte Menu' AND mi.availability = 'available'";
        break;
      case 'sidedishes':
        whereClause = "WHERE mc.name = 'Side Dishes' AND mi.availability = 'available'";
        break;
      default:
        whereClause = "WHERE mi.availability = 'available'";
    }

    // First get menu items with ratings
    const [rows] = await pool.execute(`
      SELECT 
        mi.id,
        mi.product_code,
        mi.name,
        mi.description,
        mi.selling_price,
        mi.image_url,
        mi.is_unlimited,
        mi.is_premium,
        mc.name as category_name,
        COALESCE(ROUND(AVG(cf.rating), 1), 0) as average_rating,
        COUNT(cf.rating) as total_reviews
      FROM menu_items mi
      LEFT JOIN menu_categories mc ON mi.category_id = mc.id
      LEFT JOIN customer_feedback cf ON mi.id = cf.menu_item_id AND cf.status = 'resolved' AND cf.rating IS NOT NULL
      ${whereClause}
      GROUP BY mi.id, mi.product_code, mi.name, mi.description, mi.selling_price, 
               mi.image_url, mi.is_unlimited, mi.is_premium, mc.name
      ORDER BY mi.name
    `) as [RowDataPacket[], any];

    // Get recent reviews for each menu item
    const menuItemsWithReviews = await Promise.all(
      rows.map(async (item: any) => {
        const [reviews] = await pool.execute(`
          SELECT 
            customer_name,
            rating,
            feedback_text,
            created_at
          FROM customer_feedback 
          WHERE menu_item_id = ? AND status = 'resolved' AND rating IS NOT NULL
          ORDER BY created_at DESC
          LIMIT 3
        `, [item.id]) as [RowDataPacket[], any];

        return {
          ...item,
          recent_reviews: reviews
        };
      })
    );

    res.json({
      success: true,
      data: menuItemsWithReviews
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch menu items'
    });
  }
});

// Get all inventory items
router.get('/items', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT 
        mi.id,
        mi.product_code,
        mi.name,
        mi.description,
        mi.selling_price,
        mi.purchase_price,
        mi.purchase_value,
        mi.quantity_in_stock,
        mi.unit_type,
        mi.availability,
        mi.image_url,
        mi.is_unlimited,
        mi.is_premium,
        mi.created_at,
        mi.updated_at,
        mc.name as category_name,
        mc.id as category_id
      FROM menu_items mi
      LEFT JOIN menu_categories mc ON mi.category_id = mc.id
      ORDER BY mc.sort_order, mi.name
    `) as [RowDataPacket[], any];

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory data'
    });
  }
});

// Get inventory categories
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, name, description, sort_order
      FROM menu_categories
      WHERE is_active = TRUE
      ORDER BY sort_order
    `) as [RowDataPacket[], any];

    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories'
    });
  }
});

// Get inventory statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [totalItems] = await pool.execute(`
      SELECT COUNT(*) as total FROM menu_items
    `) as [RowDataPacket[], any];

    // Calculate total sales revenue from completed orders
    const [totalValue] = await pool.execute(`
      SELECT COALESCE(SUM(total_amount), 0) as total_value 
      FROM orders
      WHERE status = 'completed'
    `) as [RowDataPacket[], any];

    const [lowStock] = await pool.execute(`
      SELECT COUNT(*) as low_stock FROM menu_items
      WHERE quantity_in_stock <= 10 AND is_unlimited = FALSE
    `) as [RowDataPacket[], any];

    const [outOfStock] = await pool.execute(`
      SELECT COUNT(*) as out_of_stock FROM menu_items
      WHERE quantity_in_stock = 0 AND is_unlimited = FALSE
    `) as [RowDataPacket[], any];

    res.json({
      success: true,
      data: {
        total_items: totalItems[0].total,
        total_value: totalValue[0].total_value || 0,
        low_stock: lowStock[0].low_stock,
        out_of_stock: outOfStock[0].out_of_stock
      }
    });
  } catch (error) {
    console.error('Error fetching inventory stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory statistics'
    });
  }
});

// Add new inventory item
router.post('/items', authenticateToken, async (req, res) => {
  try {
    const {
      product_code,
      name,
      description,
      category_id,
      selling_price,
      purchase_price,
      purchase_value,
      quantity_in_stock,
      unit_type,
      availability,
      image_url,
      is_unlimited,
      is_premium
    } = req.body;

    const [result] = await pool.execute(`
      INSERT INTO menu_items (
        product_code, name, description, category_id, selling_price,
        purchase_price, purchase_value, quantity_in_stock, unit_type,
        availability, image_url, is_unlimited, is_premium
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      product_code, name, description, category_id, selling_price,
      purchase_price, purchase_value, quantity_in_stock, unit_type,
      availability, image_url, is_unlimited, is_premium
    ]) as [OkPacket, any];

    res.json({
      success: true,
      message: 'Inventory item added successfully',
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error('Error adding inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add inventory item'
    });
  }
});

// Update inventory item
router.put('/items/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_code,
      name,
      description,
      category_id,
      selling_price,
      purchase_price,
      purchase_value,
      quantity_in_stock,
      unit_type,
      availability,
      image_url,
      is_unlimited,
      is_premium
    } = req.body;

    // Convert undefined values to null for MySQL
    const sanitizedData = [
      product_code || null,
      name || null,
      description || null,
      category_id || null,
      selling_price || null,
      purchase_price || null,
      purchase_value || null,
      quantity_in_stock || null,
      unit_type || null,
      availability || null,
      image_url || null,
      is_unlimited || false,
      is_premium || false,
      id
    ];

    await pool.execute(`
      UPDATE menu_items SET
        product_code = ?, name = ?, description = ?, category_id = ?,
        selling_price = ?, purchase_price = ?, purchase_value = ?,
        quantity_in_stock = ?, unit_type = ?, availability = ?,
        image_url = ?, is_unlimited = ?, is_premium = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, sanitizedData);

    res.json({
      success: true,
      message: 'Inventory item updated successfully'
    });
  } catch (error) {
    console.error('Error updating inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update inventory item'
    });
  }
});

// Delete inventory item
router.delete('/items/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM menu_items WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Inventory item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete inventory item'
    });
  }
});

export default router;
