"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
exports.initDatabase = initDatabase;
exports.executeQuery = executeQuery;
exports.executeTransaction = executeTransaction;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'siszum_pos',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, // 10 seconds
    acquireTimeout: 60000, // 60 seconds
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000, // 10 seconds
    ssl: process.env.DB_SSL === 'true' ? {
        rejectUnauthorized: false
    } : undefined,
    debug: process.env.NODE_ENV === 'development'
};
// Create connection pool
exports.pool = promise_1.default.createPool(dbConfig);
// Initialize database - create database if it doesn't exist
async function initDatabase() {
    let tempConnection;
    try {
        console.log('🔌 Attempting to connect to database...');
        console.log(`   Host: ${dbConfig.host}`);
        console.log(`   User: ${dbConfig.user}`);
        console.log(`   Database: ${dbConfig.database}`);
        // First connect without database name to create database if needed
        const tempConfig = {
            host: dbConfig.host,
            port: dbConfig.port,
            user: dbConfig.user,
            password: dbConfig.password,
            connectTimeout: 10000
        };
        console.log('🔧 Creating temporary connection...');
        tempConnection = await promise_1.default.createConnection(tempConfig);
        console.log('🔨 Creating database if not exists...');
        await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        // Close temporary connection
        await tempConnection.end();
        // Test the pool connection
        console.log('🔍 Testing pool connection...');
        const connection = await exports.pool.getConnection();
        await connection.ping();
        // Create customers table if it doesn't exist
        console.log('🔨 Creating customers table if not exists...');
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_code VARCHAR(20) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        date_of_birth DATE,
        address TEXT,
        city VARCHAR(100),
        country VARCHAR(100),
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
        connection.release();
        console.log('✅ Database and tables initialized successfully');
        return true;
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        // Close connection if it was created
        if (tempConnection) {
            try {
                await tempConnection.end();
            }
            catch (e) {
                console.error('Error closing temporary connection:', e);
            }
        }
        throw new Error(`Database connection failed: ${error.message}`);
    }
}
// Helper function to execute queries
async function executeQuery(query, params = []) {
    try {
        const [results] = await exports.pool.execute(query, params);
        return results;
    }
    catch (error) {
        console.error('Query execution error:', error);
        throw error;
    }
}
// Helper function for transactions
async function executeTransaction(queries) {
    const connection = await exports.pool.getConnection();
    try {
        await connection.beginTransaction();
        const results = [];
        for (const { query, params } of queries) {
            const [result] = await connection.execute(query, params);
            results.push(result);
        }
        await connection.commit();
        return results;
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
}
//# sourceMappingURL=database.js.map