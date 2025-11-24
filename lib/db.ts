import Database from 'better-sqlite3';
import path from 'path';

// Create or connect to SQLite database
const db = new Database(path.join(process.cwd(), 'data', 'ecommerce.db'));

// Initialize database tables
export const initDatabase = () => {
    // Create FAQs table
    db.exec(`
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT NOT NULL,
      tags TEXT
    )
  `);

    // Create products table
    db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      stock INTEGER DEFAULT 0,
      rating REAL,
      brand TEXT,
      warranty TEXT,
      features TEXT
    )
  `);

    // Create orders table
    db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderId TEXT NOT NULL,
      customerId TEXT,
      customerName TEXT NOT NULL,
      customerEmail TEXT,
      customerPhone TEXT,
      status TEXT NOT NULL,
      orderDate TEXT NOT NULL,
      totalAmount REAL,
      paymentMethod TEXT,
      shippingAddress TEXT,
      trackingNumber TEXT,
      estimatedDelivery TEXT,
      items TEXT
    )
  `);

    // Create conversations table (optional)
    db.exec(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      message TEXT NOT NULL,
      sender TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      intent TEXT
    )
  `);
};

// Database helper functions
export const getFAQs = () => {
    return db.prepare('SELECT * FROM faqs').all();
};

export const searchFAQs = (keywords: string[]) => {
    const query = keywords.map(k => `question LIKE '%${k}%' OR answer LIKE '%${k}%' OR category LIKE '%${k}%'`).join(' OR ');
    return db.prepare(`SELECT * FROM faqs WHERE ${query} LIMIT 3`).all();
};

export const getProducts = () => {
    return db.prepare('SELECT * FROM products').all();
};

export const searchProducts = (category?: string, maxPrice?: number, tags?: string) => {
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (category) {
        query += ' AND category LIKE ?';
        params.push(`%${category}%`);
    }

    if (maxPrice) {
        query += ' AND price <= ?';
        params.push(maxPrice);
    }

    if (tags) {
        query += ' AND (brand LIKE ? OR features LIKE ?)';
        params.push(`%${tags}%`, `%${tags}%`);
    }

    query += ' LIMIT 5';

    return db.prepare(query).all(...params);
};

export const getOrderById = (orderId: string) => {
    const query = `
    SELECT o.*, p.name as product_name, p.brand, p.price 
    FROM orders o 
    LEFT JOIN products p ON CAST(o.items AS INTEGER) = p.id 
    WHERE o.orderId = ?
  `;
    return db.prepare(query).get(orderId);
};

export const saveConversation = (sessionId: string, message: string, sender: 'user' | 'bot', intent?: string) => {
    const stmt = db.prepare(`
    INSERT INTO conversations (session_id, message, sender, timestamp, intent)
    VALUES (?, ?, ?, ?, ?)
  `);
    return stmt.run(sessionId, message, sender, new Date().toISOString(), intent);
};

// Initialize database on module load
initDatabase();

export default db;