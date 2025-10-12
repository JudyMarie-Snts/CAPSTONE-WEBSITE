"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const database_1 = require("../config/database");
const router = express_1.default.Router();
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
        const [rows] = await database_1.pool.execute(`
      SELECT 
        mi.id,
        mi.product_code,
        mi.name,
        mi.description,
        mi.selling_price,
        mi.image_url,
        mi.is_unlimited,
        mi.is_premium,
        mc.name as category_name
      FROM menu_items mi
      LEFT JOIN menu_categories mc ON mi.category_id = mc.id
      ${whereClause}
      ORDER BY mi.name
    `);
        res.json({
            success: true,
            data: rows
        });
    }
    catch (error) {
        console.error('Error fetching menu items:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch menu items'
        });
    }
});
// Get all inventory items
router.get('/items', auth_1.authenticateToken, async (req, res) => {
    try {
        const [rows] = await database_1.pool.execute(`
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
    `);
        res.json({
            success: true,
            data: rows
        });
    }
    catch (error) {
        console.error('Error fetching inventory:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inventory data'
        });
    }
});
// Get inventory categories
router.get('/categories', auth_1.authenticateToken, async (req, res) => {
    try {
        const [rows] = await database_1.pool.execute(`
      SELECT id, name, description, sort_order
      FROM menu_categories
      WHERE is_active = TRUE
      ORDER BY sort_order
    `);
        res.json({
            success: true,
            data: rows
        });
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories'
        });
    }
});
// Get inventory statistics
router.get('/stats', auth_1.authenticateToken, async (req, res) => {
    try {
        const [totalItems] = await database_1.pool.execute(`
      SELECT COUNT(*) as total FROM menu_items
    `);
        // Calculate total sales revenue from completed orders
        const [totalValue] = await database_1.pool.execute(`
      SELECT COALESCE(SUM(total_amount), 0) as total_value 
      FROM orders
      WHERE status = 'completed'
    `);
        const [lowStock] = await database_1.pool.execute(`
      SELECT COUNT(*) as low_stock FROM menu_items
      WHERE quantity_in_stock <= 10 AND is_unlimited = FALSE
    `);
        const [outOfStock] = await database_1.pool.execute(`
      SELECT COUNT(*) as out_of_stock FROM menu_items
      WHERE quantity_in_stock = 0 AND is_unlimited = FALSE
    `);
        res.json({
            success: true,
            data: {
                total_items: totalItems[0].total,
                total_value: totalValue[0].total_value || 0,
                low_stock: lowStock[0].low_stock,
                out_of_stock: outOfStock[0].out_of_stock
            }
        });
    }
    catch (error) {
        console.error('Error fetching inventory stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch inventory statistics'
        });
    }
});
// Add new inventory item
router.post('/items', auth_1.authenticateToken, async (req, res) => {
    try {
        const { product_code, name, description, category_id, selling_price, purchase_price, purchase_value, quantity_in_stock, unit_type, availability, image_url, is_unlimited, is_premium } = req.body;
        const [result] = await database_1.pool.execute(`
      INSERT INTO menu_items (
        product_code, name, description, category_id, selling_price,
        purchase_price, purchase_value, quantity_in_stock, unit_type,
        availability, image_url, is_unlimited, is_premium
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            product_code, name, description, category_id, selling_price,
            purchase_price, purchase_value, quantity_in_stock, unit_type,
            availability, image_url, is_unlimited, is_premium
        ]);
        res.json({
            success: true,
            message: 'Inventory item added successfully',
            data: { id: result.insertId }
        });
    }
    catch (error) {
        console.error('Error adding inventory item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add inventory item'
        });
    }
});
// Update inventory item
router.put('/items/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { product_code, name, description, category_id, selling_price, purchase_price, purchase_value, quantity_in_stock, unit_type, availability, image_url, is_unlimited, is_premium } = req.body;
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
        await database_1.pool.execute(`
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
    }
    catch (error) {
        console.error('Error updating inventory item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update inventory item'
        });
    }
});
// Delete inventory item
router.delete('/items/:id', auth_1.authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.pool.execute('DELETE FROM menu_items WHERE id = ?', [id]);
        res.json({
            success: true,
            message: 'Inventory item deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting inventory item:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete inventory item'
        });
    }
});
exports.default = router;
//# sourceMappingURL=inventory.js.map